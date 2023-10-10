import { BlinkingStatus, FaceDetectorScene } from "../FaceDetectorScene";
import { Detector } from "../faceLandmarkDetector";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: "Chapter1",
};

export class Chapter1Scene extends FaceDetectorScene {
  private depth = 1;

  private eyeMask!: Phaser.GameObjects.Image;
  private blackBackground!: Phaser.GameObjects.Rectangle;

  private maskX = Phaser.Math.Between(0, 800);
  private maskY = Phaser.Math.Between(0, 600);

  private phonesPosition = [
    { x: 500, y: 500 },
    { x: 600, y: 600 },
  ];

  private scope = 80;

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
    this.load.image("eyeMask", "/EyeMask.svg");
    this.load.multiatlas(
      "backgrounds",
      "/Chapter1/background.json",
      "/Chapter1/"
    );
    console.log(this.phonesPosition);
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
    const backgrounds = [];
    for (let i = 0; i < backgroundsTexture.getFrameNames().length; i++) {
      backgrounds.push(
        this.add.sprite(
          window.innerWidth / 2,
          window.innerHeight / 2,
          "backgrounds",
          `background_0${i + 1}.png`
        )
      );
      backgrounds[i].setScale(
        window.innerWidth / backgrounds[i].width,
        window.innerHeight / backgrounds[i].height
      );
      backgrounds[i].setDepth(this.depth);
      this.depth++;
    }

    //Load Phones

    const phones = [];
    for (let i = 0; i < this.phonesPosition.length; i++) {
      const texture = this.textures.get(`phone_0${i + 1}`);
      phones.push(
        this.add.sprite(
          this.phonesPosition[i].x,
          this.phonesPosition[i].y,
          `phone_0${i + 1}`,
          texture.getFrameNames()[0]
        )
      );

      phones[i].setScale(
        phones[i].width / backgrounds[i].width,
        phones[i].height / backgrounds[i].height
      );
      this.playFrameAnimation(phones[i], texture.getFrameNames());
      phones[i].setDepth(this.depth);
      this.depth++;
    }

    //Load Eye Mask
    this.blackBackground = this.add.rectangle(
      window.innerWidth / 2,
      window.innerHeight / 2,
      window.innerWidth,
      window.innerHeight,
      0x000000
    );
    this.blackBackground.setDepth(this.depth);
    this.depth++;

    this.eyeMask = this.add.image(this.maskX, this.maskY, "eyeMask");
    const mask = this.eyeMask.createBitmapMask();
    mask.invertAlpha = true;
    this.blackBackground.setMask(mask);
  }

  public update() {
    // TODO

    this.eyeMask.setX(Detector.default!.translateX * window.innerWidth);
    this.eyeMask.setY(Detector.default!.translateY * window.innerHeight);
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
