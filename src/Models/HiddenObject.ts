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
	public chapterIndex: integer;
	public objectIndex: integer;

	public name: string;
	public description: string;
	
	public isFound: boolean = false;

	// The Subject (a.k.a Observable)
	#observers: Set<IObserver>
	
	constructor(chapter: integer, index: integer, name: string, description: string)
	{
		this.#observers = new Set()
		this.name = name;
		this.chapterIndex = chapter;
		this.objectIndex = index;
		this.description = description;
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
				observer.notify();
		})
	}
}