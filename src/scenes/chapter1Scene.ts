import { BlinkingStatus, FaceDetectorScene } from "../FaceDetectorScene";
import { Detector } from "../faceLandmarkDetector";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: "Chapter1",
};

export class Chapter1Scene extends FaceDetectorScene {
  private eyeMask!: Phaser.GameObjects.Image;
  private maskX = Phaser.Math.Between(0, 800);
  private maskY = Phaser.Math.Between(0, 600);

  private phonesPosition = [
    { x: 500, y: 500 },
    { x: 600, y: 600 },
  ];

  private scope = 100;

  private phoneMap = new Map();

  isNear = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.abs(x1 - x2) < this.scope && Math.abs(y1 - y2) < this.scope;
  };

  constructor() {
    super(sceneConfig);
  }

  public preload() {
    console.log("Preload");
    this.load.image("eyeMask", "/EyeMask.svg");
    this.load.multiatlas(
      "Chapter1",
      "/Chapter1/chapter_01_50__300ppi.json",
      "/Chapter1/"
    );
    console.log(this.phonesPosition);
  }

  public create() {
    this.eyeMask = this.add.image(this.maskX, this.maskY, "eyeMask");
    const mask = this.eyeMask.createBitmapMask(undefined);

    const backgrounds = [];
    for (let i = 0; i < 3; i++) {
      backgrounds.push(
        this.add.sprite(
          window.innerWidth / 2,
          window.innerHeight / 2,
          "Chapter1",
          `300ppi/background_0${i + 1}.png`
        )
      );
      backgrounds[i].setScale(
        window.innerWidth / backgrounds[i].width,
        window.innerHeight / backgrounds[i].height
      );
      backgrounds[i].setMask(mask);
    }
  }

  public update() {
    // TODO

    this.eyeMask.setX(Detector.default!.translateX * window.innerWidth);
    this.eyeMask.setY(Detector.default!.translateY * window.innerHeight);
    // console.log(
    //   Detector.default!.translateX * window.innerWidth,
    //   Detector.default!.translateY * window.innerHeight
    // );
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
        for (let i = 0; i < this.phonesPosition.length; i++) {
          if (
            this.isNear(
              this.phonesPosition[i].x,
              this.phonesPosition[i].y,
              Detector.default!.translateX * window.innerWidth,
              Detector.default!.translateY * window.innerHeight
            )
          ) {
            this.phoneMap.set(i, true);
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
