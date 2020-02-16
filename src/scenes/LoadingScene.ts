import { GameObjects, Scene } from "phaser";
import { Color, toHex } from "../styles/Color";
import { setDefaultTextStyle } from "../styles/Text";
import { Sound } from "../utils/keys";
import { MainScene } from "./mainScene";

export class LoadingScene extends Scene {
    private halfWidth!: number;
    private halfHeight!: number;

    constructor() {
        super({
            key: "Loading",
        });
    }

    public preload() {
        this.halfWidth = this.scale.width / 2;
        this.halfHeight = this.scale.height / 2;

        this.preloadAllAssets();
        this.addTitles();
        this.makeLoadingBar();
    }

    private makeLoadingBar() {
        const loadingText = this.make.text({
            x: this.halfWidth,
            y: this.halfHeight - 50,
            text: "Loading...",
            style: {
                font: "30px Arial",
                fill: Color.White,
            },
        });
        loadingText.setOrigin(0.5);

        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(toHex(Color.DarkGrey), 0.8);
        progressBox.fillRect(
            this.halfWidth - 320 / 2,
            this.halfHeight,
            320,
            50
        );

        const assetText = this.make.text({
            x: this.halfWidth,
            y: this.halfHeight + 65,
            text: "",
            style: {
                font: "18px Arial",
                fill: Color.White,
            },
        });
        assetText.setOrigin(0.5);

        this.load.on("progress", this.getProgressBarFiller(progressBar));
        this.load.on("fileprogress", this.getAssetTextWriter(assetText));
        this.load.on("complete", () => {
            this.scene.add("MainScene", MainScene, true);
            this.scene.remove(this);
        });
    }

    private getAssetTextWriter(
        assetText: GameObjects.Text
    ): (file: { key: string }) => void {
        return (file: { key: string }) => {
            assetText.setText(`Loading asset: ${file.key}`);
        };
    }

    private getProgressBarFiller(
        progressBar: GameObjects.Graphics
    ): (count: number) => void {
        return (count: number) => {
            progressBar.clear();
            progressBar.fillStyle(toHex(Color.White));
            progressBar.fillRect(
                this.halfWidth + 10 - 320 / 2,
                this.halfHeight + 10,
                300 * count,
                30
            );
        };
    }

    private preloadAllAssets() {
        this.load.image("block", "./assets/images/1bitblock0.png");
        this.load.audio(
            Sound.BallHitsFirstPlayer,
            "./assets/sounds/4390__noisecollector__pongblipf-4.wav"
        );
        this.load.audio(
            Sound.BallHitsSecondPlayer,
            "./assets/sounds/4391__noisecollector__pongblipf-5.wav"
        );
        this.load.audio(
            Sound.BallHitsWall,
            "./assets/sounds/4389__noisecollector__pongblipf-3.wav"
        );
        this.load.audio(
            Sound.Scored,
            "./assets/sounds/4365__noisecollector__pongblipa5.wav"
        );
    }

    private addTitles() {
        const title = this.add
            .text(this.halfWidth, this.halfHeight - 200, "Pong")
            .setOrigin(0.5);
        setDefaultTextStyle(title);
        title.setFontSize(112);
        title.setColor(Color.White);

        const subtitle = this.add
            .text(this.halfWidth, this.halfHeight - 120, "by Mirco Kraenz")
            .setOrigin(0.5);
        setDefaultTextStyle(subtitle);
        subtitle.setColor(Color.White);
    }
}
