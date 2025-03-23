import { HiddenObject } from "./HiddenObject";

export class Defaults
{
  public static get shared() : Defaults 
  {
    return this._shared; 
  }
  
  private static _shared = new Defaults();

	faceControlEnabled:boolean = false;

	currentChapter:number = 0;

  allHiddenObjects: Array<HiddenObject>[] = [

		// Chapter 1
		[new HiddenObject("Oil","The Oil Barrel",""),
		new HiddenObject("Flag","The XR Flag",""),
		new HiddenObject("Flower","The Wreath","")
	],
		// Chapter 2
		[new HiddenObject("Dust","The Dust Protector",""),
		 new HiddenObject("Soup","The Soup Can",""),
		 new HiddenObject("Suffragetes","The Suffragettes",""),
		], 
		// Chapter 3
		[new HiddenObject("Wheel","The Hamster",""),
		 new HiddenObject("Goggles","The Trapped One",""),
		 new HiddenObject("Fight","The Reactors",""),
		 new HiddenObject("Brain","The Guinea Pig","")],
		// Chapter 4
		[],
		// Chapter 5
		[],
	];
}