import { FaceDetectorScene } from "../FaceDetectorScene";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = 
{
	active: false,
	visible: false,
	key: 'Chapter3',
};
  
export class Chapter3Scene extends FaceDetectorScene
{
	public sceneWidth: number = 1920;
	public sceneHeight: number = 1080;

	// Cutscene
  public title: string = 'Lost in the Flood';
  public subtitle: string = 'Chapter 1';

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
  }