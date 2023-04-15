<script setup lang="ts">
import { Octokit } from "@octokit/core";
import { ref } from "vue";
import { useAssigneer } from "./composables/use-assigneer";

const { isLoading, countMap, assginedCount } = useAssigneer();
// useAssigneer
</script>

<template>
  <div>{{ isLoading ? "loading" : assginedCount }}</div>
  {{ countMap }}
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
