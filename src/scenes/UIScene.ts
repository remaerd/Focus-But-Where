import { FaceDetectorScene } from "../FaceDetectorScene";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = 
{
  active: false,
  visible: false,
  key: "UserInterface",
};

export class UIScene extends Phaser.Scene 
{
  // Current Scene

  private _currentScene!: FaceDetectorScene;

  // User Interface

  public isUserInterfaceVisible = false;

  public isLoadingVisible = false;
  
  // Windows Scaling Controls

  private windowWidth = window.innerWidth;
  private windowHeight = window.innerHeight;

  // private widthScale = this.windowWidth / this._currentScene.scale.width;
  // private heightScale = this.windowHeight / this._currentScene.scale.height;

  constructor() 
  {
    super(sceneConfig);

  }

  public preload() 
  {
    console.log("Preload");
  }

  public create() 
  {
    this.launchScene('Chapter1');
  }

  public update() 
  {
    // TODO
    // this.eyeMask.setX(Detector.default!.translateX * window.innerWidth);
    // this.eyeMask.setY(Detector.default!.translateY * window.innerHeight);
  }

  public toggleUserInterface()
  {

  }

  public changeScene(scene: string)
  {

  }

  private launchScene(scene: string, data?: object)
  {
    this.scene.launch(scene, data);
    this._currentScene = this.scene.get(scene) as FaceDetectorScene;
  }

  public updateResize()
  {
    this._currentScene.scale.on('resize', this.resize);
    const scaleWidth = this._currentScene.scale.gameSize.width;
    const scaleHeight = this._currentScene.scale.gameSize.height;

    this._currentScene.parent = new Phaser.Structs.Size(scaleWidth, scaleHeight);
    this._currentScene.sizer = new Phaser.Structs.Size(this._currentScene.scale.width, this._currentScene.scale.height); 

    const scaleX = this._currentScene.sizer.width / this.game.canvas.width
    const scaleY = this._currentScene.sizer.height / this.game.canvas.height

    this._currentScene.cameras.main.setZoom(Math.max(scaleX, scaleY))
    this._currentScene.cameras.main.centerOn(this.game.canvas.width / 2, this.game.canvas.height / 2);

  }

  private resize(gameSize)
  {
    if (!this._currentScene.sceneStopped)
    {
      const width = gameSize.width 
    }
  }
}
