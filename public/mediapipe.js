async function activateDetector()
{
  const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
  const detectorConfig = {
    runtime: 'mediapipe',
    solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh'
  };
  return await faceLandmarksDetection.createDetector(model, detectorConfig);
}