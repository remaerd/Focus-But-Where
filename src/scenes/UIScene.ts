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

export class UIScene extends Phaser.Scene 
{
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

	iconTween = (
		object: Phaser.GameObjects.Sprite,
	) => {
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

    this.changeScene('Chapter1');

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
    this.scene.launch(scene, data);
    this.currentScene = this.scene.get(scene) as FaceDetectorScene;
    this.reloadIcons();
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
    
    this.load.multiatlas("icons", "/Chapter1/icons.json", "/Chapter1/");

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

  hiddenObjectIsFound(object: HiddenObject): void
  {
		
	}


  private resize (gameSize:any, baseSize:any, displaySize:any, resolution:any)
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
