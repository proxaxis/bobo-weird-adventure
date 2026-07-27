import { createRouter, createWebHistory } from 'vue-router';
import GamePlayView from '@/views/GamePlayView.vue';
import ScenarioView from '@/views/ScenarioView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'GamePlay',
      component: GamePlayView,
    },
    {
      path: '/scenario',
      name: 'Scenario',
      component: ScenarioView,
    },
  ],
});

export default router;
