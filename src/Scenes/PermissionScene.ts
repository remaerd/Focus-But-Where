
import { FaceDetectorScene } from "../FaceDetectorScene";
import { Detector } from "../FaceLandmarkDetector";
import { Defaults } from "../Models/Defaults";
import { MainMenuScene } from "./MainMenu/Scene";
import { bodyFontSize, buttonTextFontSize, defaultTypeface, subtitleFontSize } from "./UIScene";

const name = 'PermissionScene';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = 
{
	active: false,
	visible: false,
	key: name,
};
  
export class PermissionScene extends FaceDetectorScene
{
  public sceneId = "Permission";
  public sceneData? = null;

  public static sceneName: string = name;
  static title = undefined;
  static subtitle = undefined;

  public sceneWidth: number = 1920;
  public sceneHeight: number = 1080;

  private background!: Phaser.GameObjects.Rectangle;
  private headline!: Phaser.GameObjects.Text;
  private description!: Phaser.GameObjects.Text;
  private image!: Phaser.GameObjects.Image;

  private cameraPermissionButton!: Phaser.GameObjects.Container;
  private keyboardButton!: Phaser.GameObjects.Container;

	constructor() 
	{
	  super(sceneConfig);
	}
	
	public preload()
	{
    this.load.image("permission", "Image_Permission.png");
	}
   
	public create() 
	{
    this.background = this.add.rectangle(0,0, window.innerWidth, window.innerHeight, 0xffffff);

    this.headline = this.add.text(0,0, "Hi there, little eye.\nHow would you like to play this game ?", { fontFamily: 'Gaegu', fontSize: subtitleFontSize, color: '#ffffff' });
    this.headline.tint = 0x000000;
    this.headline.lineSpacing = 0.5;
    this.headline.setAlign("center");
    this.headline.setResolution(3);

    const description = "We recommend granting us access to your camera.\nThen, blink, wink, and bob your way through this game using face tracking.\nIf people around you start to stare,\nyou can always switch to using your cursor."
    this.description = this.add.text(0,0, description, { fontFamily: 'Gaegu', fontSize: bodyFontSize, color: '#ffffff' });
    this.description.setResolution(3);
    this.description.tint = 0x000000;
    this.description.setAlign("center");  
    
    this.image = this.add.image(0,0, "permission");
    this.image.setScale(0.25);
    
    this.input.topOnly = false;
    
    this.cameraPermissionButton = this.createButton("Great, face tracking it is!");
    this.keyboardButton = this.createButton("I wanna use cursor instead");
    
    this.input.on('pointerup', (_pointer: any, gameObject: any) =>
    {
      if (gameObject[0] == this.cameraPermissionButton) this.askCameraPermission(); 
      else if (gameObject[0] == this.keyboardButton) this.enterGameWithoutCameraPermission();
    })
	}

  private createButton(title: string): Phaser.GameObjects.Container
  {
    const background = this.add.graphics();
    background.fillStyle(0x000000);
    background.fillRoundedRect(0,0,300,48,24);

    const text = this.add.text(0,0,title, { fontFamily:"Gaegu", fontSize: buttonTextFontSize, color: '#ffffff' });
    text.tint = 0xffffff;
    text.setAlign("center");
    text.setOrigin(-0.25, -0.75);
    text.setResolution(2);
    
    const button = this.add.container(0,0,[background, text]);
    button.setInteractive(new Phaser.Geom.Rectangle(0, 0, 300,48), Phaser.Geom.Rectangle.Contains);
    return button;
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
    this.image.y = window.innerHeight / 2 - this.image.height * 0.25 / 2;

    this.cameraPermissionButton.x = window.innerWidth / 2 - 320;
    this.cameraPermissionButton.y = window.innerHeight - 150;

    this.keyboardButton.x = window.innerWidth / 2 + 20;
    this.keyboardButton.y = window.innerHeight - 150;
  }

  private enterGameWithoutCameraPermission()
  {
    this.defaultUIScene.changeScene(MainMenuScene);
  }

  private async askCameraPermission()
  {
    try {
      await Detector.setup();
      this.defaultUIScene.changeScene(MainMenuScene);
      Defaults.shared.faceControlEnabled = true;
    } catch (error) {
      this.defaultUIScene.changeScene(MainMenuScene);
      console.log(error);
    }
  }
}