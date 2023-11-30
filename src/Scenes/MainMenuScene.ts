import { Data } from "phaser";
import { BlinkingStatus, FaceDetectorScene } from "../FaceDetectorScene";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = 
{
	active: false,
	visible: false,
	key: 'MainMenuScene',
};
  
export class MainMenuScene extends FaceDetectorScene
{
	public title?: string | undefined;
	public subtitle?: string | undefined;
	
	public sceneHeight: number = 1080;
	public sceneWidth: number = 1920;

	colour: number = 0xFFFFFF;
	private background! : Phaser.GameObjects.Image
	
	constructor() 
	{
	  super(sceneConfig);
	}
	
	public preload()
	{
		console.log('Preload')

		this.load.image('background', 'Interface/main_menu_edit.png');
    this.load.multiatlas( "icons", "/Interface/main_menu_icon_edit.json", "/Interface/");
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

		this.background = this.add.image(0,0,'background');
		this.background.setOrigin(0.5,0.5)
	}
   
	public update() 
	{
		super.update();
		this.background.scale = 0.2
	  // this.background.width = this.windowWidth * 2;
		// this.background.height = this.windowHeight * 2;
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