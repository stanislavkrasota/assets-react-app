import { v4 as uuidv4 } from 'uuid';

export class Asset {
    public id: string;
    public url: string;
    public x: number;
    public y: number;
    public width: number;
    public height: number;

    constructor(url: string, x: number = 0, y: number = 0, width: number = 200, height: number = 200) {
        this.id = uuidv4(); // Generate a unique ID using uuid
        this.url = url;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}


