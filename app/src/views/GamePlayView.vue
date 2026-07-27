<script setup>
import { onMounted, onBeforeUnmount, ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import Phaser from 'phaser';
import { CONFIGS } from '@/lib/constants.js';
import BoboBlackImage from '@/assets/bobo_black.png';
import HageImage from '@/assets/hage.png';
import GateImage from '@/assets/gate.png';
import DoorImage from '@/assets/door.png';

const router = useRouter();

// 各種設定
const CONSTS = CONFIGS;

// ゲームの状態管理
const rfGameContainer = ref(null);
const vmGameState = ref('loading'); // 'loading' -> 'ready' -> 'playing' -> 'failed' or 'success'
const debugInfo = ref({});

let gameInstance = null;
let gameSceneInstance = null;
let handleStartKeydown = null;

const GAME_WINDOW_WIDTH = CONSTS.GAME_WINDOW_WIDTH + 'px';
const GAME_WINDOW_HEIGHT = CONSTS.GAME_WINDOW_HEIGHT + 'px';
const isGameLoading = computed(() => vmGameState.value === 'loading');
const isGameReady = computed(() => vmGameState.value === 'ready');
const isGamePlaying = computed(() => vmGameState.value === 'playing');
const isGameFailed = computed(() => vmGameState.value === 'failed');
const isGameSuccess = computed(() => vmGameState.value === 'success');
const isGameEnded = computed(() => isGameFailed.value || isGameSuccess.value);

// PhaserJS のゲームシーン
class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.cursors = null;
    this.goal = null;
    this.player = null;
    this.enemies = [];
    this.safeZone = null;
  }

  preload() {
    this.load.image('BoboBlack', BoboBlackImage);
    this.load.image('Hage', HageImage);
    this.load.image('Gate', GateImage);
    this.load.image('Door', DoorImage);
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();
    gameSceneInstance = this;

    // ゲームフィールドを設定
    this.matter.world.setBounds(0, 0, CONSTS.GAME_WINDOW_WIDTH, CONSTS.GAME_WINDOW_HEIGHT, 128);
    const { left, right, top, bottom } = this.matter.world.walls;
    left.restitution = CONSTS.WALLS_RESTITUTION;
    right.restitution = CONSTS.WALLS_RESTITUTION;
    top.restitution = CONSTS.WALLS_RESTITUTION;
    bottom.restitution = CONSTS.WALLS_RESTITUTION;
    left.friction = CONSTS.WALLS_FRICTION;
    right.friction = CONSTS.WALLS_FRICTION;
    top.friction = CONSTS.WALLS_FRICTION;
    bottom.friction = CONSTS.WALLS_FRICTION;

    // 安全地帯の設定
    this.add.image(20, CONSTS.GAME_WINDOW_HEIGHT - 46, 'Door').setScale(0.06);
    this.safeZone = this.matter.add.rectangle(0, CONSTS.GAME_WINDOW_HEIGHT - 80, 200, 15, { isStatic: true });

    // ゴールの設定
    this.goal = this.matter.add.sprite(CONSTS.GOAL_SPAWN_POINT.x, CONSTS.GOAL_SPAWN_POINT.y, 'Gate', null, {
      isStatic: true,
      shape: { type: 'rectangle', width: 1000, height: 1300 },
    });
    this.goal.setScale(0.05);

    // プレイヤーの設定
    this.player = this.matter.add.sprite(CONSTS.PLAYER_SPAWN_POINT.x, CONSTS.PLAYER_SPAWN_POINT.y, 'BoboBlack', null, {
      shape: { type: 'circle', radius: 400 },
      restitution: CONSTS.PLAYER_RESTITUTION,
      friction: CONSTS.PLAYER_FRICTION,
      frictionAir: CONSTS.PLAYER_FRICTION_AIR,
      slop: CONSTS.PLAYER_SLOP,
    });
    this.player.setScale(0.06);
    this.player.setFixedRotation();

    // 敵の設定
    for (let i = 0; i < CONSTS.ENEMY_SPAWN_COUNT; i++) {
      const tmp = this.add.ellipse(0, 0, 500, 900).setVisible(false);
      const enemy = this.matter.add.sprite(CONSTS.ENEMY_SPAWN_POINT.x, CONSTS.ENEMY_SPAWN_POINT.y, 'Hage');
      enemy.setBody(
        {
          type: 'fromVerts',
          verts: tmp.pathData.slice(0, -2).join(' '),
          flagInternal: true,
        },
        {
          restitution: CONSTS.ENEMY_RESTITUTION,
          density: CONSTS.ENEMY_DENSITY,
          friction: CONSTS.ENEMY_FRICTION,
          frictionAir: CONSTS.ENEMY_FRICTION_AIR,
          slop: CONSTS.ENEMY_SLOP,
        },
      );
      enemy.setScale(0.06);

      // 初期動作を設定
      enemy.setVelocity(CONSTS.ENEMY_INITIAL_VELOCITY.x, CONSTS.ENEMY_INITIAL_VELOCITY.y);
      enemy.setAngularVelocity(CONSTS.ENEMY_INITIAL_ANGULAR_VELOCITY);

      tmp.destroy();
      this.enemies.push(enemy);
    }

    // 衝突イベントの設定

    // 壁との衝突かどうかを判定する関数
    const isWallBody = (body) => [left, right, top, bottom].some((wb) => body === wb);

    // 敵のボディかどうかを判定する関数
    const isEnemyBody = (body) => this.enemies.some((enemy) => enemy.body === body || body?.gameObject === enemy);

    // プレイヤーのボディかどうかを判定する関数
    const isPlayerBody = (body) => body === this.player.body || body?.gameObject === this.player;

    // プレイヤーと床の衝突だけ反発を無効化
    const handlePlayerBottomContact = (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        const isPlayerBottomPair = (isPlayerBody(bodyA) && bodyB === bottom) || (isPlayerBody(bodyB) && bodyA === bottom);
        if (!isPlayerBottomPair) return;

        pair.restitution = 0;
        if (this.player?.body?.velocity.y > 0) {
          this.matter.body.setVelocity(this.player.body, {
            x: this.player.body.velocity.x,
            y: 0,
          });
        }
      });
    };

    // 衝突イベントのハンドラ
    const handleEnemyContacts = (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        const enemyA = isEnemyBody(bodyA) ? this.enemies.find((enemy) => enemy.body === bodyA || bodyA.gameObject === enemy) : null;
        const enemyB = isEnemyBody(bodyB) ? this.enemies.find((enemy) => enemy.body === bodyB || bodyB.gameObject === enemy) : null;
        const isWallContact = isWallBody(bodyA) || isWallBody(bodyB);
        if (enemyA && isWallContact) this.boostEnemy(enemyA);
        if (enemyB && isWallContact) this.boostEnemy(enemyB);
        if (enemyA && enemyB) {
          this.boostEnemy(enemyA);
          this.boostEnemy(enemyB);
        }
      });
    };

    // 衝突イベントのリスナーを設定
    this.matter.world.on('collisionstart', (event) => {
      handlePlayerBottomContact(event);
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        const isPlayer = isPlayerBody(bodyA) || isPlayerBody(bodyB);
        const isEnemy = isEnemyBody(bodyA) || isEnemyBody(bodyB);
        if (isPlayer && isEnemy) {
          vmGameState.value = 'failed';
          this.scene.pause();
        }
      });
      handleEnemyContacts(event);
    });

    this.matter.world.on('collisionactive', (event) => {
      handlePlayerBottomContact(event);
      handleEnemyContacts(event);
    });

    // ゲームが開始されるまでポーズする
    this.scene.pause();
  }

  update() {
    if (!this.player || !this.cursors) return;
    if (vmGameState.value !== 'playing') return;

    const body = this.player.body;

    // プレイヤーの速度を制限
    if (body.speed > CONSTS.PLAYER_MAX_SPEED) {
      const scale = CONSTS.PLAYER_MAX_SPEED / body.speed;
      this.matter.body.setVelocity(body, {
        x: body.velocity.x * scale,
        y: body.velocity.y * scale,
      });
    }

    // 敵の速度と角速度を制限し、画面外に出た場合は再配置する
    this.enemies.forEach((enemy) => {
      if (!enemy.body) return;

      // 敵の速度を制限
      const from = enemy.body.speed;
      if (from < CONSTS.ENEMY_MIN_SPEED) this.boostEnemy(enemy);
      if (from > CONSTS.ENEMY_MAX_SPEED) {
        const scale = CONSTS.ENEMY_MAX_SPEED / from;
        this.matter.body.setVelocity(enemy.body, {
          x: enemy.body.velocity.x * scale,
          y: enemy.body.velocity.y * scale,
        });
      }

      // 敵の角速度を制限
      if (Math.abs(enemy.body.angularVelocity) > CONSTS.ENEMY_MAX_ANGULAR_VELOCITY) {
        const sign = Math.sign(enemy.body.angularVelocity);
        this.matter.body.setAngularVelocity(enemy.body, CONSTS.ENEMY_MAX_ANGULAR_VELOCITY * sign);
      }

      // 敵が画面外に出た場合は再配置する
      if (enemy.x < -CONSTS.GAME_FIELD_BUFFER || enemy.x > CONSTS.GAME_WINDOW_WIDTH + CONSTS.GAME_FIELD_BUFFER || enemy.y < -CONSTS.GAME_FIELD_BUFFER || enemy.y > CONSTS.GAME_WINDOW_HEIGHT + CONSTS.GAME_FIELD_BUFFER) {
        this.matter.body.setPosition(enemy.body, {
          x: CONSTS.ENEMY_SPAWN_POINT.x,
          y: CONSTS.ENEMY_SPAWN_POINT.y,
        });
        enemy.setVelocity(CONSTS.ENEMY_INITIAL_VELOCITY.x, CONSTS.ENEMY_INITIAL_VELOCITY.y);
      }
    });

    // プレイヤーがゴールに到達したかどうかを判定
    if (this.goal && this.player && this.matter.overlap(this.player, this.goal)) {
      vmGameState.value = 'success';
      this.scene.pause();
    }

    // プレイヤーの横移動の操作
    if (this.cursors.left.isDown) {
      this.matter.body.applyForce(this.player.body, this.player.body.position, { x: -CONSTS.PLAYER_MOVE_FORCE_MAGNITUDE, y: 0 });
    } else if (this.cursors.right.isDown) {
      this.matter.body.applyForce(this.player.body, this.player.body.position, { x: CONSTS.PLAYER_MOVE_FORCE_MAGNITUDE, y: 0 });
    } else {
      this.matter.body.setVelocity(this.player.body, {
        x: this.player.body.velocity.x * CONSTS.PLAYER_STOP_FORCE_MULTIPLIER,
        y: this.player.body.velocity.y,
      });
    }

    debugInfo.value = {
      player: {
        x: this.player.x.toFixed(2),
        y: this.player.y.toFixed(2),
        vx: this.player.body.velocity.x.toFixed(2),
        vy: this.player.body.velocity.y.toFixed(2),
        speed: this.player.body.speed.toFixed(2),
      },
      enemies: this.enemies.map((enemy, index) => ({
        index,
        x: enemy.x.toFixed(2),
        y: enemy.y.toFixed(2),
        vx: enemy.body.velocity.x.toFixed(2),
        vy: enemy.body.velocity.y.toFixed(2),
        speed: enemy.body.speed.toFixed(2),
        angularVelocity: enemy.body.angularVelocity.toFixed(2),
      })),
      state: vmGameState.value,
    };
  }

  // 敵の速度をブーストする関数
  boostEnemy(enemy) {
    if (!enemy || !enemy.body) return;
    const from = enemy.body.velocity;
    const to = {
      x: Phaser.Math.Clamp(from.x * CONSTS.ENEMY_BOOST_SPEED_MULTIPLIER, -90, 90),
      y: Phaser.Math.Clamp(from.y * CONSTS.ENEMY_BOOST_SPEED_MULTIPLIER, -110, 110),
    };
    this.matter.body.setVelocity(enemy.body, to);
  }

  // プレイヤーをジャンプさせる関数
  jump() {
    if (!this.player || !this.player.body) return;
    const inTheAir = this.player.y < CONSTS.GAME_WINDOW_HEIGHT - 40;
    if (inTheAir) return;
    this.player.setVelocityY(-CONSTS.PLAYER_JUMP_FORCE);
  }
}

function createGameInstance() {
  gameInstance = new Phaser.Game({
    type: Phaser.AUTO,
    width: CONSTS.GAME_WINDOW_WIDTH,
    height: CONSTS.GAME_WINDOW_HEIGHT,
    parent: rfGameContainer.value,
    backgroundColor: CONSTS.GAME_WINDOW_BG_COLOR,
    physics: {
      default: 'matter',
      matter: {
        gravity: { y: 1 },
        positionIterations: 10,
        velocityIterations: 10,
        constraintIterations: 4,
        debug: CONSTS.ENABLE_DEBUG_MODE,
      },
    },
    scene: GameScene,
  });
  vmGameState.value = 'ready';
}

function resetGame() {
  vmGameState.value = 'loading';
  gameSceneInstance = null;
  if (gameInstance) {
    gameInstance.destroy(true);
    gameInstance = null;
  }
  createGameInstance();
}

watch(() => isGameEnded.value, (to) => {
  if (to) {
    router.push({ name: 'Scenario' });
  }
});

onMounted(() => {
  handleStartKeydown = (event) => {
    if (event.repeat) return;
    if (event.code === 'Space' && !isGameEnded.value) {
      event.preventDefault();
      if (vmGameState.value === 'ready' && gameSceneInstance) {
        gameSceneInstance.scene.resume();
        vmGameState.value = 'playing';
        return;
      }
      if (vmGameState.value === 'playing' && gameSceneInstance) {
        gameSceneInstance.jump();
      }
      return;
    }
    if (event.code === 'KeyR' && isGameEnded.value) {
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
  <div class="game-container">
    <div class="overlay" v-if="!isGamePlaying">
      <div v-if="isGameLoading" data-state="loading">
        <p>Loading...</p>
      </div>

      <div v-if="isGameReady" data-state="ready">
        <p>Press SPACE to start</p>
      </div>

      <div v-if="isGameFailed" data-state="failed">
        <button type="button" @click="resetGame">Press R to restart</button>
      </div>

      <div v-if="isGameSuccess" data-state="success">
        <button type="button" @click="resetGame">Press R to restart</button>
      </div>
    </div>

    <pre v-if="CONSTS.ENABLE_DEBUG_MODE">{{ debugInfo }}</pre>

    <div ref="rfGameContainer" class="canvas-wrapper"></div>

    <input type="text" v-if="CONSTS.ENABLE_DEBUG_MODE" v-model="vmGameState" />
  </div>
</template>

<style lang="scss" scoped>
.game-container {
  width: 100%;
  height: 100vh;
  background-image: url('/bg-sky.jpg');
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}

// オーバーレイ
.overlay {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.25);
  pointer-events: none;
  z-index: 1;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  p {
    font-size: 2rem;
  }

  div {
    width: v-bind(GAME_WINDOW_WIDTH);
    height: v-bind(GAME_WINDOW_HEIGHT);
    position: relative;
    pointer-events: auto;
    backdrop-filter: blur(5px);

    &[data-state='loading'], &[data-state='ready'] {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &[data-state='failed'] {
      background-image: url('/game-is-over.png');
      background-size: cover;
    }

    &[data-state='success'] {
      background-image: url('/game-is-success.png');
      background-size: cover;
    }

    button {
      width: 20rem;
      height: 4rem;
      border: 2px solid rgba(255, 255, 255, 0.8);
      border-radius: 10rem;
      background-color: rgba(0, 0, 0, 0.55);
      color: var(--text-white);
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      position: absolute;
      transform: translate(-50%, -50%);
      left: 50%;
      right: 50%;
      bottom: 0;

      &:hover {
        background-color: rgba(255, 255, 255, 0.15);
      }
    }
  }
}

// ゲームキャンバス
.canvas-wrapper {
  width: v-bind(GAME_WINDOW_WIDTH);
  height: v-bind(GAME_WINDOW_HEIGHT);
  pointer-events: none;
}

// デバッグ情報
pre {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  max-height: 50%;
  overflow-y: auto;
  background-color: rgba(0, 0, 0, 0.5);
  color: var(--text-white);
  font-size: 12px;
  padding: 8px;
  z-index: 2;
}

// デバッグ用のゲーム状態入力欄
input[type='text'] {
  position: fixed;
  z-index: 2;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2rem;
  background-color: rgba(0, 0, 0, 0.5);
  color: var(--text-white);
  font-size: 12px;
  padding: 4px;
}
</style>
