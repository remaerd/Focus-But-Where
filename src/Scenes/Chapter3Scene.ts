import { BlinkingStatus, FaceDetectorScene } from "../FaceDetectorScene";
import { Detector } from "../FaceLandmarkDetector";

const name = 'Chapter3Scene'
const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: name,
};

export class Chapter3Scene extends FaceDetectorScene 
{
  public static sceneName: string = name;
  public sceneWidth: number = 8000;
  public sceneHeight: number = 4500;

  // Cutscene
  public title: string = "Lost in the Flood";
  public subtitle: string = "Chapter 3";

  private depth = 1;
  private background! : Phaser.GameObjects.Image;
  private blackBackground!: Phaser.GameObjects.Rectangle;
  
  private iconList = [
    "icons/fight.png",
    "icons/wheel.png",
    "icons/brain.png",
    "icons/goggles.png",
  ];
  private icons!: Phaser.GameObjects.Sprite[];

  constructor() {
    super(sceneConfig);
  }

  public preload() {
    console.log("Preload");

    //load chapter_3_factory
    this.load.multiatlas(
      "chapter_3_factory",
      "/Chapter3/chapter_3_factory.json",
      "/Chapter3/"
    );
  }

  public create() {
    const chapter_3_factoryTexture = this.textures.get("chapter_3_factory");
    console.log(chapter_3_factoryTexture.getFrameNames());

    //load background
    this.background = this.add.image(
      this.windowWidth / 2,
      this.windowHeight / 2,
      "chapter_3_factory",
      "background/factory_03.png"
    );
    this.background.setScale(this.widthScale, this.heightScale);
    this.background.setDepth(this.depth);
    this.depth++;

    //Load Eye Mask
    this.blackBackground = this.add.rectangle(
      this.windowWidth / 2,
      this.windowHeight / 2,
      this.windowWidth,
      this.windowHeight,
      0x000000
    );
    this.blackBackground.setDepth(100);
    this.blackBackground.setMask(this.mask);

    //load icons
    this.icons = [];
    for (let i = 0; i < this.iconList.length; i++) {
      this.icons.push(
        this.add.sprite(
          this.windowWidth / 2 + (this.windowWidth / 8) * (i - 1.5),
          (this.windowHeight / 10) * 9,
          "chapter_3_factory",
          this.iconList[i]
        )
      );
      this.icons[i].setScale(this.widthScale, this.heightScale);
      this.icons[i].setDepth(1000);
    }
  }

  public update() {
    // TODO
    const widthScope = 0.15;
    const heightScope = 0.2;

    if (
      Detector.default!.translateX >= widthScope &&
      Detector.default!.translateX <= 1 - widthScope &&
      Detector.default!.translateY >= heightScope &&
      Detector.default!.translateY <= 1 - heightScope
    ) {
      this.background.setX(Detector.default!.translateX * window.innerWidth);
      this.background.setY(Detector.default!.translateY * window.innerHeight);
    }
  }
}
