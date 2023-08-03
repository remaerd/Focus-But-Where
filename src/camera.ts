export const VIDEO_SIZE = {
  '640 X 480': {width: 640, height: 480},
  '640 X 360': {width: 640, height: 360},
  '360 X 270': {width: 360, height: 270}
};

export function isiOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function isAndroid() {
  return /Android/i.test(navigator.userAgent);
}

export function isMobile() {
  return isAndroid() || isiOS();
}

export class Camera 
{
	video: HTMLVideoElement

	constructor() {
	  this.video = document.getElementById('video') as HTMLVideoElement;
	}

	static defaultCamera: Camera;

	static async setup(): Promise<Boolean>
	{
	  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { throw Error("No Camrea Available"); }

	  const videoConfig = 
		{
			'audio': false,
			'video': {
				facingMode: 'user',
				width: isMobile() ? VIDEO_SIZE['360 X 270'].width : 640,
				height: isMobile() ? VIDEO_SIZE['360 X 270'].height : 480,
				frameRate: {
				ideal: 60,
				},
			},
	  };
  
	  const stream = await navigator.mediaDevices.getUserMedia(videoConfig);
  
	  this.defaultCamera = new Camera();
	  this.defaultCamera.video.srcObject = stream;
  
	  await new Promise((resolve) => 
		{
			this.defaultCamera.video.onloadedmetadata = () => {
		  	resolve(this.defaultCamera.video);
			};
	  });
  
	  this.defaultCamera.video.play();
  
	  const videoWidth = this.defaultCamera.video.videoWidth;
	  const videoHeight = this.defaultCamera.video.videoHeight;
	  // Must set below two lines, otherwise video element doesn't show.
	  this.defaultCamera.video.width = videoWidth;
	  this.defaultCamera.video.height = videoHeight;
  
	  return true;		
	}
}
  