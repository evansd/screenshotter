#!/bin/bash

# ----------------------------------------------------------------------------
# If there are any changes in the "docs/" directory, commit them and push the
# commits back to the origin repo
# ----------------------------------------------------------------------------

set -euo pipefail

# We expect the "origin" URL to use the git protocol but we need to use the
# https protocol to push because that's the only protocol which supports token
# authentication. So we extract the repo details using a regex (the "t;d"
# commands at the end of the sed expresssion ensure we return an empty string
# if the substitution regex doesn't match).
git_repo_path=$(git remote get-url origin | sed -r 's/^git@github.com:(.+)$/\1/;t;d')
if [[ -z "$git_repo_path" ]]; then
  echo "Repo URL did not match expected pattern: $(git remote get-url origin)"
  exit 1
fi
git_repo_url="https://${GITHUB_PERSONAL_TOKEN}@github.com/$git_repo_path"

git add docs/

# Use `diff-index` so we only commit and push if something has changed
if ! git diff-index --cached --quiet HEAD --; then
  echo "Pushing new commit to github.com:$git_repo_path"
  # Putting "[ci skip]" in the commit message ensures that CircleCI doesn't
  # trigger another build from this commit
  git \
    -c user.name="EBMBot" \
    -c user.email="ebmbot@ebmdatalab.net" \
    commit \
      -m 'Update screenshots' \
      -m '[ci skip]'
  git push -q "$git_repo_url" master
else
  echo 'Nothing changed so nothing to commit'
fi
