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

export class FaceDetectorScene extends Scene implements IBlinkDetectable
{
	// Screen Size
	public showUserInterface: boolean = true;
	public static sceneName: string;
	public sceneWidth: number = 1920;
	public sceneHeight: number = 1080;

	// Scene Title / Description
	static title?: string;
	static subtitle?: string;
	
	public get windowWidth() : number { return window.innerWidth }
	public get windowHeight() : number { return window.innerHeight }

	public get widthScale() : number { return this.windowWidth / this.sceneWidth }
	public get heightScale() : number { return this.windowHeight / this.sceneHeight }

	public sceneStopped = false;
	public parent!: Phaser.Structs.Size;
	public sizer!: Phaser.Structs.Size;
	
	public get defaultUIScene() : UIScene 
	{
		return this.scene.get('UserInterface') as UIScene; 
	}

	public get mask() : Phaser.Display.Masks.BitmapMask 
	{
		const eyeMaskImage = this.add.image( window.innerWidth / 2, window.innerHeight / 2, "interface", "eye_view_01.png");
    eyeMaskImage.setScale(0.11);

    const eyeMask = this.add.bitmapMask(eyeMaskImage);
    eyeMask.invertAlpha = true;

		return eyeMask;
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
		
	}
   
	public update() 
	{
		
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