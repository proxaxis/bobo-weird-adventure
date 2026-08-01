import MainGameScene from '@/game/scenes/MainGameScene';

export const defineSceneModules = () => ({
  scenes: {
    MainGameScene,
  },
  toArray() {
    return Object.values(this.scenes);
  }
});

export const defineStages = () => ([
  {
    name: 's1',
    title: 'Game Stage 1',
    scene: 'MainGameScene',
    config: {
      enemySpawnCount: 1,
    },
  },
  {
    name: 's2',
    title: 'Game Stage 2',
    scene: 'MainGameScene',
    config: {
      enemySpawnCount: 2,
    },
  },
  {
    name: 's3',
    title: 'Game Stage 3',
    scene: 'MainGameScene',
    config: {
      enemySpawnCount: 3,
    },
  },
  {
    name: 's4',
    title: 'Game Stage 4',
    scene: 'MainGameScene',
    config: {
      enemySpawnCount: 4,
    },
  },
]);
