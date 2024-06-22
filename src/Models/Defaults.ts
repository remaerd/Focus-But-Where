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
		[new HiddenObject("Oil","The Oil Barrel","Climate protesters from This is Rigged blocked Scottish Oil plants"),
		new HiddenObject("Flag","The XR Flag","Extinction Rebellion halted disruptive tactics in mass London protest"),
		new HiddenObject("Flower","The Wreath","Climate activist-Wynn Bruce dies after setting himself on fire outside U.S. Supreme Court on Earth Day")],
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