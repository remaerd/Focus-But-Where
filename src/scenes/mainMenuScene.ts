import { Data } from "phaser";
import { BlinkingStatus, FaceDetectorScene } from "../FaceDetectorScene";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = 
{
	active: false,
	visible: false,
	key: 'MainMenu',
};
  
export class MainMenuScene extends FaceDetectorScene
{
	public title?: string | undefined;
	public subtitle?: string | undefined;
	
	public sceneHeight: number = 1080;
	public sceneWidth: number = 1920;

	colour: number = 0xFFFFFF;
	private background! : Phaser.GameObjects.Rectangle
	
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
		super.create();
		
		this.load.on('progress', (value: number) =>
		{
			console.log(value);
		});
								
		this.load.on('fileprogress',  (file: any) =>
		{
			console.log(file.src);
		});

		this.load.on('complete', (completed: boolean) =>
		{
			console.log(completed);
		});

		this.background = this.add.rectangle(0,0,this.sceneWidth,this.sceneHeight, 0xffff00).setMask(this.mask);
	}
   
	public update() 
	{
		super.update();
	  this.background.width = this.windowWidth * 2;
		this.background.height = this.windowHeight * 2;
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