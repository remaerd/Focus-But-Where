import SceneData from './scene.json';
import Subtitle from './subtitle.json';

import { FaceDetectorScene } from "../../FaceDetectorScene";
import { Defaults } from "../../Models/Defaults";
import { Chapter4Scene } from '../Chapter4/Scene';

const name = 'Chapter3Scene';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = 
{
  active: false,
  visible: false,
  key: name,
};

export class Chapter3Scene extends FaceDetectorScene 
{
  // Cutscene
  public sceneId = 'Chapter3';
  static cutsceneVideoFileName? = 'Videos/Chapter_3.mp4';
  static cutsceneSectionsTimestamps? = [0, 2, 10];
  static cutsceneSectionsSubtitles? = Subtitle;

  public sceneData? = SceneData;
  
  public static sceneName: string = name; 
  public backgroundMusicPath?: string | undefined = 'Audio/BGM_Chapter_3.mp3';
  
  public sceneWidth: number = 1920;
  public sceneHeight: number = 1080;

  constructor() {
    super(sceneConfig);
  }

  public override preload() 
  {
    super.preload();
  }

  public override create() 
  {
    super.create();
    Defaults.shared.currentChapter = 3;
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
        case "Touchpoint_1": this.defaultUIScene.foundHiddenObject(2, 0); break;
        case "Touchpoint_2": this.defaultUIScene.foundHiddenObject(2, 1); break;
        case "Touchpoint_3": this.defaultUIScene.foundHiddenObject(2, 2); break;
        case "Touchpoint_4": this.defaultUIScene.foundHiddenObject(2, 3); break;
      }
		});

    const hiddenObjects = Defaults.shared.allHiddenObjects[2];
    let isAllFound = true;
    for (let i = 0; i < hiddenObjects.length; i++) 
    {
      if (!hiddenObjects[i].isFound) 
      {
        isAllFound = false;
        break;
      }
    }
    if (isAllFound) 
    {
      this.time.delayedCall(1100, () => {
        this.defaultUIScene.changeScene(Chapter4Scene);
      });
    }
	}
}