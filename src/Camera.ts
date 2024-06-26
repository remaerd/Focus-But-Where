export function isiOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent)
}

export function isAndroid() {
  return /Android/i.test(navigator.userAgent)
}

export function isMobile() {
  return isAndroid() || isiOS()
}

export class Camera 
{
	video: HTMLVideoElement

	constructor() {
	  this.video = document.getElementById('video') as HTMLVideoElement
	}

	static defaultCamera: Camera

	static videoConfig = 
	{
		'audio': false,
		'video': {
			facingMode: 'user',
			width: isMobile() ? window.innerHeight : window.innerWidth,
			height: isMobile() ? window.innerWidth : window.innerHeight,
			frameRate: {
			ideal: 60,
			},
		},
	}
	
	static async setup(): Promise<Boolean>
	{
	  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { throw Error("No Camrea Available") }
  
	  const stream = await navigator.mediaDevices.getUserMedia(Camera.videoConfig);
  
	  this.defaultCamera = new Camera();
	  this.defaultCamera.video.srcObject = stream
  
	  await new Promise((resolve) => 
		{
			this.defaultCamera.video.onloadedmetadata = () => {
		  	resolve(this.defaultCamera.video)
			}
	  })
  
	  this.defaultCamera.video.play()
  
	  const videoWidth = this.defaultCamera.video.videoWidth
	  const videoHeight = this.defaultCamera.video.videoHeight
	  // Must set below two lines, otherwise video element doesn't show.
	  this.defaultCamera.video.width = videoWidth
	  this.defaultCamera.video.height = videoHeight
  
	  return true		
	}
}
  