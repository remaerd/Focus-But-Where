export class HiddenObject
{
	public imageName: string;
	public name: string;
	public description: string;
	public referenceLink: string;
	
	public isFound: boolean = false;

	constructor(imageName: string, name: string, description: string, referenceLink: string)
	{
		this.imageName = imageName;
		this.name = name;
		this.description = description;
		this.referenceLink = referenceLink;
	}
}