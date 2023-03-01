<script setup lang="ts">
import { Octokit } from "@octokit/core";
import { ref } from "vue";

// --you need to change these values--
const ORG = ""; // your organization name or your user name
const MY_GITHUB_ID = ""; // your github id
const AUTH_TOKEN = ""; // your github auth token
//------------------------------------

const octokit = new Octokit({ auth: AUTH_TOKEN });

const isLoading = ref<boolean>(false);
const repoNames = ref<string[]>([]);
const assginedCount = ref<number>(0);

async function getOwnerRepoNames() {
  // if your ora has more than 100 repos, you need to change this value
  const PER_PAGE = 100;
  const { data } = await octokit.request("GET /orgs/{org}/repos", {
    org: ORG,
    per_page: PER_PAGE,
  });
  repoNames.value = data.map((v) => v.name);
}
async function getPRList() {
  let result = 0;
  const datas = await Promise.all(
    repoNames.value.map((repoName) => _getRepoAsssigneers(repoName))
  );
  datas.forEach((data) => {
    data.forEach((assigneer) => {
      if (assigneer === MY_GITHUB_ID) result += 1;
    });
  });
  assginedCount.value = result;
}
async function _getRepoAsssigneers(repoName: string) {
  const { data } = await octokit.request("GET /repos/{owner}/{repo}/pulls", {
    owner: ORG,
    repo: repoName,
  });
  return data.map((v) => v?.assignee?.login);
}

async function initalization() {
  isLoading.value = true;
  try {
    await getOwnerRepoNames();
    await getPRList();
  } finally {
    isLoading.value = false;
  }
}
initalization();
</script>

<template>
  <div>{{ isLoading ? "loading" : assginedCount }}</div>
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
