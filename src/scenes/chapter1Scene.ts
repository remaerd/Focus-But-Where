import { BlinkingStatus, FaceDetectorScene } from "../FaceDetectorScene";
import { Detector } from "../faceLandmarkDetector";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: "Chapter1",
  physics: {
    arcade: {
      debug: false,
    },
  },
};

export class Chapter1Scene extends FaceDetectorScene {
  private depth = 1;

  private eyeMask!: Phaser.GameObjects.Image;
  private blackBackground!: Phaser.GameObjects.Rectangle;

  private backgroundSprites!: Phaser.GameObjects.Group;
  private phoneSprites!: Phaser.GameObjects.Group;

  private orginalBackgrondWidth!: number;
  private orginalBackgrondHeight!: number;

  private windowWidth = window.innerWidth;
  private windowHeight = window.innerHeight;

  private widthScale!: number;
  private heightScale!: number;

  private scaleRate!: number;

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
      frameRate: 0.5,
      repeat: -1,
    });
    object.anims.play("frameAnimation");
  };

  private iconList = ["flag.png", "oil.png", "wreath.png"];
  private icons!: Phaser.GameObjects.Sprite[];
  iconTween = (object: Phaser.GameObjects.Sprite) => {
    this.tweens.add({
      targets: object,
      duration: 2000,
      scaleX: 1.5 * this.widthScale,
      scaleY: 1.5 * this.heightScale,
      alpha: 0.7,
      yoyo: true,
      repeat: 0,
    });
  };

  constructor() {
    super(sceneConfig);
  }

  public preload() {
    console.log("Preload");

    //load eye mask
    this.load.image("eyeMask", "/mask_v3.png");

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

    //load icons
    this.load.multiatlas("icons", "/Chapter1/icons.json", "/Chapter1/");
  }

  public create() {
    this.backgroundSprites = this.physics.add.group();
    this.phoneSprites = this.physics.add.group();

    //Load background
    const backgroundsTexture = this.textures.get("backgrounds");

    let background;
    for (let i = 0; i < backgroundsTexture.getFrameNames().length; i++) {
      background = this.backgroundSprites.create(
        this.windowWidth / 2,
        this.windowHeight / 2,
        "backgrounds",
        `background_0${i + 1}.png`
      );
    }

    this.orginalBackgrondWidth = background.width;
    this.orginalBackgrondHeight = background.height;
    this.widthScale = this.windowWidth / this.orginalBackgrondWidth;
    this.heightScale = this.windowHeight / this.orginalBackgrondHeight;

    this.backgroundSprites.children.iterate(
      (sprite: Phaser.GameObjects.GameObject) => {
        if (sprite instanceof Phaser.GameObjects.Sprite) {
          sprite.setScale(this.widthScale, this.heightScale);
          sprite.setDepth(this.depth);
          this.depth++;
        }
        return true;
      }
    );

    //format phone position
    this.phonesPosition = this.phonesPosition.map((phonePosition) => ({
      x: (this.orginalBackgrondWidth / 2 + phonePosition.x) * this.widthScale,
      y: (this.orginalBackgrondHeight / 2 - phonePosition.y) * this.heightScale,
    }));
    console.log(this.phonesPosition);
    //Load Phones
    for (let i = 0; i < this.phonesPosition.length; i++) {
      const texture = this.textures.get(`phone_0${i + 1}`);
      this.phoneSprites
        .create(
          this.phonesPosition[i].x,
          this.phonesPosition[i].y,
          `phone_0${i + 1}`,
          texture.getFrameNames()[0]
        )
        .setName(`phone_0${i + 1}`);
    }

    this.phoneSprites.children.iterate(
      (sprite: Phaser.GameObjects.GameObject) => {
        if (sprite instanceof Phaser.GameObjects.Sprite) {
          sprite.setScale(this.widthScale, this.heightScale);
          this.playFrameAnimation(sprite, sprite.texture.getFrameNames());
          sprite.setDepth(this.depth);
          this.depth++;
        }
        return true;
      }
    );

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

    //Load Icons
    this.icons = [];
    for (let i = 0; i < this.iconList.length; i++) {
      this.icons.push(
        this.add.sprite(
          this.windowWidth / 2 + (this.windowWidth / 6) * (i - 1),
          (this.windowHeight / 10) * 9,
          "icons",
          this.iconList[i]
        )
      );
      this.icons[i].setDepth(1000);
      this.icons[i].setScale(this.widthScale, this.heightScale);
    }
  }

  updatePostionAndScale(translateX: number, translateY: number, scale: number) {
    this.widthScale = this.windowWidth / this.orginalBackgrondWidth;
    this.heightScale = this.windowHeight / this.orginalBackgrondHeight;
    this.scaleRate = 2 / scale;

    this.backgroundSprites.children.iterate(
      (background: Phaser.GameObjects.GameObject) => {
        if (background instanceof Phaser.GameObjects.Sprite) {
          background.setPosition(
            translateX * window.innerWidth * this.scaleRate,
            translateY * window.innerHeight * this.scaleRate
          );
          background.setScale(
            this.widthScale * this.scaleRate,
            this.heightScale * this.scaleRate
          );
        }
        return true;
      }
    );

    this.phoneSprites.children.iterate(
      (sprite: Phaser.GameObjects.GameObject, index) => {
        let nowX =
          (translateX * window.innerWidth +
            this.phonesPosition[index].x -
            this.windowWidth / 2) *
          this.scaleRate;
        let nowY =
          (translateY * window.innerHeight +
            this.phonesPosition[index].y -
            this.windowHeight / 2) *
          this.scaleRate;
        if (sprite instanceof Phaser.GameObjects.Sprite) {
          sprite.setPosition(nowX, nowY);
          sprite.setScale(
            this.widthScale * this.scaleRate,
            this.heightScale * this.scaleRate
          );
        }
        return true;
      }
    );
  }

  public update() {
    // TODO

    const widthScope = 0.05;
    const heightScope = 0.05;
    if (
      Detector.default!.translateX >= widthScope &&
      Detector.default!.translateX <= 1 - widthScope &&
      Detector.default!.translateY >= heightScope &&
      Detector.default!.translateY <= 1 - heightScope
    ) {
      this.updatePostionAndScale(
        Detector.default!.translateX,
        Detector.default!.translateY,
        Detector.default!.scale
      );
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

        this.phoneSprites.children.iterate(
          (sprite: Phaser.GameObjects.GameObject, index) => {
            if (sprite instanceof Phaser.GameObjects.Sprite) {
              if (
                this.isNear(
                  Detector.default!.translateX *
                    this.windowWidth *
                    this.scaleRate,
                  Detector.default!.translateY *
                    this.windowHeight *
                    this.scaleRate,
                  sprite.x,
                  sprite.y
                ) &&
                !this.phoneMap.get(this.phoneTrigger[index])
              ) {
                this.phoneMap.set(this.phoneTrigger[index], true);
                this.iconTween(this.icons[this.phoneMap.size - 1]);
                console.log("choosed:", this.phoneMap);
              }
            }
            return true;
          }
        );

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
