import "@tensorflow/tfjs-backend-webgl";

import * as faceMesh from "@mediapipe/face_mesh";
import * as tensorflow from "@tensorflow/tfjs-backend-wasm";

tensorflow.setWasmPaths(
  `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${tensorflow.version_wasm}/dist/`
);

import { Camera } from "./camera";

import {
  Face,
  FaceLandmarksDetector,
  MediaPipeFaceMeshMediaPipeModelConfig,
  SupportedModels,
  createDetector,
} from "@tensorflow-models/face-landmarks-detection";
import {
  BlinkingStatus,
  FaceDetectorScene,
  IBlinkDetectable,
} from "./FaceDetectorScene";
import { game } from "./main";
import { UIScene } from "./Scenes/UIScene";

export class Detector {
  static default?: Detector;

  detector?: FaceLandmarksDetector;

  startInferenceTime = 0;
  numInferences = 0;
  inferenceTimeSum = 0;
  lastPanelUpdate = 0;
  rafId?: number;

  translateX: number = 0;
  translateY: number = 0;
  scale: number = 0;

  blinkingStatus: BlinkingStatus = BlinkingStatus.None;
  _previousBlink: BlinkingStatus = BlinkingStatus.None;
  blinkConfirmationDelay: number = 0;

  static async setup() {
    Detector.default = new Detector();

    await Camera.setup();

    let config: MediaPipeFaceMeshMediaPipeModelConfig = {
      runtime: "mediapipe",
      refineLandmarks: true,
      solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@${faceMesh.VERSION}`,
    };
    Detector.default.detector = await createDetector(
      SupportedModels.MediaPipeFaceMesh,
      config
    );

    await Detector.default.renderPrediction();
  }

  beginEstimateFaceStats() {
    this.startInferenceTime = (performance || Date).now();
  }

  endEstimateFaceStats() {
    const endInferenceTime = (performance || Date).now();
    this.inferenceTimeSum += endInferenceTime - this.startInferenceTime;
    ++this.numInferences;

    const panelUpdateMilliseconds = 1000;
    if (endInferenceTime - this.lastPanelUpdate >= panelUpdateMilliseconds) {
      const averageInferenceTime = this.inferenceTimeSum / this.numInferences;
      this.inferenceTimeSum = 0;
      this.numInferences = 0;
      this.lastPanelUpdate = endInferenceTime;
    }
  }

  async renderPrediction() {
    await this.renderResult();
    this.rafId = requestAnimationFrame(() => this.renderPrediction());
  }

  async renderResult() {
    if (Camera.defaultCamera.video.readyState < 2) {
      await new Promise((resolve) => {
        Camera.defaultCamera.video.onloadeddata = () => {
          resolve(Camera.defaultCamera.video);
        };
      });
    }

    let faces = null;

    if (this.detector != null) {
      this.beginEstimateFaceStats();

      try {
        faces = (await this.detector?.estimateFaces(
          Camera.defaultCamera.video,
          { flipHorizontal: false }
        )) as Array<Face>;
        if (faces.length == 1) {
          this.calculatePosition(faces[0]);
        }
      } catch (error) {
        this.detector?.dispose();
        alert(error);
      }
      this.endEstimateFaceStats();
    }
  }

  calculatePosition(face: Face) {
    this.translateX =
      (Camera.videoConfig.video.width - (face.box.xMin + face.box.width / 2)) /
      Camera.videoConfig.video.width;
    this.translateY =
      (face.box.yMin + face.box.height / 2) / Camera.videoConfig.video.height;
    this.scale = Math.round(
      Camera.videoConfig.video.height / 2.5 / face.box.height + 1
    );

    // 159: Left eye lid up / 145: Left eye lid down / 385: Right eye lid up / 380: Right eye lid down
    let leftEyeLidDistance = Math.round(
      face.keypoints[159].y - face.keypoints[145].y
    );
    let rightEyeLidDistance = Math.round(
      face.keypoints[385].y - face.keypoints[380].y
    );

    // console.log('Left Eye: ' + leftEyeLidDistance + ' / Right Eye: ' + rightEyeLidDistance)
    // console.log('Scale : ' + this.scale)

    let newBlink: BlinkingStatus;
    // Changing status based on the distance between eye lid
    // FIX: Need to make it more accurate when detecting blinking. The distance between eye lid is changing due to head zoom.
    if (leftEyeLidDistance > -4 && rightEyeLidDistance > -4) {
      newBlink = BlinkingStatus.Both;
    } else if (leftEyeLidDistance < -4 && rightEyeLidDistance >= -4) {
      newBlink = BlinkingStatus.LeftEye;
    } else if (leftEyeLidDistance >= -4 && rightEyeLidDistance < -4) {
      newBlink = BlinkingStatus.RightEye;
    } else {
      newBlink = BlinkingStatus.None;
    }

    if (this.blinkingStatus != newBlink) {
      if (this.blinkConfirmationDelay == 10) {
        this.blinkingStatus = this._previousBlink;
        this.blinkConfirmationDelay = 0;
        let uiScene = (game.scene.getAt(0) as UIScene).currentScene;
        if (uiScene) {
          uiScene.onBlinkStatusChanged(
            this.blinkingStatus
          );
        }
      } else if (newBlink != this._previousBlink) {
        this._previousBlink = newBlink;
        this.blinkConfirmationDelay = 0;
      } else {
        this.blinkConfirmationDelay += 1;
      }
    }

    // console.log('X: ' + this.translateX + '/ Y: ' + this.translateY + '/ SCALE: ' + this.scale )
    //
  }
}
