import { GameObjects, Scene } from "phaser";

const Cfg = {
    y: 200,
    textStyle: {},
};

export class Score extends GameObjects.Text {
    private scoreLeft = 0;
    private scoreRight = 0;

    constructor(scene: Scene) {
        super(scene, scene.scale.width / 2, Cfg.y, "", {});
        scene.add.existing(this);
        this.setOrigin(0.5).setFontSize(24);
        this.draw();
    }

    public leftScored() {
        this.scoreLeft++;
        this.draw();
    }

    public rightScored() {
        this.scoreRight++;
        this.draw();
    }

    private draw() {
        const text = `${this.scoreLeft} : ${this.scoreRight}`;
        this.setText(text);
    }
}
