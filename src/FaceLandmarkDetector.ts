import "@tensorflow/tfjs-backend-webgl";
import "@mediapipe/face_mesh";

import { Camera } from "./Camera";

import {
  Face,
  FaceLandmarksDetector,
  MediaPipeFaceMeshMediaPipeModelConfig,
  SupportedModels,
  createDetector,
} from "@tensorflow-models/face-landmarks-detection";
import { BlinkingStatus, FaceDetectorScene } from "./FaceDetectorScene";
import { game } from "./main";

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

  smoothFace!: Face;
  smoothingFactor = 0.8;
  faceInit: boolean = true;

  static async setup() {
    Detector.default = new Detector();

    await Camera.setup();

    const detectorConfig : MediaPipeFaceMeshMediaPipeModelConfig = 
    {
      runtime: 'mediapipe', // or 'tfjs'
      refineLandmarks: true,
      solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh`,
    }

    Detector.default.detector = await createDetector(SupportedModels.MediaPipeFaceMesh, detectorConfig);
    await Detector!.default!.renderPrediction();
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
      // const averageInferenceTime = this.inferenceTimeSum / this.numInferences;
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

    if (this.detector != null) {
      this.beginEstimateFaceStats();

      try {
        let faces = (await this.detector?.estimateFaces(
          Camera.defaultCamera.video,
          { flipHorizontal: false }
        )) as Array<Face>;
        if (faces.length == 1) {
          let newFace = faces[0];

          if (this.smoothFace == null && this.faceInit == true) {
            console.log("First Face");
            this.smoothFace = newFace;
            this.faceInit = false;
          } else {
            this.smoothFace = {
              box: {
                xMin: Math.round(
                  this.smoothFace.box.xMin * this.smoothingFactor +
                    newFace.box.xMin * (1 - this.smoothingFactor)
                ),
                xMax: Math.round(
                  this.smoothFace.box.xMax * this.smoothingFactor +
                    newFace.box.xMax * (1 - this.smoothingFactor)
                ),
                yMin: Math.round(
                  this.smoothFace.box.yMin * this.smoothingFactor +
                    newFace.box.yMin * (1 - this.smoothingFactor)
                ),
                yMax: Math.round(
                  this.smoothFace.box.yMax * this.smoothingFactor +
                    newFace.box.yMax * (1 - this.smoothingFactor)
                ),
                width: Math.round(
                  this.smoothFace.box.width * this.smoothingFactor +
                    newFace.box.width * (1 - this.smoothingFactor)
                ),
                height: Math.round(
                  this.smoothFace.box.height * this.smoothingFactor +
                    newFace.box.height * (1 - this.smoothingFactor)
                ),
              },
              keypoints: [...newFace.keypoints],
            };
          }

          await this.calculatePosition(this.smoothFace);
        }
      } catch (error) {
        this.detector?.dispose();
        alert(error);
      }
      this.endEstimateFaceStats();
    }
  }

  async calculatePosition(face: Face) {
    this.translateX =
      (Camera.videoConfig.video.width - (face.box.xMin + face.box.width / 2)) /
      Camera.videoConfig.video.width;
    this.translateY =
      (face.box.yMin + face.box.height / 1.8) / Camera.videoConfig.video.height;

    //normalize translateX from -0.7 to 1.7
    this.translateX = this.translateX * 2.4 - 0.7;
    //normalize translateY from -0.7 to 1.7
    this.translateY = this.translateY * 2.4 - 0.7;

    //format translateX and translateY
    this.translateX = Math.round(this.translateX * 1000) / 1000;
    this.translateY = Math.round(this.translateY * 1000) / 1000;

    this.scale =
      Math.round(
        (Camera.videoConfig.video.height / 2 / face.box.height) * 100
      ) / 100;

    // 159: Left eye lid up / 145: Left eye lid down / 385: Right eye lid up / 380: Right eye lid down
    let leftEyeLidDistance = Math.abs(Math.round(
      face.keypoints[159].y - face.keypoints[145].y
    ));
    let rightEyeLidDistance = Math.abs(Math.round(
      face.keypoints[386].y - face.keypoints[374].y
    ));
    
    let blinkDistance = 9 / this.scale;
    // console.log('Left Eye: ' + leftEyeLidDistance + ' / Right Eye: ' + rightEyeLidDistance + ' / Scale : ' + blinkDistance);

    let newBlink: BlinkingStatus;
    // Changing status based on the distance between eye lid
    // FIX: Need to make it more accurate when detecting blinking. The distance between eye lid is changing due to head zoom.
    if (leftEyeLidDistance > blinkDistance && rightEyeLidDistance > blinkDistance) {
      newBlink = BlinkingStatus.Both;
    } else if (leftEyeLidDistance < blinkDistance && rightEyeLidDistance >= blinkDistance) {
      newBlink = BlinkingStatus.LeftEye;
    } else if (leftEyeLidDistance >= blinkDistance && rightEyeLidDistance < blinkDistance) {
      newBlink = BlinkingStatus.RightEye;
    } else {
      newBlink = BlinkingStatus.None;
    }

    if (this.blinkingStatus != newBlink) {
      if (this.blinkConfirmationDelay == 10) {
        this.blinkingStatus = this._previousBlink;
        this.blinkConfirmationDelay = 0;
        let currentScene = (game.scene.getAt(0) as FaceDetectorScene);
        if (currentScene && currentScene.onBlinkStatusChanged && currentScene.scene.isActive(currentScene)) 
        {
          currentScene.onBlinkStatusChanged(this.blinkingStatus);
        }
      } else if (newBlink != this._previousBlink) {
        this._previousBlink = newBlink;
        this.blinkConfirmationDelay = 0;
      } else {
        this.blinkConfirmationDelay += 1;
      }
    }
  }
}
