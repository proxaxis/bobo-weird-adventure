import Phaser from 'phaser';
import { defineConfig } from '@/game/config.js';

const config = defineConfig();

export class Player extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y, texture) {
    // MatterJS の Sprite として初期化
    super(scene.matter.world, x, y, texture, null, {
      shape: { type: 'circle', radius: 400 },
      restitution: config.PLAYER_RESTITUTION,
      friction: config.PLAYER_FRICTION,
      frictionAir: config.PLAYER_FRICTION_AIR,
      slop: config.PLAYER_SLOP,
    });

    scene.add.existing(this);
    this.setScale(0.06);
    this.setFixedRotation();
  }

  jump() {
    // 地面にいる時（または特定の高さにいる時）のみジャンプ可能
    const inTheAir = this.y < config.GAME_WINDOW_HEIGHT - 40;
    if (inTheAir) return;
    this.setVelocityY(-config.PLAYER_JUMP_FORCE);
  }

  handleInput(cursors) {
    if (!this.body) return;

    // 横移動の操作
    if (cursors.left.isDown) {
      this.applyForce({ x: -config.PLAYER_MOVE_FORCE_MAGNITUDE, y: 0 });
    } else if (cursors.right.isDown) {
      this.applyForce({ x: config.PLAYER_MOVE_FORCE_MAGNITUDE, y: 0 });
    } else {
      this.setVelocityX(this.body.velocity.x * config.PLAYER_STOP_FORCE_MULTIPLIER);
    }

    // プレイヤーの速度を制限
    if (this.body.speed > config.PLAYER_MAX_SPEED) {
      const scale = config.PLAYER_MAX_SPEED / this.body.speed;
      this.setVelocity(
        this.body.velocity.x * scale,
        this.body.velocity.y * scale
      );
    }
  }
}
