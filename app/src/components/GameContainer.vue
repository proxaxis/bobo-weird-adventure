<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import Phaser from 'phaser';
import PlayerImage from '@/assets/bobo_black.png';
import BeardImage from '@/assets/beard.png';
import HageImage from '@/assets/hage.png';
import DogImage from '@/assets/dog.png';

const rfGameContainer = ref(null);
const isGameOver = ref(false);
const isGameStarted = ref(false);
let gameInstance = null;
let gameSceneInstance = null;
let handleStartKeydown = null;

class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.player = null;
    this.cursors = null;
    this.enemies = [];
    this.hasJustStarted = false;
  }

  preload() {
    this.load.image('player', PlayerImage);
    this.load.image('beard', BeardImage);
    this.load.image('hage', HageImage);
    this.load.image('dog', DogImage);
  }

  create() {
    // 入力キーの取得
    this.cursors = this.input.keyboard.createCursorKeys();

    gameSceneInstance = this;

    this.scene.pause(); // ゲームを一時停止

    // this.scale.startFullscreen();

    // 1. 画面の四方に衝突用の壁を設定
    this.matter.world.setBounds(0, 0, 960, 640, 32, true, true, true, true);

    // 壁の跳ね返り設定
    // 左右と天井は 1.0、床（bottom）だけ 0 に設定してプレイヤーの跳ね返りを防ぐ
    this.matter.world.walls.left.restitution = 1.0;
    this.matter.world.walls.right.restitution = 1.0;
    this.matter.world.walls.top.restitution = 1.0;
    this.matter.world.walls.bottom.restitution = 0; // ★ 床の反発を0にする

    // 2. プレイヤーの生成（restitution: 0）
    this.player = this.matter.add.sprite(100, 300, 'player', null, {
      shape: {
        type: 'circle',
        radius: 400,
      },
      restitution: 0, // プレイヤーも反発0
      friction: 0.1, // 床の上で滑りすぎないように微調整
      slop: 0,
    });
    this.player.setScale(0.06);
    this.player.setFixedRotation();

    // 3. 敵（hage）の生成
    for (let i = 0; i < 3; i++) {
      const enemy = this.matter.add.sprite(600 + i * 100, 300, 'hage', null, {
        shape: { type: 'circle', radius: 400 },
        restitution: 1.2, // ★ 敵自体が反発1.0を持っているため、床が0でも敵だけは跳ね返ります
        frictionAir: 0,
      });
      enemy.setScale(0.04);
      this.enemies.push(enemy);
    }

    // 4. 敵の初期速度・回転速度を設定
    for (let i = 0; i < this.enemies.length; i++) {
      const enemy = this.enemies[i];
      enemy.setVelocity(Phaser.Math.Between(-10, 10), Phaser.Math.Between(-10, -5));
      enemy.setAngularVelocity(0.02);
    }

    // 5. 衝突イベントリスナー（※ 速度の反転処理は競合を防ぐため整理）
    this.matter.world.on('collisionstart', (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;

        // 敵同士がぶつかった時だけ少しだけ勢いを補強したい場合
        this.enemies.forEach((enemy) => {
          if ((bodyA === enemy.body || bodyB === enemy.body) && bodyA !== this.player.body && bodyB !== this.player.body) {
            // 敵の速度増幅が必要な場合のみここに処理を記述
          }
        });

        // プレイヤーと敵がぶつかった場合の処理
        if ((bodyA === this.player.body && this.enemies.some((e) => e.body === bodyB)) || (bodyB === this.player.body && this.enemies.some((e) => e.body === bodyA))) {
          isGameOver.value = true;
          this.scene.pause(); // ゲームを一時停止
        }
      });
    });
  }

  update() {
    if (!this.player || !this.cursors) return;
    if (!isGameStarted.value) return;

    if (this.hasJustStarted) {
      this.hasJustStarted = false;
      return;
    }

    const speed = 5;
    const jumpPower = -12;
    const MAX_SPEED = 30;
    const MAX_ANGULAR_VELOCITY = 0.1;

    // プレイヤーの速度上限制限
    const playerBody = this.player.body;
    if (playerBody.speed > MAX_SPEED) {
      const scale = MAX_SPEED / playerBody.speed;
      this.matter.body.setVelocity(playerBody, {
        x: playerBody.velocity.x * scale,
        y: playerBody.velocity.y * scale,
      });
    }

    // 敵の速度上限制限
    this.enemies.forEach((enemy) => {
      if (!enemy.body) return;

      const currentSpeed = enemy.body.speed;
      if (currentSpeed > MAX_SPEED) {
        const scale = MAX_SPEED / currentSpeed;
        this.matter.body.setVelocity(enemy.body, {
          x: enemy.body.velocity.x * scale,
          y: enemy.body.velocity.y * scale,
        });
      }

      if (Math.abs(enemy.body.angularVelocity) > MAX_ANGULAR_VELOCITY) {
        const sign = Math.sign(enemy.body.angularVelocity);
        this.matter.body.setAngularVelocity(enemy.body, MAX_ANGULAR_VELOCITY * sign);
      }
    });

    // 1. 横移動操作
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
    } else {
      this.player.setVelocityX(this.player.body.velocity.x * 0.9);
    }

    // 2. 接地判定 & ジャンプ
    // プレイヤーのY速度がほぼ0かつ画面底付近にいる場合のみジャンプ可能に
    const isGrounded = this.player.y >= 640 - this.player.displayHeight / 2 - 5 && Math.abs(playerBody.velocity.y) < 0.5;

    if (this.cursors.space.isDown && isGrounded) {
      this.player.setVelocityY(jumpPower);
    }
  }
}

const createGameInstance = () => {
  const config = {
    type: Phaser.AUTO,
    width: 960,
    height: 640,
    parent: rfGameContainer.value,
    backgroundColor: '#666666',
    physics: {
      default: 'matter',
      matter: {
        gravity: { y: 1 },
        debug: true,
      },
    },
    scene: GameScene,
  };

  gameInstance = new Phaser.Game(config);
};

const resetGame = () => {
  isGameOver.value = false;
  isGameStarted.value = false;
  gameSceneInstance = null;

  if (gameInstance) {
    gameInstance.destroy(true);
    gameInstance = null;
  }

  createGameInstance();
};

onMounted(() => {
  handleStartKeydown = (event) => {
    if (event.code === 'Space' && !isGameStarted.value && !isGameOver.value) {
      event.preventDefault();
      isGameStarted.value = true;

      if (gameSceneInstance) {
        gameSceneInstance.hasJustStarted = true;
        gameSceneInstance.scene.resume();
      }
      return;
    }

    if (event.code === 'KeyR' && isGameOver.value) {
      event.preventDefault();
      resetGame();
    }
  };

  window.addEventListener('keydown', handleStartKeydown);
  createGameInstance();
});

onBeforeUnmount(() => {
  if (handleStartKeydown) {
    window.removeEventListener('keydown', handleStartKeydown);
    handleStartKeydown = null;
  }

  gameSceneInstance = null;

  if (gameInstance) {
    gameInstance.destroy(true);
  }
});
</script>

<template>
  <div class="game-wrapper">
    <img src="/bg-sky.jpg" alt="Background" class="background-image" />
    <div class="game-container">
      <div ref="rfGameContainer" class="game-canvas" :class="{ isGameOver: isGameOver }"></div>
      <div v-if="!isGameStarted" class="start-overlay">
        <div class="start-message">Press SPACE to start</div>
      </div>
      <div v-if="isGameOver" class="game-over">
        <img src="/game-is-over.png" alt="Game Over" width="40%" height="auto" />
        <button class="reset-button" type="button" @click="resetGame">Press R to restart</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-wrapper {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.background-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
}

.game-canvas.isGameOver {
  filter: blur(5px);
  pointer-events: none;
}

.game-over {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 80%;
    max-height: 80%;
  }
}

.reset-button {
  position: absolute;
  left: 50%;
  bottom: 12%;
  transform: translateX(-50%);
  padding: 14px 22px;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 999px;
  background-color: rgba(0, 0, 0, 0.55);
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  cursor: pointer;
}

.reset-button:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.start-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.25);
  pointer-events: none;
}

.start-message {
  padding: 16px 24px;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 999px;
  background-color: rgba(0, 0, 0, 0.4);
  color: #fff;
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}
</style>
