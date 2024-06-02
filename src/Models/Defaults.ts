import { HiddenObject } from "./HiddenObject";

export class Defaults
{
  public static get shared() : Defaults 
  {
    return this._shared; 
  }
  
  private static _shared = new Defaults();

	faceControlEnabled:boolean = false;

  allHiddenObjects: Array<HiddenObject>[] = [
		// Chapter 1
		[new HiddenObject("Oil","Oil",""),
		new HiddenObject("Flag","Flag",""),
		new HiddenObject("Flower","Flower","")],
		// Chapter 2
		[],
		// Chapter 3
		[new HiddenObject("Goggles","",""),
		new HiddenObject("Wheel","",""),
		new HiddenObject("Fight","",""),
		new HiddenObject("Brain","","")],
		// Chapter 4
		[],
		// Chapter 5
		[],
	];
}