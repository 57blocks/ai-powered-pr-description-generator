import { getInput, setOutput, setFailed } from '@actions/core';
import { context, getOctokit } from '@actions/github';
import { GitHelper } from './git-helper';
import aiHelperResolver from './ai/ai-helper-resolver';
import { AIHelperInterface } from './ai/types';

class PullRequestUpdater {
  private gitHelper: GitHelper;
  private context: any;
  private aiHelper: AIHelperInterface;
  private octokit: any;
  private useJira: boolean;

  constructor() {
    this.gitHelper = new GitHelper(getInput('ignores'));
    this.context = context;
    this.aiHelper = aiHelperResolver({
      apiKey: getInput('api_key', { required: true }),
      aiName: getInput('ai_name', { required: true }),
      temperature: parseFloat(getInput('temperature') || '0.7'),
    });
    const githubToken = getInput('github_token', { required: true });
    this.octokit = getOctokit(githubToken);
    this.useJira = getInput('use_jira') === 'true';
  }

  private generatePrompt(diffOutput: string, creator: string): string {
    return `Instructions:
Please generate a Pull Request description for the provided diff, following these guidelines:
- Add a subtitle "## What this PR do?" to the first line.
- Format your answer in Markdown.
- Do not include the title of the PR. e.g. "feat: xxx" "fix: xxx" "Refactor: xxx".
- Do not include the diff in the PR description.
- Describe the changes simply in the PR.
- Do not include any code snippets or images.
- Please add some emojis to make it more fun! Emojis only contain the following: 🚀🎉👍👏🔥. List the changes using numbers, each list should only have 0 or 1 emoji. 
  e.g. 1. Added a new feature👏, 2. Fixed a bug👍, 3. Made a big change for preact🚀 etc. But do not exceed 3 emojis in your list!!!
- Thanks to **${creator}** for the contribution! 🎉

Diff:
${diffOutput}`;
  }

  async run() {
    try {
      this.validateEventContext();

      const pullRequestNumber = this.context.payload.pull_request.number;
      const creator = this.context.payload.pull_request.user.login;
      const { baseBranch, headBranch } = this.extractBranchRefs();
      this.gitHelper.setupGitConfiguration();
      this.gitHelper.fetchGitBranches(baseBranch, headBranch);

      const diffOutput = this.gitHelper.getGitDiff(baseBranch, headBranch);
      const prompt = this.generatePrompt(diffOutput, creator);
      const generatedDescription = await this.aiHelper.createPullRequestDescription(diffOutput,  prompt);
      
      await this.updatePullRequestDescription(pullRequestNumber, generatedDescription);

      setOutput('pr_number', pullRequestNumber.toString());
      setOutput('description', generatedDescription);
      console.log(`Successfully updated PR #${pullRequestNumber} description.`);
    } catch (error) {
      setFailed(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  validateEventContext() {
    if (this.context.eventName !== 'pull_request') {
      setFailed('This action only runs on pull_request events.');
      throw new Error('Invalid event context');
    }
  }

  extractBranchRefs() {
    const baseBranch = this.context.payload.pull_request.base.ref;
    const headBranch = this.context.payload.pull_request.head.ref;
    console.log(`Base branch: ${baseBranch}`);
    console.log(`Head branch: ${headBranch}`);
    return { baseBranch, headBranch };
  }

  async updatePullRequestDescription(pullRequestNumber: number, generatedDescription: string) {
    try {
      const pullRequest = await this.fetchPullRequestDetails(pullRequestNumber);
      const branchName = this.extractBranchName();
      
      const currentDescription = pullRequest.body || '';
      const newDescription = this.jiraFormat(branchName, generatedDescription);

      if (currentDescription) {
        await this.postOriginalDescriptionComment(pullRequestNumber, currentDescription);
      }

      await this.applyPullRequestUpdate(pullRequestNumber, newDescription);
    } catch (error) {
      console.error('Error in updatePullRequestDescription:', error);
      throw error;
    }
  }

  async fetchPullRequestDetails(pullRequestNumber: number) {
    const { data } = await this.octokit.rest.pulls.get({
      owner: this.context.repo.owner,
      repo: this.context.repo.repo,
      pull_number: pullRequestNumber,
    });
    return data;
  }

  extractBranchName(): string {
    return this.context.payload.pull_request.head.ref.replace('feat/', '').replace('fix/', '');
  }

  jiraFormat(branchName: string, generatedDescription: string): string {
    const jiraStr = this.useJira ? `## Jira Ticket\n\nhttps://vungle.atlassian.net/browse/${branchName}\n\n` : '';
    return `${jiraStr}${generatedDescription}`;
  }

  async postOriginalDescriptionComment(pullRequestNumber: number, currentDescription: string) {
    console.log('Creating comment with original description...');
    await this.octokit.rest.issues.createComment({
      owner: this.context.repo.owner,
      repo: this.context.repo.repo,
      issue_number: pullRequestNumber,
      body: `**Original description**:\n\n${currentDescription}`
    });
    console.log('Comment created successfully.');
  }

  async applyPullRequestUpdate(pullRequestNumber: number, newDescription: string) {
    console.log('Updating PR description...');
    await this.octokit.rest.pulls.update({
      owner: this.context.repo.owner,
      repo: this.context.repo.repo,
      pull_number: pullRequestNumber,
      body: newDescription,
    });
    console.log('PR description updated successfully.');
  }
}

export default PullRequestUpdater;
