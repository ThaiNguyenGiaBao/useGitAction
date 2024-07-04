const { Octokit } = require("@octokit/rest");
const fs = require("fs");
const core = require("@actions/core");

// Create an instance of Octokit
const octokit = new Octokit({
  auth: core.getInput('token')
});

async function getOrgRepoData(orgName) {
  const response = await octokit.repos.listForOrg({
    org: orgName,
    type: "public",
  });

  return {
    orgName,
    repoCount: response.data.length,
  };
}

async function updateReadme() {
  const orgNames = core.getInput('org-names').split(',');
  let readmeContent = "# Organization Repositories\n\n";

  for (const org of orgNames) {
    const data = await getOrgRepoData(org);
    readmeContent += `## ${data.orgName}\n- Repositories: ${data.repoCount}\n\n`;
  }

  fs.writeFileSync("README.md", readmeContent);
}

updateReadme().catch(error => {
  core.setFailed(error.message);
});
