import { BlinkingStatus, FaceDetectorScene } from "../FaceDetectorScene";
import { Detector } from "../FaceLandmarkDetector";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = 
{
	active: false,
	visible: false,
	key: 'MainMenu',
};
  
export class MainMenuScene extends FaceDetectorScene
{
	colour: number = 0xFFFFFF;
	
	private eyeMask!: Phaser.GameObjects.Image
	private circle!: Phaser.GameObjects.Arc
	private background! : Phaser.GameObjects.Image
	
	private maskX = Phaser.Math.Between(0, 800);
	private maskY = Phaser.Math.Between(0, 600);
   
	constructor() 
	{
	  super(sceneConfig);
	}
	
	public preload()
	{
		console.log('Preload')
		this.load.image('eyeMask', '/EyeMask.svg')
		this.load.image('background', '/background.png')
	}
   
	public create() 
	{
	  this.circle = this.add.circle(360,360,128, this.colour);
		this.circle.scale = Detector.default!.scale
	  this.physics.add.existing(this.circle);

		this.eyeMask = this.add.image(this.maskX, this.maskY, 'eyeMask')
		const mask = this.eyeMask.createBitmapMask(undefined)
		this.background = this.add.image(this.maskX, this.maskY, 'background').setMask(mask);
	}
   
	public update() 
	{
	  // TODO
		// this.eyeMask.setX(Detector.default!.translateX * window.innerWidth)
		// this.eyeMask.setY(Detector.default!.translateY * window.innerHeight)
		// this.background.setScale(Detector.default!.scale)
		this.circle.setScale(Detector.default!.scale)
		this.circle.fillColor = this.colour
		this.circle.setX(Detector.default!.translateX * window.innerWidth)
		this.circle.setY(Detector.default!.translateY * window.innerHeight)
	}

	onBlinkStatusChanged(status: BlinkingStatus): void 
	{
		switch(status)
		{
			case BlinkingStatus.None: this.colour = 0xFFFFFF; return
			case BlinkingStatus.LeftEye: this.colour = 0x00FFFF; return
			case BlinkingStatus.RightEye: this.colour = 0xFF00FF; return
			case BlinkingStatus.Both: this.colour = 0xFFFF00; return
		}	
	}
}