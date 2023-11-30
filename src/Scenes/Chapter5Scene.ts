const sceneConfig: Phaser.Types.Scenes.SettingsConfig = 
{
	active: false,
	visible: false,
	key: 'Chapter5Scene',
};
  
export class Chapter5Scene extends Phaser.Scene 
{
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

	}
   
	public update() 
	{
	  // TODO
	}
  }