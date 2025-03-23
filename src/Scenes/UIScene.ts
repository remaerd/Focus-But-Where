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
export const headlineFontSize = 96;
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
  private mainMenuButton!: Phaser.GameObjects.Image;

  private flashBackground!: Phaser.GameObjects.Rectangle;

  private descriptionText!: Phaser.GameObjects.Text;

  // Cutscene
  private cutsceneBackground!: Phaser.GameObjects.Rectangle;
  private cutsceneTitleText!: Phaser.GameObjects.Text;
  private cutsceneSubtitleText!: Phaser.GameObjects.Text;

  private mainMenuCountdown? : Phaser.Time.TimerEvent;
  private mainMenuConfirm? : Phaser.Time.TimerEvent;
  public backgroundMusic?: Phaser.Sound.NoAudioSound | Phaser.Sound.WebAudioSound | Phaser.Sound.HTML5AudioSound;

  public sfxs!: Phaser.Sound.WebAudioSound | Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound;


  // Move zoomIndicator and zoomIndicatorBackground to the center left of the screen
  private centerX = 50; // Adjust this value as needed to position it closer to the left edge
  private centerY = window.innerHeight / 2;

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
    this.zoomIndicatorBackground = this.add.image(100,100,"interface", "Control_Zoom_Background");
    this.zoomIndicatorBackground.setScale(0.5);
    this.zoomIndicatorBackground.setDepth(1);
    this.zoomIndicatorBackground.setAlpha(0);

    this.zoomIndicator = this.add.image(100,100,"interface", "Control_Zoom_Indicator");
    this.zoomIndicator.setScale(0.5);
    this.zoomIndicator.setDepth(2);
    this.zoomIndicator.setAlpha(0);

    this.mainMenuButton = this.add.image(100,100,"interface", "Control_Main_Menu");
    this.mainMenuButton.setScale(0.5);
    this.mainMenuButton.setDepth(1);
    this.mainMenuButton.setAlpha(0);

    this.changeScene(PermissionScene);
    this.scale.on('resize', this.resize, this);

    this.flashBackground = this.add.rectangle(0,0,window.innerWidth, window.innerHeight, 0xffffff);
		this.flashBackground.alpha = 0;
		this.flashBackground.setDepth(200);

    this.sfxs = this.sound.addAudioSprite('sfxs');

    this.descriptionText = this.add.text(0,0, "", { fontFamily: 'Gaegu', fontSize: 18, color: '#ffffff' });
    this.descriptionText.letterSpacing = 0.5;
    this.descriptionText.setBackgroundColor('#000000');
    this.descriptionText.tint = 0xffffff;
  }

  public update() 
  {
    this.zoomIndicatorBackground.x = this.centerX;
    this.zoomIndicatorBackground.y = this.centerY;

    this.zoomIndicator.x = this.centerX;
    this.zoomIndicator.y = this.centerY;

    this.mainMenuButton.x = 50; 

    if (Defaults.shared.faceControlEnabled) { this.mainMenuButton.y = this.centerY + this.zoomIndicatorBackground.height / 2; }
    else { this.mainMenuButton.y = this.centerY + this.zoomIndicatorBackground.height - 100; }
    this.flashBackground.width = window.innerWidth * 2;
    this.flashBackground.height = window.innerHeight * 2;

    this.descriptionText.setAlign('center');
    this.descriptionText.x = window.innerWidth / 2;
    this.descriptionText.y = window.innerHeight  - 40;
    this.descriptionText.setOrigin(0.5)

    if (this.cutsceneBackground) {
      this.cutsceneBackground.width = window.innerWidth * 2;
      this.cutsceneBackground.height = window.innerHeight * 2;
    }

    if (this.currentScene instanceof PermissionScene) { this.input.setDefaultCursor('pointer'); }
    else  { this.input.setDefaultCursor('none'); }
    
    if (Detector.default) {
        const scale = Phaser.Math.Clamp(Detector.default.scale, 0, 1.5);
        const zoomIndicatorRange = this.zoomIndicatorBackground.height * 0.5 / 2;
        const zoomIndicatorMinY = this.zoomIndicatorBackground.y - this.zoomIndicatorBackground.height * 0.5;
        const zoomIndicatorMaxY = this.zoomIndicatorBackground.y + zoomIndicatorRange;
        const zoomIndicatorY = Phaser.Math.Linear(
          zoomIndicatorMinY,
          zoomIndicatorMaxY,
          (scale - 0) / (1.5 - 0)
        );
    
        if (!(this.currentScene instanceof MainMenuScene) && !(this.currentScene instanceof PermissionScene)) 
        {
          if (scale >= 1.5 && this.mainMenuCountdown == undefined) this.showMainMenuCountdown();
          else if (this.mainMenuCountdown != undefined && scale < 1.5) this.hideCountdownMenu();
        }
  
        this.zoomIndicator.y = zoomIndicatorY;
    }
  }

  public changeScene(scene: typeof FaceDetectorScene, _data?: object)
  {
    this.backgroundMusic?.stop()
    if (this.currentScene)
    {
      this.scene.stop(this.currentScene);
      this.scene.sendToBack(this.currentScene);
      this.setDescriptionText("");
    }
    if (scene.cutsceneVideoFileName && this.currentScene?.isStarted == false) this.showCutsceneVideo(scene);
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
        case 'Chapter2Scene': this.reloadIcons(2); break;
        case 'Chapter3Scene': this.reloadIcons(3); break;
        default: this.reloadIcons(0);
      }

      if (this.currentScene?.backgroundMusicPath)
      {
        this.backgroundMusic = this.sound.add(this.currentScene!.backgroundMusicPath!);
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
      this.setUserInterfacesTransparency(1);
    }
    else
    {
      this.setUserInterfacesTransparency(0);
    };
    
  }

  private setUserInterfacesTransparency(alpha: number)
  {
    this.zoomIndicator.setAlpha(alpha);
    this.zoomIndicatorBackground.setAlpha(alpha);
    this.mainMenuButton.setAlpha(alpha);
    for (let i = 0; i < this.hiddenObjectIndicators.length; i++)
    {
      this.hiddenObjectIndicators[i].setAlpha(alpha);
    }
  }

  createCutscene(title: string, subtitle: string)
  {
    this.cutsceneBackground = this.add.rectangle(0,0,window.innerWidth, window.innerHeight, 0x000000);
    this.cutsceneBackground.setDepth(100);
    this.cutsceneBackground.alpha = 0;

    this.cutsceneTitleText = this.add.text(0,0, title, { fontFamily: defaultTypeface, fontSize: headlineFontSize, color: '#ffffff' });
    this.cutsceneTitleText.tint = 0xffffff;
    this.cutsceneTitleText.x = window.innerWidth / 2 - this.cutsceneTitleText.width / 2
    this.cutsceneTitleText.y = window.innerHeight / 2 - this.cutsceneTitleText.height / 2
    this.cutsceneTitleText.setDepth(101);
    this.cutsceneTitleText.alpha = 0;

    this.cutsceneSubtitleText = this.add.text(0,0, subtitle.toUpperCase(), { fontFamily: defaultTypeface, fontSize: subtitleFontSize, color: '#ffffff' });
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

    this.mainMenuConfirm = this.time.delayedCall(4000, () => 
    {
      this.mainMenuCountdown?.remove();
      console.log("Moving back to MainMenu");
      this.changeScene(MainMenuScene);
      this.tweens.add({
        targets: [this.cutsceneBackground],
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
    
    this.cutsceneBackground.destroy();
    this.cutsceneTitleText.destroy();
    this.cutsceneSubtitleText.destroy();
        
    this.tweens.add({
      targets: [this.cutsceneBackground,],
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

  showCutsceneVideo(scene: typeof FaceDetectorScene)
  {
    this.cutsceneBackground = this.add.rectangle(0,0,window.innerWidth, window.innerHeight, 0x000000);
    this.cutsceneBackground.setDepth(100);
    this.cutsceneBackground.alpha = 0;
    this.zoomIndicator.setAlpha(0);
    this.zoomIndicatorBackground.setAlpha(0);
    this.mainMenuButton.setAlpha(0);
    this.setUserInterfacesTransparency(0);

    const video = this.add.video(window.innerWidth/2, window.innerHeight/2).loadURL(scene.cutsceneVideoFileName, false);
    video.setDepth(101);
    video.setScale(0.25);
    video.play();

    // Add spacebar skip functionality
    const spaceKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    let subtitleTimer: Phaser.Time.TimerEvent;
    if (scene.cutsceneSectionsSubtitles)
    {
      let subtitles = scene.cutsceneSectionsSubtitles!;
      // Create timer to check for subtitles
      let currentSubtitleIndex = -1;
      subtitleTimer = this.time.addEvent({
        delay: 100, // Check every 100ms
        callback: () => {

          const currentTime = video.getCurrentTime();
          
          // Find the subtitle that should be displayed
          let subtitleToShow = -1;
          for (let i = 0; i < subtitles.length; i++) {
            if (currentTime >= subtitles[i].timestamp) {
              subtitleToShow = i;
            } else {
              break;
            }
          }
          
          // If subtitle changed or should be cleared
          if (subtitleToShow !== currentSubtitleIndex) {
            currentSubtitleIndex = subtitleToShow;
            
            if (subtitleToShow >= 0 && subtitleToShow < subtitles.length) {
              // Show the subtitle
              this.descriptionText.setText(subtitles[subtitleToShow].caption);
              
              // If there's a next subtitle, schedule clearing this one
              if (subtitleToShow + 1 < subtitles.length) {
                const nextTime = subtitles[subtitleToShow + 1].timestamp;
                // Clear slightly before the next subtitle
                // But only if there's a gap (some subtitles might be back-to-back)
                if (nextTime - subtitles[subtitleToShow].timestamp > 0.5) {
                  this.time.delayedCall((nextTime - currentTime - 0.2) * 1000, () => {
                    if (currentSubtitleIndex === subtitleToShow) {
                      this.descriptionText.setText('');
                    }
                  });
                }
              }
            } else {
              // No subtitle at this time
              this.descriptionText.setText('');
            }
          }
        },
        loop: true
      });
    }

    const continueHandler = () =>
    {
      // Skip the video and clean up
      spaceKey?.off('down', skipHandler);
      this.input.off('pointerdown', clickHandler);
      
      // Fade out cutscene
      this.tweens.add({
        targets: [this.cutsceneBackground, video],
        duration: 700,
        alpha: 0,
        onComplete: () => {
          this.cutsceneBackground.destroy();
          video.destroy();
          subtitleTimer.destroy();
          this.setUserInterfacesTransparency(1);
          this.launchScene(scene);
          this.setDescriptionText("");
        }
      });
    }

    const skipHandler = () => 
    {
      console.log(scene.cutsceneSectionsTimestamps);
      if (scene.cutsceneSectionsTimestamps)
      {
        let lastTime = scene.cutsceneSectionsTimestamps[scene.cutsceneSectionsTimestamps.length - 1]
        if (video.getCurrentTime() > lastTime) continueHandler();
        else
        {
          for (let i = 0; i < scene.cutsceneSectionsTimestamps.length; i++)
          {
            if (video.getCurrentTime() < scene.cutsceneSectionsTimestamps[i])
            {
              video.setCurrentTime(scene.cutsceneSectionsTimestamps[i]);
              break;
            }
          }
        }
      }
      else continueHandler();
    };
    
    // Left click skip functionality
    const clickHandler = (pointer: Phaser.Input.Pointer) => {
      if (pointer.leftButtonDown()) {
        skipHandler();
      }
    };
    
    // Register event listeners
    spaceKey?.on('down', skipHandler);
    this.input.on('pointerdown', clickHandler);
    
    video.on('complete', () => 
    {
      skipHandler();
    });

    this.setDescriptionText("[Left click or press spacebar to skip]");
  }

  /**
   * Temporary display Cutscene with Title and subtitle
   * @param title Cutscene Title
   * @param subtitle Cutscene Subtitle
   * @param duration Delay Millisecond
   */
  // showCutscene(scene: typeof FaceDetectorScene, duration: number = 12000)
  // { 
  //   // this.createCutscene(scene.title!, scene.subtitle!);
  //   // if (scene.introAudioFile) this.sound.play('Chapter_1_Intro');

  //   this.tweens.add({
  //     targets: [this.cutsceneBackground, this.cutsceneSubtitleText, this.cutsceneTitleText],
  //     duration: 700,
  //     alpha:1,
  //     complete: () =>
  //     {
  //       if (scene && this.currentScene)
  //       { 
  //         this.scene.setVisible(false, this.currentScene)
  //         this.scene.setActive(false, this.currentScene);
  //         this.scene.stop(this.currentScene);
  //       }
  //     }
  //   });
  //   this.time.delayedCall(duration, () => 
  //   {
  //     this.tweens.add({
  //       targets: [this.cutsceneBackground, this.cutsceneSubtitleText, this.cutsceneTitleText],
  //       duration: 700,
  //       alpha:0,
  //       onComplete: ()=>
  //       {
  //         this.cutsceneBackground.destroy();
  //         this.cutsceneTitleText.destroy();
  //         this.cutsceneSubtitleText.destroy();
  //         this.launchScene(scene);
  //       }
  //     });
  //   }, [], this);
  // }

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

  public setDescriptionText(text: string)
  {
    console.log(text == "");
    if (text == "") this.descriptionText.setPadding(0);
    else { this.descriptionText.setPadding(10,5,10,5) }
    this.descriptionText.setText(text);
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
