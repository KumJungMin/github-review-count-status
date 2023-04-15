import { Octokit } from "@octokit/core";
import { ref, Ref } from "vue";
// --you need to change these values--
const ORG = ""; // your organization name or your user name
const MY_GITHUB_ID = ""; // your github id
const AUTH_TOKEN = ""; // your github auth token

//------------------------------------

export function useAssigneer(githubId = MY_GITHUB_ID) {
  const octokit = new Octokit({ auth: AUTH_TOKEN });
  const isLoading = ref<boolean>(false);
  const repoNames = ref<string[]>([]);
  const countMap = ref<{ [key: string]: any }>({});
  const assginedCount = ref<number>(0);


  async function initialization() {
    isLoading.value = true;
    try {
      await getOwnerRepoNames();
      await getPRList();
    } finally {
      isLoading.value = false;
    }
  }
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
    if (!repoNames.value.length) return;
    const assigneerList = await Promise.all(
      repoNames.value.map((repoName) => getRepoAsssigneers(repoName))
    );
    const filteredList = assigneerList.map((data) =>
      data
        .flat()
        .map(({ login }) => login)
        .filter(Boolean)
    );
    filteredList.flat().forEach((login) => {
      countMap.value[login] = (countMap.value[login] || 0) + 1;
    });
    assginedCount.value = countMap.value[githubId];
  }
  async function getRepoAsssigneers(repoName: string) {
    const { data } = await octokit.request("GET /repos/{owner}/{repo}/pulls", {
      owner: ORG,
      repo: repoName,
    });
    return data.map((v) => v?.requested_reviewers);
  }


  initialization();
  
  return {
    isLoading,
    countMap,
    assginedCount
  }
}

