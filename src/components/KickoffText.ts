import { GameObjects, Scene } from "phaser";
import { State } from "./State";

const Cfg = {
    textStyle: {},
    centerOffset: 100,
    fontSize: 30,
};

export class KickoffText extends GameObjects.Text {
    constructor(scene: Scene, state: State) {
        super(
            scene,
            scene.scale.width / 2,
            scene.scale.height / 2,
            "",
            Cfg.textStyle
        );
        scene.add.existing(this);
        this.setFontSize(Cfg.fontSize).setOrigin(0.5);
        this.update(state);
    }

    public update(state: State) {
        if (state === State.KickoffLeft) {
            this.toLeft();
        }
        if (state === State.KickoffRight) {
            this.toRight();
        }
        if (state === State.Playing) {
            this.hide();
        }
    }

    private toLeft() {
        this.x = this.scene.scale.width / 2 - Cfg.centerOffset;
        this.setText("⟵");
    }

    private toRight() {
        this.x = this.scene.scale.width / 2 + Cfg.centerOffset;
        this.setText("⟶");
    }

    private hide() {
        this.setText("");
    }
}
