import Phaser from 'phaser';
import { defineConfig } from '@/game/config.js';
import { Player } from '@/game/objects/Player';
import BoboBlackImage from '@/assets/bobo_black.png';
import HageImage from '@/assets/hage.png';
import GateImage from '@/assets/gate.png';
import DoorImage from '@/assets/door.png';
import BackgroundImage from '@/assets/stage/5e071ef7a1f61784226878286c969c7a.png';
import { useGameStore } from '@/stores/game.js';

const config = defineConfig();

export default class MainGameScene extends Phaser.Scene {
  constructor() {
    super('MainGameScene');
    this.cursors = null;
    this.goal = null;
    this.player = null;
    this.enemies = [];
    this.safeZone = null;
    this.config = {};
    this.gameStore = useGameStore();
  }

  init(data) {
    this.config = data || {};
  }

  preload() {
    this.load.image('BoboBlack', BoboBlackImage);
    this.load.image('Hage', HageImage);
    this.load.image('Gate', GateImage);
    this.load.image('Door', DoorImage);
    this.load.image('Background', BackgroundImage);
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();

    // 背景画像の設定
    this.add.image(config.GAME_WINDOW_WIDTH / 2, config.GAME_WINDOW_HEIGHT / 2, 'Background');

    // ゲームフィールドを設定
    this.matter.world.setBounds(0, 0, config.GAME_WINDOW_WIDTH, config.GAME_WINDOW_HEIGHT, 128);
    const { left, right, top, bottom } = this.matter.world.walls;
    left.restitution = config.WALLS_RESTITUTION;
    right.restitution = config.WALLS_RESTITUTION;
    top.restitution = config.WALLS_RESTITUTION;
    bottom.restitution = config.WALLS_RESTITUTION;
    left.friction = config.WALLS_FRICTION;
    right.friction = config.WALLS_FRICTION;
    top.friction = config.WALLS_FRICTION;
    bottom.friction = config.WALLS_FRICTION;

    // 安全地帯の設定
    this.add.image(20, config.GAME_WINDOW_HEIGHT - 46, 'Door').setScale(0.06);
    this.safeZone = this.matter.add.rectangle(0, config.GAME_WINDOW_HEIGHT - 80, 200, 15, { isStatic: true });

    // ゴールの設定
    this.goal = this.matter.add.sprite(config.GOAL_SPAWN_POINT.x, config.GOAL_SPAWN_POINT.y, 'Gate', null, {
      isStatic: true,
      shape: { type: 'rectangle', width: 1000, height: 1300 },
    });
    this.goal.setScale(0.05);

    // プレイヤーの設定
    this.player = new Player(this, config.PLAYER_SPAWN_POINT.x, config.PLAYER_SPAWN_POINT.y, 'BoboBlack');

    // 敵の設定
    this.enemies = [];
    for (let i = 0; i < this.config.enemySpawnCount; i++) {
      const tmp = this.add.ellipse(0, 0, 500, 900).setVisible(false);
      const enemy = this.matter.add.sprite(config.ENEMY_SPAWN_POINT.x, config.ENEMY_SPAWN_POINT.y, 'Hage');
      enemy.setBody(
        {
          type: 'fromVerts',
          verts: tmp.pathData.slice(0, -2).join(' '),
          flagInternal: true,
        },
        {
          restitution: config.ENEMY_RESTITUTION,
          density: config.ENEMY_DENSITY,
          friction: config.ENEMY_FRICTION,
          frictionAir: config.ENEMY_FRICTION_AIR,
          slop: config.ENEMY_SLOP,
        },
      );
      enemy.setScale(0.06);
      // 初期速度と角速度を敵ごとにランダム化
      this.randomizeEnemyInitialMotion(enemy);
      tmp.destroy();
      this.enemies.push(enemy);
    }

    // --- 衝突判定用のヘルパー関数 ---
    const isWallBody = (body) => [left, right, top, bottom].some((wb) => body === wb);
    const isEnemyBody = (body) => this.enemies.some((enemy) => enemy.body === body || body?.gameObject === enemy);
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

    // 衝突イベントのハンドラ（敵）
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

        // プレイヤーと敵が衝突したら失敗
        if (isPlayer && isEnemy) {
          this.scene.pause();
          this.game.events.emit('game-state-changed', this.gameStore.FAILURE);
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
    this.game.events.emit('game-state-changed', this.gameStore.READY);
  }

  update() {
    if (!this.player || !this.cursors) return;

    // プレイヤーの移動処理（Player.js へ委譲）
    this.player.handleInput(this.cursors);

    // 敵の速度と角速度を制限し、画面外に出た場合は再配置する
    this.enemies.forEach((enemy) => {
      if (!enemy.body) return;

      const from = enemy.body.speed;
      if (from < config.ENEMY_MIN_SPEED) this.boostEnemy(enemy);
      if (from > config.ENEMY_MAX_SPEED) {
        const scale = config.ENEMY_MAX_SPEED / from;
        this.matter.body.setVelocity(enemy.body, {
          x: enemy.body.velocity.x * scale,
          y: enemy.body.velocity.y * scale,
        });
      }

      if (Math.abs(enemy.body.angularVelocity) > config.ENEMY_MAX_ANGULAR_VELOCITY) {
        const sign = Math.sign(enemy.body.angularVelocity);
        this.matter.body.setAngularVelocity(enemy.body, config.ENEMY_MAX_ANGULAR_VELOCITY * sign);
      }

      if (enemy.x < -config.GAME_FIELD_BUFFER || enemy.x > config.GAME_WINDOW_WIDTH + config.GAME_FIELD_BUFFER || enemy.y < -config.GAME_FIELD_BUFFER || enemy.y > config.GAME_WINDOW_HEIGHT + config.GAME_FIELD_BUFFER) {
        this.matter.body.setPosition(enemy.body, {
          x: config.ENEMY_SPAWN_POINT.x,
          y: config.ENEMY_SPAWN_POINT.y,
        });
        // 再配置時も初期動作をランダム化
        this.randomizeEnemyInitialMotion(enemy);
      }
    });

    // プレイヤーがゴールに到達したかどうかを判定
    if (this.goal && this.player && this.matter.overlap(this.player, this.goal)) {
      this.scene.pause();
      this.game.events.emit('game-state-changed', this.gameStore.SUCCESS);
    }

    // Vue 側へデバッグ情報を毎フレーム送信
    if (config.ENABLE_DEBUG_MODE) {
      this.game.events.emit('debug-update', {
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
      });
    }
  }

  boostEnemy(enemy) {
    if (!enemy || !enemy.body) return;
    const from = enemy.body.velocity;
    const to = {
      x: Phaser.Math.Clamp(from.x * config.ENEMY_BOOST_SPEED_MULTIPLIER, -90, 90),
      y: Phaser.Math.Clamp(from.y * config.ENEMY_BOOST_SPEED_MULTIPLIER, -110, 110),
    };
    this.matter.body.setVelocity(enemy.body, to);
  }

  // 敵の初期速度／角速度をランダム化して設定するヘルパー
  randomizeEnemyInitialMotion(enemy) {
    if (!enemy || !enemy.body) return;
    const base = config.ENEMY_INITIAL_VELOCITY || { x: 0, y: 0 };
    // 角度を少しばらつかせる（±45度）と速度スケール（0.7〜1.3）
    const angleDeg = Phaser.Math.Between(-45, 45);
    const angle = Phaser.Math.DegToRad(angleDeg);
    const scale = Phaser.Math.FloatBetween(0.7, 1.3);
    const vx = base.x * Math.cos(angle) - base.y * Math.sin(angle);
    const vy = base.x * Math.sin(angle) + base.y * Math.cos(angle);
    this.matter.body.setVelocity(enemy.body, { x: vx * scale, y: vy * scale });

    const baseAng = config.ENEMY_INITIAL_ANGULAR_VELOCITY || 0;
    const angSign = Phaser.Math.Between(0, 1) === 0 ? -1 : 1;
    const ang = baseAng * Phaser.Math.FloatBetween(0.5, 1.5) * angSign;
    this.matter.body.setAngularVelocity(enemy.body, ang);
  }

  // Vue 側から叩く用のメソッド
  jumpPlayer() {
    if (this.player) this.player.jump();
  }
}
