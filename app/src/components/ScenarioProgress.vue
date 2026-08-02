<script setup>
import { defineScenario } from '@/game/scenario.js';
import { useScenarioStore } from '@/stores/scenario.js';

const scenarioStore = useScenarioStore();
const scenario = defineScenario();
</script>

<template>
  <div class="scenario-progress">
    <h2>Scenario Progress</h2>
    <ul>
      <li v-for="(s) in scenario" :key="s.id">
        <div v-if="scenarioStore.checkedScenarioIds.has(s.id)">
          <span>{{ s.title }}</span>
        </div>
        <div v-else>
          <span>???</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.scenario-progress {
  height: var(--game-window-height);
  width: 80%;
  background-color: var(--bg-2);
  padding: 0.5rem 1rem;

  h2 {
    text-align: center;
    padding: 0.5rem 0;
    margin-bottom: 1rem;
    border-bottom: 1px solid var(--text-white);
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    li {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--bg-1);
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;

      span {
        font-size: 1.2rem;
      }
    }
  }
}
</style>
