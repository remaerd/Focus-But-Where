import  './faceLandmarkDetector'
import { setupFaceLandmarkDetector } from './faceLandmarkDetector';

async function app() 
{
	try { 
    await setupFaceLandmarkDetector() 
  } 
  catch (error) { console.log(error) }
};

app();