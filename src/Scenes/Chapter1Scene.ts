import { BlinkingStatus, FaceDetectorScene } from "../FaceDetectorScene";
import { Detector } from "../FaceLandmarkDetector";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: "Chapter1Scene",
};

export class Chapter1Scene extends FaceDetectorScene {
  // Cutscene
  static title: string = "Lost in the Flood";
  static subtitle: string = "Chapter 1";

  public sceneWidth: number = 8525;
  public sceneHeight: number = 4796;

  private depth = 1;

  // private eyeMask!: Phaser.GameObjects.Image;
  private blackBackground!: Phaser.GameObjects.Rectangle;

  private backgroundSprites!: Phaser.GameObjects.Group;
  private phoneSprites!: Phaser.GameObjects.Group;

  private scaleRate!: number;

  private phonesPosition = [
    { x: 833.56, y: -1913.68 },
    { x: 2475.68, y: -1279.96 },
    { x: -629.34, y: -838.02 },
    { x: 350.1, y: -612.88 },
    { x: -475.138, y: -120.91 },
    { x: 516.81, y: -112.57 },
    { x: -1271.18, y: 341.88 },
    { x: 33.34, y: 358.55 },
    { x: -129.2, y: 1438.39 },
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
      frameRate: 0.2,
      repeat: -1,
    });
    console.log(anim);
    object.anims.play("frameAnimation");
  };

  constructor() {
    super(sceneConfig);
  }

  public preload() {
    console.log("Preload");

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
    this.backgroundSprites = this.add.group();
    this.phoneSprites = this.add.group();

    //Load background
    const backgroundsTexture = this.textures.get("backgrounds");

    for (let i = 0; i < backgroundsTexture.getFrameNames().length; i++) {
      this.backgroundSprites.create(
        this.windowWidth / 2,
        this.windowHeight / 2,
        "backgrounds",
        backgroundsTexture.getFrameNames()[i]
      );
    }

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
      x: (this.sceneWidth / 2 + phonePosition.x) * this.widthScale,
      y: (this.sceneHeight / 2 + phonePosition.y) * this.heightScale,
    }));
    console.log(this.phonesPosition);

    for (let i = 0; i < this.phonesPosition.length; i++) {
      const texture = this.textures.get(`phone_0${i + 1}`);
      this.phoneSprites.create(
        this.phonesPosition[i].x,
        this.phonesPosition[i].y,
        `phone_0${i + 1}`,
        texture.getFrameNames()[0]
      );
    }

    //Load Phones
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
    this.mask.invertAlpha = true;
    this.blackBackground.setDepth(100);
    this.blackBackground.setMask(this.mask);
  }

  updatePostionAndScale(translateX: number, translateY: number, scale: number) {
    translateX = translateX - 0.3;
    translateY = translateY - 0.3;

    this.scaleRate = 2 / scale;

    this.backgroundSprites.children.iterate(
      (sprite: Phaser.GameObjects.GameObject) => {
        if (sprite instanceof Phaser.GameObjects.Sprite) {
          sprite.setPosition(
            translateX * window.innerWidth * this.scaleRate,
            translateY * window.innerHeight * this.scaleRate
          );

          sprite.setScale(
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

    this.blackBackground.width = this.windowWidth;
    this.blackBackground.height = this.windowHeight;

    const widthScope = 0.15;
    const heightScope = 0.2;

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
            ) &&
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