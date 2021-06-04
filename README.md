
# Get the Last Deployment infos

This action simples call GitHub API to get the last deployment infos in a environment

```
- name: Get last deployment infos
  uses: Clovis-team/get-last-deployment-infos@v1.0.0
  id: deployment_infos
  with:
    environment: ${{ env.STAGE_ENV }}
    github_token: ${{ secrets.GITHUB_TOKEN }}
- name: show results
  run: |
    echo "${{ steps.deployment_infos.outputs.deploymentUrl }}"
    echo "${{ steps.deployment_infos.outputs.deploymentStatus }}"
    echo "${{ steps.deployment_infos.outputs.deploymentGithubStatus }}"
```

## How to do a new release:

Change the code, then:
```
npm run all
git add -A; git commit -m ""; git push
```

On github, draft a new release