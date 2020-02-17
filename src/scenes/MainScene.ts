import { Input, Scene } from "phaser";
import { Ball } from "../components/Ball";
import { KickoffText } from "../components/KickoffText";
import { Player } from "../components/Player";
import { Score } from "../components/Score";
import { State } from "../components/State";
import { Sound } from "../utils/keys";

const PlayerCfg = { offsetFromClosestVerticalWorldBound: 75 };

const BallCfg = {
    winConditionThresholdPx: 30,
};

export class MainScene extends Scene {
    private playerLeft: Player;
    private playerRight: Player;
    private ball: Ball;
    private score: Score;
    private kickoffText: KickoffText;
    private state: State = State.KickoffRight;
    private w: Input.Keyboard.Key;
    private s: Input.Keyboard.Key;
    private i: Input.Keyboard.Key;
    private k: Input.Keyboard.Key;
    private space: Input.Keyboard.Key;

    constructor() {
        super({
            key: "MainScene",
        });
    }

    public create(): void {
        const width = this.game.scale.width;
        this.playerLeft = new Player(
            this,
            PlayerCfg.offsetFromClosestVerticalWorldBound
        );
        this.playerRight = new Player(
            this,
            width - PlayerCfg.offsetFromClosestVerticalWorldBound
        );
        this.ball = new Ball(this);
        this.score = new Score(this);
        this.kickoffText = new KickoffText(this, this.state);

        this.addControls();
        this.setColliders(this.playerLeft, this.playerRight, this.ball);
        this.showControls(width);
    }

    public update() {
        this.handleScoring();
        this.handleMovements();
    }

    private addControls() {
        this.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.i = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);
        this.k = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
        this.space = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );
    }

    private setColliders(playerLeft: Player, playerRight: Player, ball: Ball) {
        const leftCollider = this.physics.add.collider(playerLeft, ball);
        const rightCollider = this.physics.add.collider(playerRight, ball);
        leftCollider.collideCallback = () => {
            this.ball.hit();
            this.sound.play(Sound.BallHitsFirstPlayer);
        };
        rightCollider.collideCallback = () => {
            this.ball.hit();
            this.sound.play(Sound.BallHitsSecondPlayer);
        };
    }

    private showControls(width: number) {
        const controlsText = this.add
            .text(
                width / 2,
                this.game.scale.height - 50,
                "Controls: Left player W and S. Right player I and J. Space for kickoff."
            )
            .setOrigin(0.5);
        setTimeout(() => {
            controlsText.destroy();
        }, 10000);
    }

    private handleScoring() {
        const width = this.game.scale.width;
        const leftScored =
            this.ball.x >= width - BallCfg.winConditionThresholdPx;
        const rightScored = this.ball.x <= BallCfg.winConditionThresholdPx;
        if (leftScored || rightScored) {
            if (leftScored) {
                this.score.rightScored();
                this.state = State.KickoffLeft;
            }
            if (rightScored) {
                this.score.rightScored();
                this.state = State.KickoffRight;
            }
            this.ball.reset();
            this.sound.play(Sound.Scored);
            this.kickoffText.update(this.state);
        }
    }

    private handleMovements() {
        if (this.w.isDown) {
            this.playerLeft.moveUp();
        }
        if (this.s.isDown) {
            this.playerLeft.moveDown();
        }
        if (this.i.isDown) {
            this.playerRight.moveUp();
        }
        if (this.k.isDown) {
            this.playerRight.moveDown();
        }
        if (this.space.isDown) {
            this.handleKickoff();
        }
    }

    private handleKickoff() {
        const play = () => {
            this.state = State.Playing;
            this.kickoffText.update(this.state);
        };
        if (this.state === State.KickoffLeft) {
            this.ball.startLeft();
            play();
        }
        if (this.state === State.KickoffRight) {
            this.ball.startRight();
            play();
        }
    }
}
