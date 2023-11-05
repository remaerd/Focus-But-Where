import { Scene } from "phaser";
import { UIScene } from "./Scenes/uiScene";

export enum BlinkingStatus { None, LeftEye, RightEye, Both	}

export interface IBlinkDetectable
{
	onBlinkStatusChanged(status: BlinkingStatus) : void;
	sceneHeight: integer;
	sceneWidth: integer;
	sceneStopped: boolean;
	parent: Phaser.Structs.Size;
	sizer: Phaser.Structs.Size;
}

export class FaceDetectorScene extends Scene implements IBlinkDetectable
{
	public sceneHeight: number;
	public sceneWidth: number;
	public sceneStopped = false;
	public parent!: Phaser.Structs.Size;
	public sizer!: Phaser.Structs.Size;

	public getUIScene() : UIScene
	{
		return this.scene.get('UserInterface') as UIScene;
	}

	constructor(config: Phaser.Types.Scenes.SettingsConfig, height: number, width: number) 
	{
	  super(config);
	  this.sceneHeight = height;
	  this.sceneWidth = width;
	}
	
	
	public preload()
	{
		console.log('Preload')
	}
   
	public create() 
	{
		this.getUIScene().updateResize();
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