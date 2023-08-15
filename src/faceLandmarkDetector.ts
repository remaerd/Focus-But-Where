import '@tensorflow/tfjs-backend-webgl';

import * as faceMesh from '@mediapipe/face_mesh';
import * as tensorflow from '@tensorflow/tfjs-backend-wasm';

tensorflow.setWasmPaths( `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${tensorflow.version_wasm}/dist/`);

import { Camera } from './camera';

import { FaceLandmarksDetector, MediaPipeFaceMeshMediaPipeModelConfig, SupportedModels, createDetector } from '@tensorflow-models/face-landmarks-detection';

export class Detector
{
	static default?: Detector;

	detector?: FaceLandmarksDetector;

	startInferenceTime = 0;
	numInferences = 0;
	inferenceTimeSum = 0;
	lastPanelUpdate = 0;
	rafId?: number;

	static async setup()
	{
		Detector.default = new Detector();
		
		await Camera.setup();

		let config: MediaPipeFaceMeshMediaPipeModelConfig = 
		{
			runtime: 'mediapipe',
			refineLandmarks: true,
			solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@${faceMesh.VERSION}`
		}
		Detector.default.detector = await createDetector(SupportedModels.MediaPipeFaceMesh, config);
	
		await Detector.default.renderPrediction();
	}

	beginEstimateFaceStats()
	{
		this.startInferenceTime = (performance || Date).now();
	}

	endEstimateFaceStats() 
	{
		const endInferenceTime = (performance || Date).now();
		this.inferenceTimeSum += endInferenceTime - this.startInferenceTime;
		++this.numInferences;

		const panelUpdateMilliseconds = 1000;
		if (endInferenceTime - this.lastPanelUpdate >= panelUpdateMilliseconds) 
		{
			const averageInferenceTime = this.inferenceTimeSum / this.numInferences;
			this.inferenceTimeSum = 0;
			this.numInferences = 0;
			this.lastPanelUpdate = endInferenceTime;
		}
	}

	async renderPrediction() 
	{
		await this.renderResult();
		this.rafId = requestAnimationFrame(()=> this.renderPrediction());
	}

	async renderResult()
	{
		if (Camera.defaultCamera.video.readyState < 2) {
		await new Promise((resolve) => {
			Camera.defaultCamera.video.onloadeddata = () => {
			resolve(Camera.defaultCamera.video);
			};
		});
		}

		let faces = null;

		if (this.detector != null) 
		{
			this.beginEstimateFaceStats();

			try 
				{
				faces = await this.detector?.estimateFaces(Camera.defaultCamera.video, {flipHorizontal: false});
				console.log(faces)
			} 
				catch (error) 
				{
				this.detector?.dispose();
				alert(error);
			}
			this.endEstimateFaceStats();
		}
	}
} 