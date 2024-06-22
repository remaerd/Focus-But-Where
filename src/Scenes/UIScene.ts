import { FaceDetectorScene } from "../FaceDetectorScene";
import { Detector } from "../FaceLandmarkDetector";
import { Defaults } from "../Models/Defaults";
import { MainMenuScene } from "./MainMenu/Scene";
import { PermissionScene } from "./PermissionScene";

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
  public currentScene?: FaceDetectorScene;

  // User Interface
  public isUserInterfaceVisible = false;

  public isLoadingVisible = false;

  // Hidden Object Icons Indicators
	private hiddenObjectIndicators: Phaser.GameObjects.Sprite[] = []; 

  // Zoom Indicator
  private zoomIndicator!: Phaser.GameObjects.Image;
  private zoomIndicatorBackground!: Phaser.GameObjects.Image;

  private flashBackground!: Phaser.GameObjects.Rectangle;

  public descriptionText!: Phaser.GameObjects.BitmapText;

  // Cutscene
  private cutsceneBackground!: Phaser.GameObjects.Rectangle;
  private cutsceneTitleText!: Phaser.GameObjects.BitmapText;
  private cutsceneSubtitleText!: Phaser.GameObjects.BitmapText;

  private mainMenuCountdown? : Phaser.Time.TimerEvent;
  private mainMenuConfirm? : Phaser.Time.TimerEvent;
  public backgroundMusic?: Phaser.Sound.NoAudioSound | Phaser.Sound.WebAudioSound | Phaser.Sound.HTML5AudioSound;

  public sfxs!: Phaser.Sound.WebAudioSound | Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound;

	iconTween = ( object: Phaser.GameObjects.Sprite ) => 
  {
		this.tweens.add({
      targets: object,
      duration: 1000,
      scaleX: 0.4,
      scaleY: 0.4,
      alpha: 0.3,
      repeat: 0,
		});
	}

  constructor() 
  {
    super(sceneConfig);
  }

  public preload() 
  {
    this.load.multiatlas("interface", "144ppi/Interface.json", "144ppi");
    this.load.bitmapFont(headlineTypeface, "Fonts/RoadRage_0.png", "Fonts/RoadRage.fnt");
    this.load.bitmapFont(defaultTypeface, "Fonts/Gaegu_0.png", "Fonts/Gaegu.fnt");
    this.load.audioSprite('sfxs', 'Audio/sfxs.json', ['Audio/sfxs.mp3']);
    this.load.audio('Chapter_1_Intro', 'Audio/Chapter_1_Intro.mp3');
  }

  public create() 
  {
    this.zoomIndicatorBackground = this.add.image(100,100,"interface", "Control_Zoom_Slider");
    this.zoomIndicatorBackground.setScale(0.5);
    this.zoomIndicatorBackground.setDepth(1);
    this.zoomIndicatorBackground.setAlpha(0);

    this.zoomIndicator = this.add.image(100,100,"interface", "Control_Zoom_Indicator");
    this.zoomIndicator.setScale(0.5);
    this.zoomIndicator.setDepth(2);
    this.zoomIndicator.setAlpha(0);

    this.changeScene(PermissionScene);
    this.scale.on('resize', this.resize, this);

    this.flashBackground = this.add.rectangle(0,0,window.innerWidth, window.innerHeight, 0xffffff);
		this.flashBackground.alpha = 0;
		this.flashBackground.setDepth(200);

    this.sfxs = this.sound.addAudioSprite('sfxs');

    this.descriptionText = this.add.bitmapText(0,0, defaultTypeface, "", bodyFontSize, 0.5);
    this.descriptionText.letterSpacing = 0.5;
    this.descriptionText.tint = 0xffffff;
  }

  public update() 
  {
    this.flashBackground.width = window.innerWidth * 2;
    this.flashBackground.height = window.innerHeight * 2;

    this.descriptionText.align = 0.5;
    this.descriptionText.x = window.innerWidth / 2;
    this.descriptionText.y = window.innerHeight  - 40;

    if (this.cutsceneBackground)
    {
      this.cutsceneBackground.width = window.innerWidth * 2;
      this.cutsceneBackground.height = window.innerHeight * 2;
    }

    if (Detector.default)
    {
      let zoomIndicatorY = this.zoomIndicatorBackground.y - 80 + ((this.zoomIndicatorBackground.height *0.5)) * (Detector.default!.scale - 1);
      let minimumY = this.zoomIndicatorBackground.y - this.zoomIndicatorBackground.height *0.5 / 2;
      let maximumY = this.zoomIndicatorBackground.y + this.zoomIndicatorBackground.height - 300;

      if (!(this.currentScene instanceof MainMenuScene) && !(this.currentScene instanceof PermissionScene))
      {
        if (!this.mainMenuCountdown && zoomIndicatorY >= maximumY) this.showMainMenuCountdown();
        else if (this.mainMenuCountdown != undefined && zoomIndicatorY < maximumY) this.hideCountdownMenu();
      }

      if (zoomIndicatorY <= minimumY ) zoomIndicatorY = minimumY;
      else if (zoomIndicatorY >= maximumY)
      {
        zoomIndicatorY = maximumY;
      }
      this.zoomIndicator.y = zoomIndicatorY;
    }
    
    this.zoomIndicatorBackground.y = window.innerHeight / 2;
  }

  public changeScene(scene: typeof FaceDetectorScene, _data?: object)
  {
    this.backgroundMusic?.stop()
    if (this.currentScene)
    {
      this.scene.stop(this.currentScene);
      this.scene.sendToBack(this.currentScene);
    }
    if (scene.title && scene.subtitle) this.showCutscene(scene);
    else this.launchScene(scene);
  }

  private launchScene(scene: typeof FaceDetectorScene)
  {
    this.currentScene = this.scene.get(scene.sceneName) as FaceDetectorScene;
    console.log(this.currentScene);
    console.log('Loading Scene '+ scene.sceneName + ', Activated: ' + this.scene.isActive(scene.sceneName));
    
    this.currentScene.load.on('complete', () =>
    {
      console.log('Launching Scene '+ scene.sceneName);
      this.scene.sendToBack(this.currentScene);

      switch(scene.sceneName)
      { 
        case 'Chapter1Scene': this.reloadIcons(1); break;
        case 'Chapter3Scene': this.reloadIcons(3); break;
        default: this.reloadIcons(0);
      }

      if (this.currentScene?.backgroundNusicPath)
      {
        this.backgroundMusic = this.sound.add(this.currentScene!.backgroundNusicPath!);
        this.backgroundMusic.setLoop(true);
        this.backgroundMusic.setVolume(0.5);
        this.backgroundMusic.play();
      }
    });

    this.scene.launch(this.currentScene);
  }

  private reloadIcons(chapter: integer = 0)
  {
		// Remove Icons from Previous Scene
    if (this.hiddenObjectIndicators.length != 0)
    {
      for (let i = 0; i < this.hiddenObjectIndicators.length; i++)
      {
        this.hiddenObjectIndicators[i].destroy();
      }
      this.hiddenObjectIndicators = [];
    }

    if (chapter != 0)
    {
      this.zoomIndicator.setAlpha(1);
      this.zoomIndicatorBackground.setAlpha(1);
      const hiddenObjects = Defaults.shared.allHiddenObjects[chapter-1];
      for (let i = 0; i < hiddenObjects.length; i++)
      {
        let objectIndicator = this.add.sprite(
          window.innerWidth / 2 + window.innerWidth / 8 * (i - 1),
          window.innerHeight / 12 * 11,
          "interface",
          "Clue_"+ chapter + "_" + (i+1))
          objectIndicator.setScale(0.5);
        this.hiddenObjectIndicators.push(objectIndicator);
        this.hiddenObjectIndicators[i].setDepth(1);
      }
    }
    else
    {
      this.zoomIndicator.setAlpha(0);
      this.zoomIndicatorBackground.setAlpha(0);
    }
  }

  createCutscene(title: string, subtitle: string)
  {
    this.cutsceneBackground = this.add.rectangle(0,0,window.innerWidth, window.innerHeight, 0x000000);
    this.cutsceneBackground.setDepth(100);
    this.cutsceneBackground.alpha = 0;

    this.cutsceneTitleText = this.add.bitmapText(0,0,headlineTypeface, title, headlineFontSize);
    this.cutsceneTitleText.tint = 0xffffff;
    this.cutsceneTitleText.x = window.innerWidth / 2 - this.cutsceneTitleText.width / 2
    this.cutsceneTitleText.y = window.innerHeight / 2 - this.cutsceneTitleText.height / 2
    this.cutsceneTitleText.setDepth(101);
    this.cutsceneTitleText.alpha = 0;

    this.cutsceneSubtitleText = this.add.bitmapText(0,0,defaultTypeface, subtitle.toUpperCase(), subtitleFontSize);
    this.cutsceneSubtitleText.letterSpacing = 0.5;
    this.cutsceneSubtitleText.tint = 0xffffff;
    this.cutsceneSubtitleText.x = window.innerWidth / 2 - this.cutsceneSubtitleText.width / 2
    this.cutsceneSubtitleText.y = window.innerHeight / 2 + this.cutsceneTitleText.height / 2
    this.cutsceneSubtitleText.setDepth(102);
    this.cutsceneSubtitleText.alpha = 0;
  }

  showMainMenuCountdown()
  { 
    this.createCutscene('3', 'Continue?');

    var countdown = 3; 
    this.mainMenuCountdown = this.time.addEvent({
      delay:1000, 
      loop: true,
      callback: () =>
      {
        this.cutsceneTitleText.text = countdown.toString();
        countdown -= 1;
      },
    })
    this.tweens.add({
      targets: [this.cutsceneBackground, this.cutsceneSubtitleText, this.cutsceneTitleText],
      duration: 700,
      alpha:1,
    });

    this.mainMenuConfirm = this.time.delayedCall(3000, () => 
    {
      this.mainMenuCountdown?.remove();
      console.log("Moving back to MainMenu");
      this.changeScene(MainMenuScene);
      this.tweens.add({
        targets: [this.cutsceneBackground, this.cutsceneSubtitleText, this.cutsceneTitleText],
        duration: 700,
        alpha:0,
        complete: () =>
          {
            this.cutsceneBackground.destroy();
            this.cutsceneTitleText.destroy();
            this.cutsceneSubtitleText.destroy();
          }
      });
    }, [], this);
  }

  hideCountdownMenu()
  {
    console.log('Ending CountDown');
    this.mainMenuCountdown?.destroy();
    this.mainMenuCountdown = undefined;
    this.mainMenuConfirm?.destroy();
    this.mainMenuConfirm = undefined;
    
    this.tweens.add({
      targets: [this.cutsceneBackground, this.cutsceneSubtitleText, this.cutsceneTitleText],
      duration: 700,
      alpha:0,
      complete: () =>
        {
          this.cutsceneBackground.destroy();
          this.cutsceneTitleText.destroy();
          this.cutsceneSubtitleText.destroy();
        }
    });
  }

  /**
   * Temporary display Cutscene with Title and subtitle
   * @param title Cutscene Title
   * @param subtitle Cutscene Subtitle
   * @param duration Delay Millisecond
   */
  showCutscene(scene: typeof FaceDetectorScene, duration: number = 12000)
  { 
    this.createCutscene(scene.title!, scene.subtitle!);
    if (scene.introAudioFile) this.sound.play('Chapter_1_Intro');

    this.tweens.add({
      targets: [this.cutsceneBackground, this.cutsceneSubtitleText, this.cutsceneTitleText],
      duration: 700,
      alpha:1,
      complete: () =>
      {
        if (scene && this.currentScene)
        { 
          this.scene.setVisible(false, this.currentScene)
          this.scene.setActive(false, this.currentScene);
          this.scene.stop(this.currentScene);
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
          this.cutsceneBackground.destroy();
          this.cutsceneTitleText.destroy();
          this.cutsceneSubtitleText.destroy();
          this.launchScene(scene);
        }
      });
    }, [], this);
  }

  public foundHiddenObject(chapterIndex: integer, objectIndex: integer) 
  {
    const hiddenObject = Defaults.shared.allHiddenObjects[chapterIndex][objectIndex];
    if (!hiddenObject.isFound)
    {
      this.iconTween(this.hiddenObjectIndicators[objectIndex]);
      this.flashBackground.alpha = 1;
      this.tweens.add({
        targets: [this.flashBackground],
        duration: 1000,
        alpha:0,
      });
      
      hiddenObject.isFound = true;
    }
  }

  private resize (): void
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
