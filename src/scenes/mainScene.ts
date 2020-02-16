import { random } from "lodash";
import { GameObjects, Physics, Scene } from "phaser";
import { Sound } from "../utils/keys";

const PlayerCfg = {
    offsetFromClosestVerticalWorldBound: 75,
    scaleX: 0.2,
    scaleY: 1.5,
    textureKey: "block",
    maxVelocity: {
        x: 0,
        y: 300,
    },
};

const BallCfg = {
    scale: 0.3,
    textureKey: "block",
    minInitialSpeed: 200,
    maxInitialSpeed: 300,
    winConditionThresholdPx: 30,
};

const ScoreTextCfg = {
    y: 200,
};

export class MainScene extends Scene {
    private playerLeft: Physics.Arcade.Image;
    private playerRight: Physics.Arcade.Image;
    private ball: Physics.Arcade.Image;
    private score = {
        left: 0,
        right: 0,
    };
    private scoreText: GameObjects.Text;

    constructor() {
        super({
            key: "MainScene",
        });
    }

    public create(): void {
        const width = this.game.scale.width;
        const halfHeight = this.game.scale.height / 2;
        this.playerLeft = this.addPlayer(
            PlayerCfg.offsetFromClosestVerticalWorldBound
        );
        this.playerRight = this.addPlayer(
            width - PlayerCfg.offsetFromClosestVerticalWorldBound
        );

        const movementSpeed = 10;
        this.input.keyboard.on(
            "keydown-W",
            () => (this.playerLeft.y -= movementSpeed)
        );
        this.input.keyboard.on(
            "keydown-S",
            () => (this.playerLeft.y += movementSpeed)
        );
        this.input.keyboard.on(
            "keydown-I",
            () => (this.playerRight.y -= movementSpeed)
        );
        this.input.keyboard.on(
            "keydown-K",
            () => (this.playerRight.y += movementSpeed)
        );

        this.ball = this.physics.add
            .image(width / 2, halfHeight, BallCfg.textureKey)
            .setCollideWorldBounds(true)
            .setBounce(1, 1)
            .setScale(BallCfg.scale)
            .setVelocity(
                random(BallCfg.minInitialSpeed, BallCfg.maxInitialSpeed),
                random(BallCfg.minInitialSpeed, BallCfg.maxInitialSpeed)
            );

        const leftCollider = this.physics.add.collider(
            this.playerLeft,
            this.ball
        );
        const rightCollider = this.physics.add.collider(
            this.playerRight,
            this.ball
        );

        leftCollider.collideCallback = () =>
            this.sound.play(Sound.BallHitsFirstPlayer);
        rightCollider.collideCallback = () =>
            this.sound.play(Sound.BallHitsSecondPlayer);
        this.scoreText = this.add
            .text(width / 2, ScoreTextCfg.y, "")
            .setOrigin(0.5)
            .setFontSize(24);

        const controlsText = this.add
            .text(
                width / 2,
                this.game.scale.height - 50,
                "Controls: Left player W and S. Right player I and J"
            )
            .setOrigin(0.5);
        setTimeout(() => {
            controlsText.destroy();
        }, 10000);
    }

    public update() {
        const width = this.game.scale.width;
        const leftScored =
            this.ball.x >= width - BallCfg.winConditionThresholdPx;
        const rightScored = this.ball.x <= BallCfg.winConditionThresholdPx;
        if (leftScored || rightScored) {
            if (leftScored) {
                this.score.left += 1;
            }
            if (rightScored) {
                this.score.right += 1;
            }
            this.resetBall();
            this.sound.play(Sound.Scored);
        }

        this.scoreText.setText(this.getScoreText());
    }

    private addPlayer(x: number) {
        return this.physics.add
            .image(x, this.game.scale.height / 2, PlayerCfg.textureKey)
            .setCollideWorldBounds()
            .setScale(PlayerCfg.scaleX, PlayerCfg.scaleY)
            .setMaxVelocity(PlayerCfg.maxVelocity.x, PlayerCfg.maxVelocity.y)
            .setImmovable();
    }

    private getScoreText() {
        return `${this.score.left} : ${this.score.right}`;
    }

    private resetBall() {
        this.ball.x = this.game.scale.width / 2;
    }
}
