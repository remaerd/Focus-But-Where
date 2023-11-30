import { HiddenObject } from "./HiddenObject";

export class Defaults
{
  public static get shared() : Defaults 
  {
    return this._shared; 
  }
  
  private static _shared = new Defaults();

  allHiddenObjects: Array<HiddenObject>[] = [
		// Chapter 1
		[new HiddenObject("oil","","",""),
		new HiddenObject("flag","","",""),
		new HiddenObject("flowers","","","")],
		// Chapter 2
		[],
		// Chapter 3
		[new HiddenObject("goggles","","",""),
		new HiddenObject("wheel","","",""),
		new HiddenObject("fight","","",""),
		new HiddenObject("brain","","","")],
		// Chapter 4
		[],
		// Chapter 5
		[],
	];
}