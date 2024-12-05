import SceneData from './scene.json';
import { BlinkingStatus, FaceDetectorScene } from "../../FaceDetectorScene";
import { Defaults } from "../../Models/Defaults";
import { Chapter1Scene } from "../Chapter1/Scene";

const name = 'MainMenuScene';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = 
{
	active: false,
	visible: false,
	key: name,
};
  
export class MainMenuScene extends FaceDetectorScene
{
	public static sceneName: string = name;
	public backgroundNusicPath?: string | undefined = 'Audio/BGM_Main_Menu.mp3';
	public interactiveObjectSpritesFileName?: string = 'MainMenu_Objects';

	public sceneId? = 'MainMenu';
	public sceneData? = SceneData;
	
	public title? = undefined;
	public subtitle? = undefined;

	public sceneWidth: number = 2048;
	public sceneHeight: number = 1204;

	constructor() 
	{
	  super(sceneConfig);
	}
   
	public override create() 
	{
		super.create();
		this.cameras.main.setBackgroundColor(0x000000);

		this.interactiveObjects.forEach(object => {
			if (object.name.startsWith("Object_")) object.imageSprite.setVisible(false);
		});
	}

	public update() 
	{
		super.update();
		
		for(let chapterIndex = 0; chapterIndex < Defaults.shared.allHiddenObjects.length; chapterIndex++)
		{
			for (let objectIndex = 0; objectIndex < Defaults.shared.allHiddenObjects[chapterIndex].length; objectIndex++)
			{
				let gameObject = Defaults.shared.allHiddenObjects[chapterIndex][objectIndex];
				let hiddenObjectName = "Object_" + (chapterIndex+1) + '_' + (objectIndex+1);
				let hiddenObject = this.interactiveObjects.find(hObject => hObject.name == hiddenObjectName )
				if (gameObject.isFound) hiddenObject?.imageSprite.setVisible(true);
				else hiddenObject?.imageSprite.setVisible(false);
			}
		}
	}

	onBlinkStatusChanged(status: BlinkingStatus): void {
    switch (status) {
      case BlinkingStatus.LeftEye: this.checkInteraction(); break;
			case BlinkingStatus.RightEye: this.checkInteraction(); break;
    }
  }

	public override checkInteraction()
	{
		console.log("Blink detected");
		var collidingTouchpoints = this.checkCollideWithTouchPoints();
		if (collidingTouchpoints.length == 0)
		{
			let sfxNum = Math.floor(Math.random() * 2+1);
			this.defaultUIScene.sfxs.play('Sigh_'+sfxNum);
		}
		collidingTouchpoints.forEach(touchPoint => 
		{
			console.log(touchPoint.name);
			switch(touchPoint.name)
			{
				case "Play": 
					this.defaultUIScene.sfxs.play('Woohoo_1');
					this.resetAndPlayGame(); 
					break;
				case "Object_1_1":
					if (Defaults.shared.allHiddenObjects[0][0].isFound) window.open('https://kexinliu.net/fbw-flower/', '_blank');
					break;
				case "Object_1_2":
					if (Defaults.shared.allHiddenObjects[0][1].isFound) window.open('https://kexinliu.net/fbw-oil-barrel/', '_blank');
					break;
				case "Object_1_3":
					if (Defaults.shared.allHiddenObjects[0][2].isFound) window.open('https://kexinliu.net/fbw-xr-flag/', '_blank');
					break;
				default:
			}
		});
	}

	private resetAndPlayGame()
	{
		this.defaultUIScene.changeScene(Chapter1Scene);
	}

	// private triggerSound()
	// {
	// 	console.log('Sound');
	// }

	// private triggerMusic()
	// {
	// 	console.log('Music');
	// }

	// private triggerSubtitle()
	// {
	// 	console.log('Subtitle');
	// }

	// private triggerControl()
	// {
	// 	console.log('Control');
	// }

	// private triggerRefresh()
	// {
	// 	console.log('Refresh');
	// }

	// private triggerHiddenObject(index: integer)
	// {
	// 	console.log('Hidden Object');
	// }
}