import { BlinkingStatus, FaceDetectorScene } from "../FaceDetectorScene";
import { Detector } from "../faceLandmarkDetector";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: "Chapter3",
};

export class Chapter3Scene extends Phaser.Scene {
  private depth = 1;

  private eyeMask!: Phaser.GameObjects.Image;
  private blackBackground!: Phaser.GameObjects.Rectangle;

  private background!: Phaser.GameObjects.Image;

  private windowWidth = window.innerWidth;
  private windowHeight = window.innerHeight;

  private backgroundImageWidth = 8000;
  private backgroundImageHeight = 4500;

  private widthScale = this.windowWidth / this.backgroundImageWidth;
  private heightScale = this.windowHeight / this.backgroundImageHeight;

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

    //load eyeMask
    this.load.image("eyeMask", "/EyeMask.svg");

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

    this.eyeMask = this.add.image(
      this.windowWidth / 2,
      this.windowHeight / 2,
      "eyeMask"
    );
    console.log(this.eyeMask.width, this.eyeMask.height);
    console.log(this.windowWidth, this.windowHeight);
    this.eyeMask.setScale(
      ((this.windowWidth / this.eyeMask.width) * 2) / 3,
      ((this.windowHeight / this.eyeMask.height) * 2) / 3
    );
    const mask = this.eyeMask.createBitmapMask();

    mask.invertAlpha = true;
    this.blackBackground.setMask(mask);

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

  onBlinkStatusChanged(status: BlinkingStatus): void {
    switch (status) {
      case BlinkingStatus.None:
        console.log("None");
        return;
      case BlinkingStatus.LeftEye:
        console.log("LeftEye");
        return;
      case BlinkingStatus.RightEye:
        console.log("RightEye");
    }
  }
}
