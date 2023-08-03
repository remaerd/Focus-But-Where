import '@tensorflow/tfjs-backend-webgl';

import * as faceMesh from '@mediapipe/face_mesh';
import * as tensorflow from '@tensorflow/tfjs-backend-wasm'

tensorflow.setWasmPaths( `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${tensorflow.version_wasm}/dist/`);

import { Camera } from './camera';

import { FaceLandmarksDetector, MediaPipeFaceMeshMediaPipeModelConfig, SupportedModels, createDetector } from '@tensorflow-models/face-landmarks-detection';

let detector: FaceLandmarksDetector

let startInferenceTime = 0
let numInferences = 0
let inferenceTimeSum = 0
let lastPanelUpdate = 0
let rafId: number;

function beginEstimateFaceStats() 
{
  startInferenceTime = (performance || Date).now();
}

function endEstimateFaceStats() 
{
  const endInferenceTime = (performance || Date).now();
  inferenceTimeSum += endInferenceTime - startInferenceTime;
  ++numInferences;

  const panelUpdateMilliseconds = 1000;
  if (endInferenceTime - lastPanelUpdate >= panelUpdateMilliseconds) {
	const averageInferenceTime = inferenceTimeSum / numInferences;
	inferenceTimeSum = 0;
	numInferences = 0;
	lastPanelUpdate = endInferenceTime;
  }
}

async function renderResult() 
{
  if (Camera.defaultCamera.video.readyState < 2) {
	await new Promise((resolve) => {
	  Camera.defaultCamera.video.onloadeddata = () => {
		resolve(Camera.defaultCamera.video);
	  };
	});
  }

  let faces = null;

  if (detector != null) 
  {
	beginEstimateFaceStats();

	try 
		{
	  faces = await detector.estimateFaces(Camera.defaultCamera.video, {flipHorizontal: false});
			console.log(faces)
	} 
		catch (error) 
		{
	  detector.dispose();
	  alert(error);
	}
	endEstimateFaceStats();
  }
}

async function renderPrediction() 
{
	await renderResult();
  rafId = requestAnimationFrame(renderPrediction);
};

export async function setupFaceLandmarkDetector()
{
	await Camera.setup();

	let config: MediaPipeFaceMeshMediaPipeModelConfig = 
	{
		runtime: 'mediapipe',
		refineLandmarks: true,
		solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@${faceMesh.VERSION}`
	}
	detector = await createDetector(SupportedModels.MediaPipeFaceMesh, config);

	return await renderPrediction();
}