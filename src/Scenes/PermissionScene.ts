import { FaceDetectorScene } from "../FaceDetectorScene";
import { bodyFontSize, bubbleTextFontSize, buttonTextFontSize, defaultTypeface, subtitleFontSize } from "./UIScene";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = 
{
	active: false,
	visible: false,
	key: 'Permission',
};
  
export class PermissionScene extends FaceDetectorScene
{
  public title = undefined;
  public subtitle = undefined;

  public sceneWidth: number = 1920;
  public sceneHeight: number = 1080;

  private background!: Phaser.GameObjects.Rectangle;
  private headline!: Phaser.GameObjects.BitmapText;
  private description!: Phaser.GameObjects.BitmapText;
  private image!: Phaser.GameObjects.Image;

  private cameraPermissionButton!: Phaser.GameObjects.Graphics;
  private keyboardButton!: Phaser.GameObjects.Graphics;
  private camreaPermissionButtonText!: Phaser.GameObjects.BitmapText;
  private keyboardButtonText!: Phaser.GameObjects.BitmapText;

	constructor() 
	{
	  super(sceneConfig);
	}
	
	public preload()
	{
    this.load.image("permission", "Interface/Image_Permission.svg");
	}
   
	public create() 
	{
    this.background = this.add.rectangle(0,0, window.innerWidth, window.innerHeight, 0xffffff);

    this.headline = this.add.bitmapText(0,0, defaultTypeface, "Hi there, little eye.\nHow would you like to play this game ?", subtitleFontSize);
    this.headline.tint = 0x000000;
    this.headline.lineSpacing = 0.5;
    this.headline.setCenterAlign();

    const description = "We recommend granting us access to your camera.\nThen, blink, wink, and bob your way through this game using face tracking.\nIf people around you start to stare,\nyou can always switch to using your cursor."
    this.description = this.add.bitmapText(0,0, defaultTypeface, description, bodyFontSize, 0.5);
    
    this.description.tint = 0x000000;
    this.description.setCenterAlign();
    
    this.image = this.add.image(0,0, "permission");
    
    this.cameraPermissionButton = this.add.graphics();
    this.cameraPermissionButton.fillStyle(0x000000);
    this.cameraPermissionButton.fillRoundedRect(0,0,300,48,24);
    this.cameraPermissionButton.setInteractive().on('pointerdown', () => 
    { 
      console.log('Hello'); 
    });

    this.keyboardButton = this.add.graphics();
    this.keyboardButton.fillStyle(0x000000);
    this.keyboardButton.fillRoundedRect(0,0,300,48,24);
    this.keyboardButton.setInteractive().on('pointerdown', () => 
    { 
      console.log('Hello'); 
    });

    this.camreaPermissionButtonText = this.add.bitmapText(0,0,defaultTypeface, "Great, face tracking it is!", buttonTextFontSize);
    this.camreaPermissionButtonText.tint = 0xffffff;
    
    this.keyboardButtonText = this.add.bitmapText(0,0,defaultTypeface, "I wanna use cursor instead", bubbleTextFontSize);
    this.keyboardButtonText.tint = 0xffffff;
    
	}
   
  public update() 
  {
    this.background.width = this.windowWidth * 2;
    this.background.height = this.windowHeight * 2;

    this.headline.x = window.innerWidth / 2 - this.headline.width / 2;
    this.headline.y = 100;
    this.description.x = window.innerWidth / 2 - this.description.width / 2;
    this.description.y = window.innerHeight / 2 + 30;
    this.image.x = window.innerWidth / 2;
    this.image.y = window.innerHeight / 2 - this.image.height / 2;

    this.cameraPermissionButton.x = window.innerWidth / 2 - 320;
    this.cameraPermissionButton.y = window.innerHeight - 150;
    this.camreaPermissionButtonText.x = window.innerWidth / 2 - 270;
    this.camreaPermissionButtonText.y = window.innerHeight - 135;

    this.keyboardButton.x = window.innerWidth / 2 + 20;
    this.keyboardButton.y = window.innerHeight - 150;
    this.keyboardButtonText.x = window.innerWidth / 2 + 70;
    this.keyboardButtonText.y = window.innerHeight - 135;
  }
}