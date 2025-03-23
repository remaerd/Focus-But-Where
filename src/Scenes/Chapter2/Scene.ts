import SceneData from './scene.json';
import Subtitle from './subtitle.json';
import { FaceDetectorScene } from "../../FaceDetectorScene";
import { Defaults } from "../../Models/Defaults";
import { Chapter3Scene } from '../Chapter3/Scene';

const name = 'Chapter2Scene';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = 
{
  active: false,
  visible: false,
  key: name,
};

export class Chapter2Scene extends FaceDetectorScene 
{
  // Cutscene
  public sceneId = 'Chapter2';
  static cutsceneVideoFileName? = 'Videos/Chapter_2.mp4';
  static cutsceneSectionsTimestamps? = [0, 2, 10];
  static cutsceneSectionsSubtitles? = Subtitle;

  public sceneData? = SceneData;
  
  public static sceneName: string = name; 
  public backgroundMusicPath?: string | undefined = 'Audio/BGM_Chapter_2.mp3';
  
  public sceneWidth: number = 2438;
  public sceneHeight: number = 1213;

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
    Defaults.shared.currentChapter = 2;
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
        case "Touchpoint_1": this.defaultUIScene.foundHiddenObject(1, 0); break;
        case "Touchpoint_2": this.defaultUIScene.foundHiddenObject(1, 1); break;
        case "Touchpoint_3": this.defaultUIScene.foundHiddenObject(1, 2); break;
      }
		});

    const hiddenObjects = Defaults.shared.allHiddenObjects[1];
    let isAllFound = true;
    for (let i = 0; i < hiddenObjects.length; i++) 
    {
      if (!hiddenObjects[i].isFound) 
      {
        isAllFound = false;
        break;
      }
    }
    if (isAllFound) this.defaultUIScene.changeScene(Chapter3Scene);
	}
}