import { FaceDetectorScene } from "../FaceDetectorScene";
import { HiddenObject } from "../Models/HiddenObject";
import { PermissionScene } from "./PermissionScene";

export interface IObserver 
{
	hiddenObjectIsFound(index: integer, object: HiddenObject): void
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

  // Hidden Object Icons Indicators
	private hiddenObjectIndicators: Phaser.GameObjects.Sprite[] = []; 

  // Zoom Indicator
  private zoomIndicator!: Phaser.GameObjects.Image;
  private zoomIndicatorBackground!: Phaser.GameObjects.Image;

  // Cutscene
  private cutscene!: Phaser.GameObjects.Container;
  
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
    this.load.multiatlas("interface", "Interface/hidden_object_games_icons_edit_packed.json", "Interface");
    this.load.bitmapFont(headlineTypeface, "Fonts/RoadRage_0.png", "Fonts/RoadRage.fnt");
    this.load.bitmapFont(defaultTypeface, "Fonts/Gaegu_0.png", "Fonts/Gaegu.fnt");
  }

  public create() 
  {
    
    this.zoomIndicatorBackground = this.add.image(100,100,"interface", "slider_map.png");
    this.zoomIndicatorBackground.setScale(0.2);
    this.zoomIndicatorBackground.setDepth(1);

    this.changeScene(PermissionScene);
    this.scale.on('resize', this.resize, this);
  }

  public update() 
  {
    // TODO
    // this.mas.setX(window.innerWidth);
    // this.eyeMask.setY(window.innerHeight);
    if (this.cutsceneBackground)
    {
      this.cutsceneBackground.width = window.innerWidth * 2;
      this.cutsceneBackground.height = window.innerHeight * 2;
    }
    
    this.zoomIndicatorBackground.y = window.innerHeight / 2;
  }

  public changeScene(scene: typeof FaceDetectorScene, data?: object)
  {
    if (scene.title && scene.subtitle) this.showCutscene(scene);
    else this.launchScene(scene);
  }

  private launchScene(scene: typeof FaceDetectorScene)
  {
    this.currentScene = this.scene.get(scene.name) as FaceDetectorScene;
    this.scene.launch(this.currentScene);
    this.scene.sendToBack(this.currentScene);

    switch(scene.name)
    {
      case 'Chapter1Scene': this.reloadIcons(1); break;
      case 'Chapter3Scene': this.reloadIcons(3); break;
      default: 
    }
  }

  private reloadIcons(chapter: integer = 0)
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

    if (chapter != 0)
    {
      const hiddenObjects = HiddenObject.allHiddenObjects[chapter-1];
      for (let i = 0; i < hiddenObjects.length; i++)
      {
        this.hiddenObjectIndicators.push(
          this.add.sprite(
            window.innerWidth / 2 + window.innerWidth / 6 * (i - 1),
            window.innerHeight / 12 * 11,
            "interface",
            hiddenObjects[i].imageName + "_white.png")
        );
        this.hiddenObjectIndicators[i].setDepth(1);
        this.hiddenObjectIndicators[i].setScale(0.125);
      }
    };
  }

  /**
   * Temporary display Cutscene with Title and subtitle
   * @param title Cutscene Title
   * @param subtitle Cutscene Subtitle
   * @param duration Delay Millisecond
   */
  showCutscene(scene: typeof FaceDetectorScene, duration: number = 3000)
  { 
    this.cutsceneBackground = this.add.rectangle(0,0,window.innerWidth, window.innerHeight, 0x000000);
    this.cutsceneBackground.setDepth(100);
    this.cutsceneBackground.alpha = 0;

    this.cutsceneTitleText = this.add.bitmapText(0,0,headlineTypeface, scene.title!, headlineFontSize);
    this.cutsceneTitleText.tint = 0xffffff;
    this.cutsceneTitleText.x = window.innerWidth / 2 - this.cutsceneTitleText.width / 2
    this.cutsceneTitleText.y = window.innerHeight / 2 - this.cutsceneTitleText.height / 2
    this.cutsceneTitleText.setDepth(101);
    this.cutsceneTitleText.alpha = 0;

    this.cutsceneSubtitleText = this.add.bitmapText(0,0,defaultTypeface, scene.subtitle!.toUpperCase(), subtitleFontSize);
    this.cutsceneSubtitleText.letterSpacing = 0.5;
    this.cutsceneSubtitleText.tint = 0xffffff;
    this.cutsceneSubtitleText.x = window.innerWidth / 2 - this.cutsceneSubtitleText.width / 2
    this.cutsceneSubtitleText.y = window.innerHeight / 2 + this.cutsceneTitleText.height / 2
    this.cutsceneSubtitleText.setDepth(102);
    this.cutsceneSubtitleText.alpha = 0;
    
    
    this.tweens.add({
      targets: [this.cutsceneBackground, this.cutsceneSubtitleText, this.cutsceneTitleText],
      duration: 700,
      alpha:1,
      complete: ()=>
      {
        if (this.currentScene)
        {
          this.scene.stop(this.currentScene);
          this.scene.remove(this.currentScene);
        }
      }
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
          this.launchScene(scene);
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
    console.log('Object Found');
    // this.hiddenObjectIndicators.indexOf(object)
		// this.ic
	}

  private resize (gameSize:any, baseSize:any, displaySize:any, resolution:any): void
  {
    if (this.currentScene == undefined) return;

    const scaleWidth = this.currentScene.scale.gameSize.width;
    const scaleHeight = this.currentScene.scale.gameSize.height;

    this.currentScene.parent = new Phaser.Structs.Size(scaleWidth, scaleHeight);
    this.currentScene.sizer = new Phaser.Structs.Size(this.currentScene.scale.width, this.currentScene.scale.height); 

    const scaleX = this.currentScene.sizer.width / this.game.canvas.width
    const scaleY = this.currentScene.sizer.height / this.game.canvas.height

    this.currentScene.cameras.main.setZoom(Math.max(scaleX, scaleY));
    this.currentScene.cameras.main.centerOn(this.game.canvas.width / 2, this.game.canvas.height / 2);
  }
}
