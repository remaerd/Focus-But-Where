import SceneData from './scene.json';
import Subtitle from './subtitle.json';

import { FaceDetectorScene } from "../../FaceDetectorScene";
import { Defaults } from "../../Models/Defaults";
import { Chapter2Scene } from '../Chapter2/Scene';

const name = 'Chapter1Scene';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = 
{
  active: false,
  visible: false,
  key: name,
};

export class Chapter1Scene extends FaceDetectorScene 
{
  // Cutscene
  public sceneId = 'Chapter1';
  static cutsceneVideoFileName? = 'Videos/Chapter_1.mp4';
  static cutsceneSectionsTimestamps? = [0,2,6];
  static cutsceneSectionsSubtitles? = Subtitle;

  public sceneData? = SceneData;
  
  public static sceneName: string = name; 
  public backgroundMusicPath?: string | undefined = 'Audio/BGM_Chapter_1.mp3';
  
  public sceneWidth: number = 2048;
  public sceneHeight: number = 1204;

  // playFrameAnimation = (
  //   object: Phaser.GameObjects.Sprite,
  //   frameNames: string[]
  // ) => {
  //   object.anims.create({
  //     key: "frameAnimation",
  //     frames: frameNames.map((frameName) => ({
  //       key: object.texture.key,
  //       frame: frameName,
  //     })),
  //     frameRate: 0.2,
  //     repeat: -1,
  //   });
  //   object.anims.play("frameAnimation");
  // };

  constructor() {
    super(sceneConfig);
  }

  public override preload() 
  {
    // this.load.image('Screen_Final', '144ppi/Screen_Final-0.png');
    // this.load.image('Screen_Outro',  '144ppi/Screen_Outro.jpg')
    // this.load.audio('Chapter_1_Outro', 'Audio/Chapter_1_Outro.mp3');
    super.preload();
  }

  public override create() 
  {
    super.create();

    // //Load Phones
    // this.animationSprites.forEach(object => {
    //   this.playFrameAnimation(object.imageSprite, object.imageSprite.texture.getFrameNames());
    //   return true;
    // });

    Defaults.shared.currentChapter = 1;
  }

	public override checkInteraction(inputX:number, inputY:number)
	{
		var collidingTouchpoints = this.checkCollideWithTouchPoints(inputX, inputY);
    if (collidingTouchpoints.length != 0) this.defaultUIScene.sfxs.play('Woohoo_1');
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
          let isAllFound = true;
          for (let i = 0; i < hiddenObjects.length; i++) 
          {
            if (!hiddenObjects[i].isFound) 
            {
              isAllFound = false;
              break;
            }
          }
          if (isAllFound) this.defaultUIScene.changeScene(Chapter2Scene);
		});
	}
}