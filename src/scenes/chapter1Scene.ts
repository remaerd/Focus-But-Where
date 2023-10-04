import { BlinkingStatus, FaceDetectorScene } from "../FaceDetectorScene";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: "Chapter1",
};

export class Chapter1Scene extends FaceDetectorScene {
  constructor() {
    super(sceneConfig);
  }

  public preload() {
    console.log("Preload");
    this.load.multiatlas(
      "Chapter1",
      "/Chapter1/chapter_01_50__300ppi.json",
      "/Chapter1/"
    );
  }

  public create() {
    const atlasTexture = this.textures.get("Chapter1");
    if (atlasTexture) {
      const frameNames = atlasTexture.getFrameNames();
      console.log(frameNames);
    }
    const sprite = this.add.sprite(
      window.innerWidth / 2,
      window.innerHeight / 2,
      "Chapter1",
      "300ppi/background_03.png"
    );
    sprite.setScale(
      window.innerWidth / sprite.width,
      window.innerHeight / sprite.height
    );
  }

  public update() {
    // TODO
  }

  onBlinkStatusChanged(status: BlinkingStatus): void {}
}
