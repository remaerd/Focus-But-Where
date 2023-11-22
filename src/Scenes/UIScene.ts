import { FaceDetectorScene } from "../FaceDetectorScene";
import { HiddenObject } from "../Models/HiddenObject";

export interface IObserver 
{
	hiddenObjectIsFound(object: HiddenObject): void
}

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = 
{
  active: false,
  visible: false,
  key: "UserInterface",
};

export const headlineTypeface = 'Road Rage';
export const defaultTypeface = 'Gaegu';
export const headlineFontSize = 128;
export const subtitleFontSize = 32;
export const bodyFontSize = 22;
export const buttonTextFontSize = 18;
export const bubbleTextFontSize = 18;

export class UIScene extends Phaser.Scene 
{
  public showUserInterface: boolean = false;

  // Current Scene
  public currentScene!: FaceDetectorScene;

  // User Interface
  public isUserInterfaceVisible = false;

  public isLoadingVisible = false;

  // Eye mask
  public eyeMask!: Phaser.Display.Masks.BitmapMask;

  // Hidden Object Icons Indicators
	private hiddenObjectIndicators!: Phaser.GameObjects.Sprite[]; 

  // Zoom Indicator
  private zoomIndicator!: Phaser.GameObjects.Sprite;
  private zoomIndicatorBackground!: Phaser.GameObjects.Sprite;

  // Cutscene
  private cutsceneBackground!: Phaser.GameObjects.Rectangle;
  private cutsceneTitleText!: Phaser.GameObjects.BitmapText;
  private cutsceneSubtitleText!: Phaser.GameObjects.BitmapText;

	iconTween = ( object: Phaser.GameObjects.Sprite, ) => 
  {
		this.tweens.add({
      targets: object,
      duration: 2000,
      // BUG: This block of code scale the objects unportionally. Please Check
      // scaleX: 1.5*this.widthScale,
      // scaleY: 1.5*this.heightScale,
      alpha:0.7,
      yoyo: true,
      repeat: 0,
		});
	}

  constructor() 
  {
    super(sceneConfig);
  }

  public preload() 
  {
    //load eye mask
    this.load.image("eyeMask", "Interface/Mask_Eye.svg");
    this.load.image('zoomIndicator', 'Interface/Control_Zoom_Indicator.svg');
    this.load.bitmapFont(headlineTypeface, "Fonts/RoadRage_0.png", "Fonts/RoadRage.fnt");
    this.load.bitmapFont(defaultTypeface, "Fonts/Gaegu_0.png", "Fonts/Gaegu.fnt");
  }

  public create() 
  {
    const eyeMask = this.add.image(
      window.innerWidth / 2,
      window.innerHeight / 2,
      "eyeMask"
    );

    this.eyeMask = eyeMask.createBitmapMask();
    this.eyeMask.invertAlpha = true;

    this.changeScene('Permission');
    this.scale.on('resize', this.resize, this);
  }

  public update() 
  {
    // TODO
    // this.eyeMask.setX(Detector.default!.translateX * window.innerWidth);
    // this.eyeMask.setY(Detector.default!.translateY * window.innerHeight);
  }

  private changeScene(scene: string, data?: object)
  {
    this.currentScene = this.scene.get(scene) as FaceDetectorScene;
    // this.reloadIcons();
    if (this.currentScene.title && this.currentScene.subtitle)
    {
      this.showCutscene(this.currentScene.title!, this.currentScene.subtitle!);
    }
    else
    {
      this.scene.launch(this.currentScene);
    }
  }

  private reloadIcons()
  {
		// Remove Icons from Previous Scene
    if (this.hiddenObjectIndicators.length != 0)
    {
      for (let i = 0; i < this.hiddenObjectIndicators.length; i++)
      {
        this.hiddenObjectIndicators[i].removedFromScene();
      }
      this.hiddenObjectIndicators = [];
    }

    // Load New Icons

    this.load.multiatlas("icons", "/Interface/icons.json", "/Interface/");

    const iconsTexture = this.textures.get("icons");
    
    for (let i = 0; i < iconsTexture.getFrameNames().length; i++) {
      
      this.hiddenObjectIndicators.push(
        this.add.sprite(
          window.innerWidth / 2 + window.innerWidth / 6 * (i - 1),
          window.innerHeight / 12 * 11,
          "icons",
          iconsTexture.getFrameNames()[i]
        )
      );
      this.hiddenObjectIndicators[i].setDepth(1000);
      this.hiddenObjectIndicators[i].setScale(1, 1);
    }
  }

  /**
   * Temporary display Cutscene with Title and subtitle
   * @param title Cutscene Title
   * @param subtitle Cutscene Subtitle
   * @param duration Delay Millisecond
   */
  showCutscene(title: string, subtitle: string, duration: number = 3000)
  {
    this.cutsceneBackground = this.add.rectangle(0,0,window.innerWidth, window.innerHeight, 0x000000);
    this.cutsceneBackground.setDepth(10000);
    this.cutsceneBackground.alpha = 0;

    this.cutsceneTitleText = this.add.bitmapText(0,0,headlineTypeface, title, headlineFontSize);
    this.cutsceneTitleText.tint = 0xffffff;
    this.cutsceneTitleText.x = window.innerWidth / 2 - this.cutsceneTitleText.width / 2
    this.cutsceneTitleText.y = window.innerHeight / 2 - this.cutsceneTitleText.height / 2
    this.cutsceneTitleText.setDepth(10001);
    this.cutsceneTitleText.alpha = 0;

    this.cutsceneSubtitleText = this.add.bitmapText(0,0,defaultTypeface, subtitle.toUpperCase(), subtitleFontSize);
    this.cutsceneSubtitleText.letterSpacing = 0.5;
    this.cutsceneSubtitleText.tint = 0xffffff;
    this.cutsceneSubtitleText.x = window.innerWidth / 2 - this.cutsceneSubtitleText.width / 2
    this.cutsceneSubtitleText.y = window.innerHeight / 2 + this.cutsceneTitleText.height / 2
    this.cutsceneSubtitleText.setDepth(10002);
    this.cutsceneSubtitleText.alpha = 0;
    
    this.tweens.add({
      targets: [this.cutsceneBackground, this.cutsceneSubtitleText, this.cutsceneTitleText],
      duration: 700,
      alpha:1
    });
    this.time.delayedCall(duration, () => 
    {
      this.tweens.add({
        targets: [this.cutsceneBackground, this.cutsceneSubtitleText, this.cutsceneTitleText],
        duration: 700,
        alpha:0,
        onComplete: ()=>
        {
          this.cutsceneBackground.removedFromScene();
          this.cutsceneTitleText.removedFromScene();
          this.cutsceneSubtitleText.removedFromScene();
          this.scene.launch(this.currentScene);
        }
      });
    }, [], this);
  }

  /**
   * Will demonstrate pop-up when hidden object found
   * @param object Founded Hidden Object 
   */
  hiddenObjectIsFound(object: HiddenObject): void
  {
		
	}

  private resize (gameSize:any, baseSize:any, displaySize:any, resolution:any): void
  {
    const scaleWidth = this.currentScene.scale.gameSize.width;
    const scaleHeight = this.currentScene.scale.gameSize.height;

    this.currentScene.parent = new Phaser.Structs.Size(scaleWidth, scaleHeight);
    this.currentScene.sizer = new Phaser.Structs.Size(this.currentScene.scale.width, this.currentScene.scale.height); 

    const scaleX = this.currentScene.sizer.width / this.game.canvas.width
    const scaleY = this.currentScene.sizer.height / this.game.canvas.height

    this.currentScene.cameras.main.setZoom(Math.max(scaleX, scaleY))
    this.currentScene.cameras.main.centerOn(this.game.canvas.width / 2, this.game.canvas.height / 2);
  }
}
