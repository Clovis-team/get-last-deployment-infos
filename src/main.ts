import * as core from '@actions/core'
import * as github from '@actions/github'

const query = `query($repo: String!, $owner: String!, $environment: [String!]) {
  repository(name: $repo, owner: $owner) {
    deployments(environments: $environment, last: 1) {
      edges {
        node {
          state
          latestStatus {
            logUrl
            state
            environmentUrl
          }
        }
      }
    }
  }
}
`

async function run(): Promise<void> {
  try {
    const token = (core.getInput('github_token') ||
      process.env.GITHUB_TOKEN) as string

    const octokit = new github.GitHub(token)
    const context = github.context

    const repoName = context.payload.repository?.name
    const repoOwner = context.payload.repository?.owner.login

    const environment = core.getInput('environment')

    const graphql_result = await octokit.graphql(query, {
      environment: [environment],
      owner: repoOwner,
      repo: repoName
    })

    if (graphql_result!.repository.deployments.edges.length > 0) {
      core.setOutput(
        'deploymentUrl',
        graphql_result!.repository.deployments.edges[0].node.latestStatus
          .environmentUrl
      )
      core.setOutput(
        'deploymentStatus',
        graphql_result!.repository.deployments.edges[0].node.latestStatus.state
      )
      core.setOutput(
        'deploymentGithubStatus',
        graphql_result!.repository.deployments.edges[0].node.state
      )
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
