export class HiddenObject
{
    public name: string;
    public icon: string;
    public description: string;
    public chapter: integer;
    
    constructor(name: string, icon: string, description: string, chapter: integer)
    {
        this.name = name;
        this.chapter = chapter;
        this.icon = icon;
        this.description = description;
    }
}