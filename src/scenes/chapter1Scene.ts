import { BlinkingStatus, FaceDetectorScene } from "../FaceDetectorScene";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = 
{
	active: false,
	visible: false,
	key: 'Chapter1',
};
  
export class Chapter1Scene extends FaceDetectorScene
{
	constructor() 
	{
	  super(sceneConfig);
	}
	
	public preload()
	{
		console.log('Preload')
	}
   
	public create() 
	{

	}
   
	public update() 
	{
	  // TODO
	}

	onBlinkStatusChanged(status: BlinkingStatus): void {
		
	}
}