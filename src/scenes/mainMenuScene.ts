const sceneConfig: Phaser.Types.Scenes.SettingsConfig = 
{
	active: false,
	visible: false,
	key: 'MainMenu',
};
  
export class MainMenuScene extends Phaser.Scene 
{
	private square: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };
   
	constructor() 
	{
	  super(sceneConfig);
	}
	
	public preload()
	{
		console.log('Preload')
	}
   
	public create() 
	{
	  this.square = this.add.rectangle(400, 400, 100, 100, 0xFFFFFF) as any;
	  this.physics.add.existing(this.square);
	}
   
	public update() 
	{
	  // TODO
	}
  }