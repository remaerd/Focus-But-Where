const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: "Chapter3",
};

export class Chapter3Scene extends Phaser.Scene {
  constructor() {
    super(sceneConfig);
  }

  public preload() {
    console.log("Preload");
  }

  public create() {}

  public update() {
    // TODO
  }
}
