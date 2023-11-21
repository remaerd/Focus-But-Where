import { Scene } from "phaser";
import { UIScene } from "./Scenes/UIScene";

export enum BlinkingStatus { None, LeftEye, RightEye, Both	}

export interface IBlinkDetectable
{
	onBlinkStatusChanged(status: BlinkingStatus) : void;
	sceneStopped: boolean;
	parent: Phaser.Structs.Size;
	sizer: Phaser.Structs.Size;
}

export abstract class FaceDetectorScene extends Scene implements IBlinkDetectable
{
	// Screen Size

	public abstract sceneHeight: number;
	public abstract sceneWidth: number;
	
	public get windowWidth() : number { return window.innerWidth }
	public get windowHeight() : number { return window.innerHeight }

	public get widthScale() : number { return this.windowWidth / this.sceneWidth }
	public get heightScale() : number { return this.windowHeight / this.sceneHeight }
	
	public get mask() : Phaser.Display.Masks.BitmapMask 
	{
		return (this.scene.get('UserInterface') as UIScene).eyeMask
	}

	public sceneStopped = false;
	public parent!: Phaser.Structs.Size;
	public sizer!: Phaser.Structs.Size;

	public getUIScene() : UIScene
	{
		return this.scene.get('UserInterface') as UIScene;
	}

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
		// TODO
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