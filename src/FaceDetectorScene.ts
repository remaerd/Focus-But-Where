import { Scene } from "phaser";

export enum BlinkingStatus { None, LeftEye, RightEye, Both	}

export interface IBlinkDetectable
{
	onBlinkStatusChanged(status: BlinkingStatus) : void;
}

export class FaceDetectorScene extends Scene implements IBlinkDetectable
{
	static currentScene: FaceDetectorScene
	
	constructor(config: Phaser.Types.Scenes.SettingsConfig) 
	{
	  super(config);
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

	onBlinkStatusChanged(status: BlinkingStatus): void 
	{
		switch(status)
		{
			case BlinkingStatus.None:
				return
			case BlinkingStatus.LeftEye:
				return
			case BlinkingStatus.RightEye:
				return
			case BlinkingStatus.Both:
				return
		}	
	}
}