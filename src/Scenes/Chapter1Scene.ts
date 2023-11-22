import { BlinkingStatus, FaceDetectorScene } from "../FaceDetectorScene";
import { Detector } from "../faceLandmarkDetector";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: "Chapter1",
};

export class Chapter1Scene extends FaceDetectorScene 
{
  // Cutscene
  public title: string = 'Lost in the Flood';
  public subtitle: string = 'Chapter 1';

  public sceneWidth: number = 4796;
  public sceneHeight: number = 8525;

  private depth = 1;

  private blackBackground!: Phaser.GameObjects.Rectangle;

  private backgrounds = [] as Phaser.GameObjects.Sprite[];
  private phones = [] as Phaser.GameObjects.Sprite[];

  private phonesPosition = [
    { x: 833.56, y: 1913.68 },
    { x: 2475.68, y: 1279.96 },
    { x: -629.34, y: 838.02 },
    { x: 350.1, y: 612.88 },
    { x: -475.138, y: 120.91 },
    { x: 516.81, y: 112.57 },
    { x: -1271.18, y: -341.88 },
    { x: 33.34, y: -358.55 },
    { x: -129.2, y: -1438.39 },
  ];

  private phoneTrigger = [1, 5, 9];

  private scope = 150;

  private phoneMap = new Map();

  isNear = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.abs(x1 - x2) < this.scope && Math.abs(y1 - y2) < this.scope;
  };

  playFrameAnimation = (
    object: Phaser.GameObjects.Sprite,
    frameNames: string[]
  ) => {
    const anim = object.anims.create({
      key: "frameAnimation",
      frames: frameNames.map((frameName) => ({
        key: object.texture.key,
        frame: frameName,
      })),
      frameRate: 1,
      repeat: -1,
    });
    object.anims.play("frameAnimation");
  };

  constructor() {
    super(sceneConfig);
  }

  public preload() {
    console.log("Preload");

    //format phone position
    this.phonesPosition = this.phonesPosition.map((phonePosition) => ({
      x:
        (this.sceneWidth / 2 + phonePosition.x) *
        (this.windowWidth / this.sceneWidth),
      y:
        (this.sceneHeight / 2 - phonePosition.y) *
        (this.windowHeight / this.sceneHeight),
    }));
    console.log(this.phonesPosition);


    //load background
    this.load.multiatlas(
      "backgrounds",
      "/Chapter1/background.json",
      "/Chapter1/"
    );

    //load phones
    for (let i = 0; i < this.phonesPosition.length; i++) {
      this.load.multiatlas(
        `phone_0${i + 1}`,
        `/Chapter1/phone_0${i + 1}.json`,
        "/Chapter1/"
      );
    }
  }

  public create() {
    //Load background
    const backgroundsTexture = this.textures.get("backgrounds");
    for (let i = 0; i < backgroundsTexture.getFrameNames().length; i++) {
      this.backgrounds.push(
        this.add.sprite(
          this.windowWidth / 2,
          this.windowHeight / 2,
          "backgrounds",
          `background_0${i + 1}.png`
        )
      );

      this.backgrounds[i].setScale(this.widthScale, this.widthScale);
      this.backgrounds[i].setDepth(this.depth);
      // this.backgrounds[i].setMask(this.mask);
      this.depth++;
    }

    //Load Phones

    for (let i = 0; i < this.phonesPosition.length; i++) {
      const texture = this.textures.get(`phone_0${i + 1}`);
      this.phones.push(
        this.add.sprite(
          this.phonesPosition[i].x,
          this.phonesPosition[i].y,
          `phone_0${i + 1}`,
          texture.getFrameNames()[0]
        )
      );

      this.phones[i].setScale(this.widthScale, this.widthScale);
      this.playFrameAnimation(this.phones[i], texture.getFrameNames());
      this.phones[i].setDepth(this.depth);
      this.depth++;
    }

    this.blackBackground = this.add.rectangle(
      this.windowWidth / 2,
      this.windowHeight / 2,
      this.windowWidth,
      this.windowHeight,
      0x000000
    );
    this.blackBackground.setDepth(100);
    // this.blackBackground.setScale(this.widthScale, this.widthScale);
    this.blackBackground.setMask(this.mask);
  }

  public update() {
    // TODO
    // this.eyeMask.setX(Detector.default!.translateX * window.innerWidth);
    // this.eyeMask.setY(Detector.default!.translateY * window.innerHeight);

    const widthScope = 0.15;
    const heightScope = 0.2;

    if (
      Detector.default!.translateX >= widthScope &&
      Detector.default!.translateX <= 1 - widthScope &&
      Detector.default!.translateY >= heightScope &&
      Detector.default!.translateY <= 1 - heightScope
    ) {
      this.backgrounds.forEach((background) => {
        background.setX(Detector.default!.translateX * window.innerWidth);
        background.setY(Detector.default!.translateY * window.innerHeight);
      });
      this.phones.forEach((phone, index) => {
        phone.setX(
          Detector.default!.translateX * window.innerWidth +
            this.phonesPosition[index].x -
            this.windowWidth / 2
        );
        phone.setY(
          Detector.default!.translateY * window.innerHeight +
            this.phonesPosition[index].y -
            this.windowHeight / 2
        );
      });
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
        console.log(
          "RightEye",
          Detector.default!.translateX * window.innerWidth,
          Detector.default!.translateY * window.innerHeight
        );

        for (let i = 0; i < this.phoneTrigger.length; i++) {
          if (
            this.isNear(
              this.phonesPosition[this.phoneTrigger[i] - 1].x,
              this.phonesPosition[this.phoneTrigger[i] - 1].y,
              Detector.default!.translateX * window.innerWidth,
              Detector.default!.translateY * window.innerHeight
            )
            && 
            !this.phoneMap.get(this.phoneTrigger[i])
          ) {
            this.phoneMap.set(this.phoneTrigger[i], true);
            // FIX: Use the new Hidden Objects Model to Hide the 
            // this.iconTween(this.icons[this.phoneMap.size-1]);
            console.log(this.phoneMap);
          }
        }

        if (this.phoneMap.size === this.phonesPosition.length) {
          this.scene.start("Chapter2");
        }

        return;
      case BlinkingStatus.Both:
        console.log("Both");
        return;
    }
  }
}
