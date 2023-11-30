import { IObserver } from "../Scenes/UIScene";

interface IObservable 
{
	// The Subject Interface
	subscribe(observer: IObserver): void
	// The subscribe method
	unsubscribe(observer: IObserver): void
	// The unsubscribe method
	notify(...args: unknown[]): void
  // The notify method
}

export class HiddenObject implements IObservable
{
	static allHiddenObjects: Array<HiddenObject>[] = [
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

	public imageName: string;
	public name: string;
	public description: string;
	public referenceLink: string;
	
	public isFound: boolean = false;

	// The Subject (a.k.a Observable)
	#observers: Set<IObserver>
	
	constructor(imageName: string, name: string, description: string, referenceLink: string)
	{
		this.#observers = new Set()
		this.imageName = imageName;
		this.name = name;
		this.description = description;
		this.referenceLink = referenceLink;
	}

	subscribe(observer: IObserver) 
	{
		this.#observers.add(observer)
	}
	unsubscribe(observer: IObserver) 
	{
		this.#observers.delete(observer)
	}

	notify() {
		this.#observers.forEach((observer) => {
				observer.hiddenObjectIsFound(this);
		})
	}
}