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
  {
    name: 's5',
    title: 'Game Stage 5',
    scene: 'MainGameScene',
    config: {
      enemySpawnCount: 5,
    },
  },
  {
    name: 's6',
    title: 'Game Stage 6',
    scene: 'MainGameScene',
    config: {
      enemySpawnCount: 6,
    },
  },
  {
    name: 's7',
    title: 'Game Stage 7',
    scene: 'MainGameScene',
    config: {
      enemySpawnCount: 7,
    },
  },
  {
    name: 's8',
    title: 'Game Stage 8',
    scene: 'MainGameScene',
    config: {
      enemySpawnCount: 8,
    },
  },
  {
    name: 's9',
    title: 'Game Stage 9',
    scene: 'MainGameScene',
    config: {
      enemySpawnCount: 9,
    },
  },
  {
    name: 's10',
    title: 'Game Stage 10',
    scene: 'MainGameScene',
    config: {
      enemySpawnCount: 10,
    },
  },
]);
