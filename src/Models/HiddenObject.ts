export class HiddenObject
{
	public name: string;
	public description: string;
	public referenceLink: string;
	
	public isFound: boolean = false;

	constructor(name: string, description: string, referenceLink: string)
	{
		this.name = name;
		this.description = description;
		this.referenceLink = referenceLink;
	}
}