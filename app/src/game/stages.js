import MainGameScene from '@/game/scenes/MainGameScene';
import BossStageBackgroudImage from '@/assets/stage/be8ea5dce682407da0bbc6777b590a9f.png';
import DefaultStageBackgroudImage from '@/assets/stage/5e071ef7a1f61784226878286c969c7a.png';

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
      backgroundImage: DefaultStageBackgroudImage,
    },
  },
  {
    name: 's2',
    title: 'Game Stage 2',
    scene: 'MainGameScene',
    config: {
      enemySpawnCount: 2,
      backgroundImage: DefaultStageBackgroudImage,
    },
  },
  {
    name: 's3',
    title: 'Game Stage 3',
    scene: 'MainGameScene',
    config: {
      enemySpawnCount: 3,
      backgroundImage: DefaultStageBackgroudImage,
    },
  },
  {
    name: 's4',
    title: 'Game Stage 4',
    scene: 'MainGameScene',
    config: {
      enemySpawnCount: 4,
      backgroundImage: DefaultStageBackgroudImage,
    },
  },
  {
    name: 's5',
    title: 'Game Stage 5',
    scene: 'MainGameScene',
    config: {
      enemySpawnCount: 5,
      backgroundImage: DefaultStageBackgroudImage,
    },
  },
  {
    name: 's6',
    title: 'Game Stage 6',
    scene: 'MainGameScene',
    config: {
      enemySpawnCount: 6,
      backgroundImage: DefaultStageBackgroudImage,
    },
  },
  {
    name: 's7',
    title: 'Game Stage 7',
    scene: 'MainGameScene',
    config: {
      enemySpawnCount: 7,
      backgroundImage: DefaultStageBackgroudImage,
    },
  },
  {
    name: 's8',
    title: 'Game Stage 8',
    scene: 'MainGameScene',
    config: {
      enemySpawnCount: 8,
      backgroundImage: DefaultStageBackgroudImage,
    },
  },
  {
    name: 's9',
    title: 'Game Stage 9',
    scene: 'MainGameScene',
    config: {
      enemySpawnCount: 9,
      backgroundImage: DefaultStageBackgroudImage,
    },
  },
  {
    name: 's10',
    title: 'Final Stage',
    scene: 'MainGameScene',
    config: {
      enemySpawnCount: 10,
      backgroundImage: BossStageBackgroudImage,
    },
  },
]);
