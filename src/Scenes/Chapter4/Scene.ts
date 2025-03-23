import Subtitle from './subtitle.json';

import { FaceDetectorScene } from "../../FaceDetectorScene";
import { Defaults } from "../../Models/Defaults";
import { headlineFontSize, headlineTypeface, defaultTypeface, bodyFontSize } from "../UIScene";

const name = 'Chapter4Scene';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = 
{
	active: false,
	visible: false,
	key: name,
};
  
export class Chapter4Scene extends FaceDetectorScene
{
  public sceneId = "Chapter4";
  static cutsceneVideoFileName? = 'Videos/Chapter_4.mp4';
  static cutsceneSectionsSubtitles? = Subtitle;
  
  public sceneData? = null;

  public backgroundMusicPath?: string | undefined = 'Audio/BGM_Chapter_1.mp3';

  public static sceneName: string = name;
  static title = undefined;
  static subtitle = undefined;

  public sceneWidth: number = 1920;
  public sceneHeight: number = 1080;

  private background!: Phaser.GameObjects.Rectangle;
  private headline!: Phaser.GameObjects.Text;
  private description!: Phaser.GameObjects.Text;
  private image!: Phaser.GameObjects.Image;
  private qrCode!: Phaser.GameObjects.Image; 

	constructor() 
	{
	  super(sceneConfig);
	}
	
	public preload()
	{
    super.preload();
    this.load.multiatlas("Chapter4", "144ppi/Chapter4_Images.json", "144ppi");
	}
   
	public create() 
	{
    // super.create();

    this.background = this.add.rectangle(0,0, window.innerWidth, window.innerHeight, 0xffffff);

    this.headline = this.add.text(0,0, "Thank you for playing!", { fontFamily: headlineTypeface, fontSize: headlineFontSize, color: '#ffffff' });
    this.headline.tint = 0x000000;
    this.headline.lineSpacing = 0.5;
    this.headline.setAlign("center");
    this.headline.setResolution(3);

    const description = "You've just completed the first three chapters of FOCUS, BUT WHERE. This game is crafted with passion by our small indie team based in the UK. \n\nWe're working hard on the next chapters, and we'd love to keep you in the loop! Scan the QR code to visit our project page and sign up for our newsletter—you’ll be the first to hear about updates, exclusive content, and release dates. \n\nTo restart the game, simply refresh the page!"
    this.description = this.add.text(0,0, description, { fontFamily: defaultTypeface, fontSize: bodyFontSize, color: '#ffffff' });
    this.description.setResolution(3);
    this.description.tint = 0x000000;
    this.description.setAlign("left");  
    this.description.setWordWrapWidth(960,false);
    
    this.image = this.add.image(0,0,"Chapter4", "Image_Loading");
    this.image.setScale(0.25);

    this.qrCode = this.add.image(0,0,"Chapter4", "Image_QRCode");
    this.qrCode.setScale(0.25);
    
    this.input.topOnly = false;

    Defaults.shared.currentChapter = 4;
	}
   
  public update() 
  {
    // super.update();

    this.background.width = this.windowWidth * 2;
    this.background.height = this.windowHeight * 2;

    this.headline.x = window.innerWidth / 2 - this.headline.width / 2;
    this.headline.y = 100;
    this.description.x = window.innerWidth / 2 - this.description.width / 2;
    this.description.y = window.innerHeight / 2 + 30;

    this.image.x = window.innerWidth / 2;
    this.image.y = window.innerHeight / 2 - this.image.height * 0.25 / 2;
    this.qrCode.x = window.innerWidth / 2;
    this.qrCode.y = this.description.y + this.description.height + 30;
  }
}