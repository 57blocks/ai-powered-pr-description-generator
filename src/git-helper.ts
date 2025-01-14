import { execSync } from 'child_process';

export class GitHelper {
  private ignores?: string;

  constructor(ignores: string | undefined) {
    this.ignores = ignores;
  }

  setupGitConfiguration() {
    execSync(`git config --global user.name "github-actions[bot]"`);
    execSync(`git config --global user.email "github-actions[bot]@users.noreply.github.com"`);
  }

  fetchGitBranches(baseBranch: string, headBranch: string) {
    execSync(`git fetch origin ${baseBranch} ${headBranch}`);
  }

  getGitDiff(baseBranch: string, headBranch: string): string {
    let ignoreFiles = [
      ':!**/package-lock.json',
      ':!**/dist/*',
    ];
    if (this.ignores) {
      ignoreFiles = this.ignores.split(',').map((item) => `:!${item}`);
    }
    console.log("ignoreFiles = ", JSON.stringify(ignoreFiles));
    const diffOutput = execSync(`git diff origin/${baseBranch} origin/${headBranch}`, { encoding: 'utf8', maxBuffer: 1024 * 1024 });
    console.log('Filtered diff output:', diffOutput);
    return diffOutput;
  }
}
t