import SceneData from './scene.json';
import { BlinkingStatus, FaceDetectorScene } from "../../FaceDetectorScene";
import { Defaults } from "../../Models/Defaults";
import { MainMenuScene } from '../MainMenu/Scene';

const name = 'Chapter1Scene';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: name,
};

export class Chapter1Scene extends FaceDetectorScene {

  // Cutscene
  public sceneId = 'Chapter1';
  static title: string = "Lost in the Flood";
  static subtitle: string = "Chapter 1";
  public sceneData? = SceneData;
  public static introAudioFile? = 'Audio/Chapter_1_Intro.mp3';

  public static sceneName: string = name; 
  public backgroundNusicPath?: string | undefined = 'Audio/BGM_Chapter_1.mp3';
  
  public sceneWidth: number = 2048;
  public sceneHeight: number = 1152;

  playFrameAnimation = (
    object: Phaser.GameObjects.Sprite,
    frameNames: string[]
  ) => {
    object.anims.create({
      key: "frameAnimation",
      frames: frameNames.map((frameName) => ({
        key: object.texture.key,
        frame: frameName,
      })),
      frameRate: 0.2,
      repeat: -1,
    });
    object.anims.play("frameAnimation");
  };

  constructor() {
    super(sceneConfig);
  }

  public override preload() 
  {
    this.load.image('Screen_Final', '144ppi/Screen_Final-0.png');
    this.load.image('Screen_Outro',  '144ppi/Screen_Outro.jpg')
    this.load.audio('Chapter_1_Outro', 'Audio/Chapter_1_Outro.mp3');
    super.preload();
  }

  public override create() 
  {
    super.create();

    //Load Phones
    this.animationSprites.forEach(object => {
      this.playFrameAnimation(object.imageSprite, object.imageSprite.texture.getFrameNames());
      return true;
    });
  }

  onBlinkStatusChanged(status: BlinkingStatus): void {
 
    switch (status) {
      case BlinkingStatus.LeftEye: this.checkInteraction(); break;
			case BlinkingStatus.RightEye: this.checkInteraction(); break;
    }
  }

	private checkInteraction()
	{
		var collidingTouchpoints = this.checkCollideWithTouchPoints();
    if (collidingTouchpoints.length != 0)
    {
      this.defaultUIScene.sfxs.play('Woohoo_1');
    }
    else
    {
      let sfxInt = Math.round(Math.random()*2+1);
      this.defaultUIScene.sfxs.play('Sigh_'+sfxInt);
    }
		collidingTouchpoints.forEach(touchPoint => 
		{
      switch(touchPoint.name)
      {
        case "Touchpoint_1": this.defaultUIScene.foundHiddenObject(0, 0); break;
        case "Touchpoint_2": this.defaultUIScene.foundHiddenObject(0, 1); break;
        case "Touchpoint_3": this.defaultUIScene.foundHiddenObject(0, 2); break;
      }

      const hiddenObjects = Defaults.shared.allHiddenObjects[0];
      if (hiddenObjects[0].isFound && hiddenObjects[1].isFound && hiddenObjects[2].isFound)
      {
        this.replaceScreens();
        this.sound.play('Chapter_1_Outro');
        this.time.addEvent({
          delay:20000, 
          loop: true,
          callback: () =>
          {
            this.defaultUIScene.changeScene(MainMenuScene);
          },
        })
      }
		});
	}

  private replaceScreens()
  {
    this.defaultUIScene.backgroundMusic?.stop();
    this.animationSprites.forEach(object => {
      object.imageSprite.destroy();
      object.imageSprite  = this.add.sprite(0, 0, 'Screen_Final');
      object.imageSprite.setScale(0.7);
			object.imageSprite.setOrigin(0);
			object.imageSprite.x = object.x + this.windowWidth / 2 - this.sceneWidth / 2;
			object.imageSprite.y = object.y + this.windowHeight / 2  - this.sceneHeight / 2;
			object.imageSprite.setMask(this.mask);
    }); 

    let background = this.add.rectangle(0,0,this.windowWidth, this.windowHeight, 0x000000, 0.5);
    background.setOrigin(0);
    background.setScrollFactor(0);
    let finalImage = this.add.image(this.windowWidth/ 2,this.windowHeight/2,'Screen_Outro');
    finalImage.setOrigin(0.5);
    finalImage.setScrollFactor(0);
  }
}