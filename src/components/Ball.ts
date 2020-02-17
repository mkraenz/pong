import { random } from "lodash";
import { Physics, Scene } from "phaser";

const BallCfg = {
    scale: 0.3,
    textureKey: "block",
    minInitialSpeed: 200,
    maxInitialSpeed: 300,
    SpeedUpFactor: 1.2,
    hitsUntilSpeedUp: 3,
};

export class Ball extends Physics.Arcade.Image {
    private hits = 0; // how often the ball

    constructor(scene: Scene) {
        super(
            scene,
            scene.scale.width / 2,
            scene.scale.height / 2,
            BallCfg.textureKey
        );
        scene.add.existing(this);
        scene.physics.world.enable(this);

        this.setCollideWorldBounds(true)
            .setBounce(1, 1)
            .setScale(BallCfg.scale);
    }

    public hit() {
        this.hits++;
        if (this.hits % BallCfg.hitsUntilSpeedUp === 0) {
            this.increaseSpeed();
        }
    }

    public reset() {
        this.x = this.scene.game.scale.width / 2;
        this.y = this.scene.game.scale.height / 2;
        this.body.stop();
    }

    public startLeft() {
        this.setRandomVelocity(-1);
    }

    public startRight() {
        this.setRandomVelocity(1);
    }

    private increaseSpeed() {
        const velX = this.body.velocity.x * BallCfg.SpeedUpFactor;
        const velY = this.body.velocity.y * BallCfg.SpeedUpFactor;
        this.setVelocity(velX, velY);
    }

    private setRandomVelocity(xSign: 1 | -1) {
        const ySign = random(0, 1) ? 1 : -1;
        this.setVelocity(
            random(BallCfg.minInitialSpeed, BallCfg.maxInitialSpeed) * xSign,
            random(BallCfg.minInitialSpeed, BallCfg.maxInitialSpeed) * ySign
        );
    }
}
