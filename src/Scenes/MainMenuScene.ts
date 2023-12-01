import { BlinkingStatus, FaceDetectorScene } from "../FaceDetectorScene";
import { Detector } from "../FaceLandmarkDetector";
import { Defaults } from "../Models/Defaults";
import { Chapter1Scene } from "./Chapter1Scene";

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
	public title? = undefined;
	public subtitle? = undefined;

	private depth = 1;
	
	public sceneHeight: number = 6274;
	public sceneWidth: number = 10420;

	colour: number = 0xFFFFFF;

	private scaleRate!: number;

	private blackBackground!: Phaser.GameObjects.Rectangle;

	private background! : Phaser.GameObjects.Image

	private allButtonSprites!: Phaser.GameObjects.Group;
	
	private interactionPosition = [
    { x: -500, y: -400 }, // Play Button
    { x: -1680, y: 1210 }, // Music Button
    { x: -980, y: 1650 }, // Sound Button
    { x: 1500, y: 1810 }, // Refresh Button
    { x: 1300, y: 1100 }, // Subtitle Button
    { x: 400, y: 1380 }, // Control Button
    { x: -2800, y: 150 }, // Hidden Object - 1
    { x: -2500, y: -1100 }, // Hidden Object - 2
    { x: -1200, y: -1600 }, // Hidden Object - 3
		{ x: 1500, y: 100 }, // Hidden Object - 4
    { x: 3100, y: -550 }, // Hidden Object - 5
    { x: 1600, y: -1250 }, // Hidden Object - 6
		{ x: 3100, y: -1900 }, // Hidden Object - 7
  ];

	private scope = 250;

	isNear = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.abs(x1 - x2) < this.scope && Math.abs(y1 - y2) < this.scope;
  };

	constructor() 
	{
	  super(sceneConfig);
	}
	
	public preload()
	{
		console.log('Preload')
		
		this.load.image('background', '/Interface/main_menu_edit.png');
    this.load.multiatlas( "icons", "/Interface/main_menu_icons_edit.json", "/Interface/");
	}
   
	public override create() 
	{
		super.create();

		this.background = this.add.sprite(0,0,'background');
		this.background.setScale(0.1);
		this.background.setOrigin(0.5,0.5);
		this.background.setDepth(this.depth);

		this.interactionPosition = this.interactionPosition.map((position) => ({
      x: (this.sceneWidth / 2 + position.x) * this.widthScale,
      y: (this.sceneHeight / 2 + position.y) * this.heightScale,
    }));
    console.log(this.interactionPosition);

		this.allButtonSprites = this.add.group();
		const playButton = this.add.sprite(0,0, 'icons', 'corner_01.png');
		this.allButtonSprites.add(playButton);

		const musicButton = this.add.sprite(0,0, 'icons', 'music_on.png');
		this.allButtonSprites.add(musicButton);

		const soundButton = this.add.sprite(0,0,'icons', 'sound_on.png');
		this.allButtonSprites.add(soundButton);

		const refreshButton = this.add.sprite(0,0,'icons', 'refresh.png');
		this.allButtonSprites.add(refreshButton);

		const subtitleButton = this.add.sprite(0,0,'icons', 'subs_on.png');
		this.allButtonSprites.add(subtitleButton);

		const controlButton = this.add.sprite(0,0,'icons', 'wink.png');
		this.allButtonSprites.add(controlButton);

		for (let i = 0; i < Defaults.shared.allHiddenObjects[0].length; i++)
		{
			const hiddenObjectSprite = this.add.sprite(
				this.interactionPosition[i].x,
				this.interactionPosition[i].y,
				'icons', 
				Defaults.shared.allHiddenObjects[0][i].imageName + '.png');
			this.allButtonSprites.add(hiddenObjectSprite)
		}

		for (let i = 0; i< Defaults.shared.allHiddenObjects[2].length; i++)
		{
			const hiddenObjectSprite = this.add.sprite(
				this.interactionPosition[i].x,
				this.interactionPosition[i].y,
				'icons', 
				Defaults.shared.allHiddenObjects[2][i].imageName + '.png');
			this.allButtonSprites.add(hiddenObjectSprite)
		}

    this.allButtonSprites.children.iterate(
      (sprite: Phaser.GameObjects.GameObject) => {
        if (sprite instanceof Phaser.GameObjects.Sprite) {
          sprite.setScale(this.widthScale, this.heightScale);
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
    this.mask.invertAlpha = false;
    this.blackBackground.setMask(this.mask);
	}

	updatePostionAndScale(translateX: number, translateY: number, scale: number) 
	{
    translateX = translateX - 0.3;
    translateY = translateY - 0.3;

    this.scaleRate = 2 / scale;
		this.background.setPosition(translateX * window.innerWidth * this.scaleRate,translateY * window.innerHeight * this.scaleRate);
		this.background.setScale(this.widthScale * this.scaleRate,this.heightScale * this.scaleRate);

    this.allButtonSprites.children.iterate(
      (sprite: Phaser.GameObjects.GameObject, index) => {
        let nowX =
          (translateX * window.innerWidth +
            this.interactionPosition[index].x -
            this.windowWidth / 2) *
          this.scaleRate;
        let nowY =
          (translateY * window.innerHeight +
            this.interactionPosition[index].y -
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
   
	public update() 
	{
		super.update();
		// this.background.scale = 0.2;

		// this.blackBackground.width = this.windowWidth;
    // this.blackBackground.height = this.windowHeight;

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
 
		console.log(status);
    switch (status) {
      case BlinkingStatus.LeftEye: this.checkInteraction(); break;
			case BlinkingStatus.RightEye: this.checkInteraction(); break;
    }
  }

	private checkInteraction()
	{
		for (let i = 0; i < this.interactionPosition.length; i++)
		{
			if (this.isNear(
				this.interactionPosition[i].x,
				this.interactionPosition[i].y,
				Detector.default!.translateX * window.innerWidth,
				Detector.default!.translateY * window.innerHeight
			))
			{
				switch(i)
				{
					case 0: this.resetAndPlayGame(); break;
					case 1: this.triggerMusic(); break;
					case 2: this.triggerSound(); break;
					case 3: this.triggerRefresh(); break;
					case 4: this.triggerSubtitle(); break;
					case 5: this.triggerControl(); break;
					default: this.triggerHiddenObject(i); break;
				}
			}
		}
	}

	private resetAndPlayGame()
	{
		this.defaultUIScene.changeScene(Chapter1Scene);
	}

	private triggerSound()
	{
		console.log('Sound');
	}

	private triggerMusic()
	{
		console.log('Music');
	}

	private triggerSubtitle()
	{
		console.log('Subtitle');
	}

	private triggerControl()
	{
		console.log('Control');
	}

	private triggerRefresh()
	{
		console.log('Refresh');
	}

	private triggerHiddenObject(index: integer)
	{
		console.log('Hidden Object');
	}
}