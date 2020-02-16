import { random } from "lodash";
import { GameObjects, Input, Physics, Scene } from "phaser";
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
    movementSpeed: 2,
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
    private w: Input.Keyboard.Key;
    private s: Input.Keyboard.Key;
    private i: Input.Keyboard.Key;
    private k: Input.Keyboard.Key;

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

        this.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.i = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);
        this.k = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);

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

        this.handleMovements();
    }

    private handleMovements() {
        if (this.w.isDown) {
            this.playerLeft.y -= PlayerCfg.movementSpeed;
        }
        if (this.s.isDown) {
            this.playerLeft.y += PlayerCfg.movementSpeed;
        }
        if (this.i.isDown) {
            this.playerRight.y -= PlayerCfg.movementSpeed;
        }
        if (this.k.isDown) {
            this.playerRight.y += PlayerCfg.movementSpeed;
        }
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
