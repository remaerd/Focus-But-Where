
import { Scene } from "phaser";
import { UIScene } from "./Scenes/UIScene";
import { Detector } from "./FaceLandmarkDetector";
import { Defaults } from "./Models/Defaults";

export enum BlinkingStatus { None, LeftEye, RightEye, Both }

export interface IBlinkDetectable
{
	onBlinkStatusChanged(status: BlinkingStatus) : void;
	sceneStopped: boolean;
	parent: Phaser.Structs.Size;
	sizer: Phaser.Structs.Size;
}


class TouchPoint
{
	public name: string;
	public x: number;
	public y: number;
	public ratio: number;
	public description?: string;
	
	constructor(name: string, x: number,y: number, ratio: number, description?: string)
	{
		this.name = name;
		this.x = x;
		this.y = y;
		this.ratio = ratio;
		this.description = description;
	}
}

class SFX
{
	public name: string;
	public x: number;
	public y: number;
	public ratio: number;
	
	constructor(name: string, x: number,y: number, ratio: number)
	{
		this.name = name;
		this.x = x;
		this.y = y;
		this.ratio = ratio;
	}
}

class Image
{
	public name: string;
	public x: number;
	public y: number;
	public imageSprite!: Phaser.GameObjects.Image;

	constructor(name: string, x: number,y: number)
	{
		this.name = name;
		this.x = x;
		this.y = y;
	}
}

export class InteractiveObject
{
	public name: string;
	public x: number;
	public y: number;
	public imageSprite!: Phaser.GameObjects.Sprite;

	constructor(name: string, x: number,y: number)
	{
		this.name = name;
		this.x = x;
		this.y = y;
	}
}

class AnimationSprite
{
	public name: string;
	public x: number;
	public y: number;
	public imageSprite!: Phaser.GameObjects.Sprite;
	public animated: number;

	constructor(name: string, x: number,y: number, animated: number = 0)
	{
		this.name = name;
		this.x = x;
		this.y = y;
		this.animated = animated;
	}
}

export abstract class FaceDetectorScene extends Scene implements IBlinkDetectable
{
	public cameraSpeed = 0.1; // 鏡頭移動速度

	// Screen Size
	public showUserInterface: boolean = true;

	public abstract sceneId? : string;
	public static sceneName: string;


	public sceneWidth: number = 0;
	public sceneHeight: number = 0;

	// Scene Title / Description
	// static title?: string;
	// static subtitle?: string;
	// public static introAudioFile?: string;

	static cutsceneVideoFileName?: string;
	static cutsceneSectionsTimestamps?: number[];

	public sceneData? : any;
	public interactiveObjectSpritesFileName?: string;

	startPointX: number = 0;
	startPointY: number = 0;
	touchPoints: TouchPoint[] = [];
	sfxs: SFX[] = [];
	images: Image[] = [];
	interactiveObjects: InteractiveObject[] = [];
	animationSprites: AnimationSprite[] = [];

	imageObjects : Phaser.GameObjects.Sprite[] = [];

	public get windowWidth() : number { return window.innerWidth }
	public get windowHeight() : number { return window.innerHeight }

	public get widthScale() : number { return this.windowWidth / this.sceneWidth }
	public get heightScale() : number { return this.windowHeight / this.sceneHeight }

	public sceneStopped = false;
	public parent!: Phaser.Structs.Size;
	public sizer!: Phaser.Structs.Size;

	private _eyeMaskImage!: Phaser.GameObjects.Sprite;
	private _eyeMask!: Phaser.Display.Masks.BitmapMask;
	public backgroundNusicPath?: string;

	private _mouseTrackpadScale: number = 0.5;

	private keySpace?: Phaser.Input.Keyboard.Key;

	public get defaultUIScene() : UIScene 
	{
		return this.scene.get('UserInterface') as UIScene; 
	}

	public get mask() : Phaser.Display.Masks.BitmapMask 
	{
		if (!this._eyeMaskImage)
		{
			this._eyeMaskImage = this.add.sprite( window.innerWidth / 2, window.innerHeight / 2, "interface", "Mask_Eye");
			this._eyeMaskImage.setVisible(false);
			this._eyeMaskImage.setScrollFactor(0);

			this._eyeMask = this.add.bitmapMask(this._eyeMaskImage);
			this._eyeMask.invertAlpha = false;
		}
		return this._eyeMask;
	}

	constructor(config: Phaser.Types.Scenes.SettingsConfig) 
	{
	  super(config);
	}
	

	public preload()
	{
		console.log('Preloading Scene');

		if (this.backgroundNusicPath) this.load.audio(this.backgroundNusicPath!, this.backgroundNusicPath!);

		this.startPointX = this.sceneData.startpoint.x;
		this.startPointY = this.sceneData.startpoint.y;
		
		for (var i = 0; i<this.sceneData.touchpoints.length; i++)
		{
			var touchpoint = this.sceneData.touchpoints[i];
			this.touchPoints.push(
				new TouchPoint(touchpoint.name, touchpoint.x, touchpoint.y, touchpoint.ratio, touchpoint.description)
			);
		}

		for (var i = 0; i<this.sceneData.sfxs.length; i++)
		{
			var sfx = this.sceneData.sfxs[i];
			this.sfxs.push(
				new SFX(sfx.name, sfx.x, sfx.y, sfx.ratio)
			);
		}
		for (var i = 0; i<this.sceneData.images.length; i++)
		{
			var image = this.sceneData.images[i];
			var imageName = this.sceneId + '_' + image.name;
			this.images.push(
				new Image(imageName, image.x, image.y)
			);
			this.load.image(imageName, '144ppi/' + imageName + '.png');
		}

		if (this.interactiveObjectSpritesFileName) 
		{
			this.load.multiatlas(this.interactiveObjectSpritesFileName!, `144ppi/${this.interactiveObjectSpritesFileName}.json`, "144ppi/");
			for (var i = 0; i<this.sceneData.interactiveObjects.length; i++)
			{
				var interactiveObject = this.sceneData.interactiveObjects[i];
				this.interactiveObjects.push(
					new InteractiveObject(interactiveObject.name, interactiveObject.x, interactiveObject.y)
				);
			}
		}
		
		for (var i = 0; i<this.sceneData.animationSprites.length; i++)
		{
			var animationSprite = this.sceneData.animationSprites[i];
			var objectName = animationSprite.name;
			this.animationSprites.push(
				new AnimationSprite(objectName, animationSprite.x, animationSprite.y, 100)
			);
			this.load.multiatlas(objectName, `144ppi/${objectName}.json`, "144ppi/");
		}
	}

	private addGameObjects(objects: any[], initialDepth: integer)
	{
		for (var i = 0; i < objects.length; i++)
		{
			let gameObject = objects[i];
			gameObject.imageSprite  = this.add.image(0, 0, gameObject.name);
			gameObject.imageSprite.setOrigin(0);
			gameObject.imageSprite.x = gameObject.x + this.windowWidth / 2 - this.sceneWidth / 2;
			gameObject.imageSprite.y = gameObject.y + this.windowHeight / 2  - this.sceneHeight / 2;
			gameObject.imageSprite.setMask(this.mask);
			gameObject.imageSprite.setScale(0.5);
			gameObject.imageSprite.setDepth(initialDepth-i);
		}
	}
   
	public create() 
	{
		console.log("Creating a scene");
		this.cameras.main.scrollX = this.sceneWidth;
		this.cameras.main.scrollY = this.sceneHeight;

		this.addGameObjects(this.images,0);

		for (var i = 0; i < this.animationSprites.length; i++)
		{
			let gameObject = this.animationSprites[i];
			gameObject.imageSprite = this.add.sprite(0, 0, gameObject.name);
			gameObject.imageSprite.setOrigin(0);
			gameObject.imageSprite.x = gameObject.x + this.windowWidth / 2 - this.sceneWidth / 2;
			gameObject.imageSprite.y = gameObject.y + this.windowHeight / 2  - this.sceneHeight / 2;
			gameObject.imageSprite.setMask(this.mask);
			gameObject.imageSprite.setScale(0.65);
			gameObject.imageSprite.setDepth(100-i);
		}

		if (this.interactiveObjectSpritesFileName)
		{
			for (var i = 0; i < this.interactiveObjects.length; i++)
			{
				let gameObject = this.interactiveObjects[i];
				gameObject.imageSprite  = this.add.sprite(0,0, this.interactiveObjectSpritesFileName!, gameObject.name);
				gameObject.imageSprite.setOrigin(0);
				gameObject.imageSprite.x = gameObject.x + this.windowWidth / 2 - this.sceneWidth / 2;
				gameObject.imageSprite.y = gameObject.y + this.windowHeight / 2  - this.sceneHeight / 2;
				gameObject.imageSprite.setMask(this.mask);
				gameObject.imageSprite.setScale(0.65);
				gameObject.imageSprite.setDepth(1000+i);
			}
		}
		
		// Add mouse click support
		this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => 
		{
			if (pointer.leftButtonDown())
				{
					if (!Defaults.shared.faceControlEnabled) this.checkInteraction(pointer.x, pointer.y);
					else 
					{
						let inputX = Detector.default!.translateX * window.innerWidth;
						let inputY = Detector.default!.translateY * window.innerHeight;
						this.checkInteraction(inputX, inputY);
					}
				}
		});

		if (this.input.keyboard)
		{
			this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
			this.keySpace.on('down', () => 
			{
				if (!Defaults.shared.faceControlEnabled) this.checkInteraction(this.input.x, this.input.y);
				else 
				{
					let inputX = Detector.default!.translateX * window.innerWidth;
					let inputY = Detector.default!.translateY * window.innerHeight;
					this.checkInteraction(inputX, inputY);
				}
			});
		}

		var focus = this.add.circle(this.windowWidth / 2 , this.windowHeight /2, 100);
		focus.setScrollFactor(0);
		focus.setStrokeStyle(5, 0x000000,0.1);
		focus.setDepth(1000);
	}
   
	public update() 
	{	
		if(this._eyeMaskImage)
		{
			this._eyeMaskImage.x = window.innerWidth / 2;
			this._eyeMaskImage.y = window.innerHeight / 2;
		}

		let inputX: number;
		let inputY: number;
		let boundWidth: number;
		let boundHeight: number;
		let scale = 0.5;

		this.input.on('wheel', (_object:any, _target:any, _x:any, y:number, _z:any) => 
		{
			if (y > 2) { this._mouseTrackpadScale += 0.1; }
			else if (y < -2) { this._mouseTrackpadScale -= 0.1; }
		});
		
		if (Defaults.shared.faceControlEnabled)
		{
			scale = 1.7-Detector.default!.scale;
			inputX = Detector.default!.translateX * this.windowWidth;
			inputY = Detector.default!.translateY * this.windowHeight;
			boundWidth = window.innerWidth;
			boundHeight = window.innerHeight;
		}
		else
		{
			scale = this._mouseTrackpadScale;
			inputX = this.input.x;
			inputY = this.input.y;
			boundWidth = this.cameras.main.width;
			boundHeight = this.cameras.main.height
		}

		// 計算鏡頭的目標位置
		var targetX = inputX - boundWidth / 2;
		var targetY = inputY - boundHeight / 2;

		// 計算鏡頭的移動量
		var dx = targetX - this.cameras.main.scrollX;
		var dy = targetY - this.cameras.main.scrollY;

		// 透過移動量和速度計算鏡頭的新位置
		var newX = this.cameras.main.scrollX + dx * this.cameraSpeed;
		var newY = this.cameras.main.scrollY + dy * this.cameraSpeed;

		// 設置鏡頭新的位置
		if (scale >= 2) scale = 2;
		else if (scale <= 0) scale = 0;

		this.cameras.main.setScroll(newX, newY);
		this.cameras.main.setZoom(Math.abs(scale));

		this.onHoverOnTouchPoint(inputX, inputY);
	}

	onHoverOnTouchPoint(inputX: number, inputY: number): void
	{
		var touchPointDescription: string | null = null;
		this.touchPoints.forEach(touchPoint => {
			let isNear = this.isNear(touchPoint.x + this.windowWidth / 2 - this.sceneWidth / 2 + touchPoint.ratio,
															touchPoint.y  + this.windowHeight / 2  - this.sceneHeight / 2 + touchPoint.ratio, 
															inputX, inputY, touchPoint.ratio)
			if (isNear && touchPoint.description) touchPointDescription =  touchPoint.description;
		});
		if (touchPointDescription) this.defaultUIScene.setDescriptionText(touchPointDescription); 
	}

	onBlinkStatusChanged(status: BlinkingStatus): void 
	{
		// let inputX = Detector.default!.translateX * window.innerWidth;
		// let inputY = Detector.default!.translateY * window.innerHeight;
		// switch (status) {
    //   case BlinkingStatus.LeftEye: this.checkInteraction(inputX, inputY); break;
		// 	case BlinkingStatus.RightEye: this.checkInteraction(inputX, inputY); break;
    // }
	}

	public checkInteraction(inputX:number, inputY:number): void
	{
		return;
	}

	isNear = (x1: number, y1: number, x2: number, y2: number, ratio: number) => {
		// this.add.circle(x1,y1, ratio, 0xff0000,1);
		// this.add.circle(x2,y2, ratio, 0xff00,1);
		return Math.abs(x1 - x2) < ratio && Math.abs(y1 - y2) < ratio;
	};

	checkCollideWithTouchPoints(inputX: number, inputY: number): TouchPoint[]
	{
		var collidingTouchPoints: TouchPoint[] = [];
		
		let tween = this.tweens.add({
			targets: [this._eyeMaskImage],
			scaleY: 0,
			duration: 150,
			ease: Phaser.Math.Easing.Sine.InOut,
			repeat: 0,
			yoyo: true,
			onComplete: function()
			{
				tween.remove();
			}
		});

		this.touchPoints.forEach(touchpoint => {
			let isNear = this.isNear(touchpoint.x + this.windowWidth / 2 - this.sceneWidth / 2 + touchpoint.ratio,
																touchpoint.y  + this.windowHeight / 2  - this.sceneHeight / 2 + touchpoint.ratio, 
																inputX, inputY, touchpoint.ratio);
			if (isNear) 
			{
				collidingTouchPoints.push(touchpoint);
				console.log(touchpoint);
			}
		});
		return collidingTouchPoints;
	}
}