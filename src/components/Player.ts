import { Physics, Scene } from "phaser";

const PlayerCfg = {
    scaleX: 0.2,
    scaleY: 1.5,
    textureKey: "block",
    maxVelocity: {
        x: 0,
        y: 300,
    },
    movementSpeed: 2,
};

export class Player extends Physics.Arcade.Image {
    constructor(scene: Scene, x: number) {
        super(scene, x, scene.game.scale.height / 2, PlayerCfg.textureKey);
        scene.physics.world.enable(this); // boilerplate for physics objects
        scene.add.existing(this); // boilerplate for game objects

        this.setCollideWorldBounds()
            .setScale(PlayerCfg.scaleX, PlayerCfg.scaleY)
            .setMaxVelocity(PlayerCfg.maxVelocity.x, PlayerCfg.maxVelocity.y)
            .setImmovable();
    }

    public moveUp() {
        this.y -= PlayerCfg.movementSpeed;
    }

    public moveDown() {
        this.y += PlayerCfg.movementSpeed;
    }
}
