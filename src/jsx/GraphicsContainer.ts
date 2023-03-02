export class GraphicsContainer extends Phaser.GameObjects.Graphics {
    children: any[] = [];
    add(fn: any) {
        fn.graphics = this;
        this.children.push(fn);
    }

    getAt(index: number) {
        return this.children[index];
    }

    
}
