#!/bin/bash
set -euo pipefail

release_branch="dev"

git remote get-url origin >/dev/null
git update-index -q --refresh

current_branch=$(git branch --show-current)

if [ "$current_branch" != "$release_branch" ]; then
    echo "Publish must be run from the $release_branch branch. Current branch: $current_branch"
    exit 1
fi

if ! git diff-index --quiet HEAD -- || [ -n "$(git status --porcelain)" ]; then
    echo "Working tree must be clean before publishing"
    exit 1
fi

echo "Fetching origin"
git fetch origin --tags

echo "Rebasing $release_branch on origin/$release_branch"
git rebase "origin/$release_branch"

version=${1:-}
if [ -z "$version" ]; then
    version="v$(date +'%y.%m.%d').$(git rev-parse --short HEAD)"
fi

if ! git check-ref-format "refs/tags/$version" >/dev/null; then
    echo "Invalid tag name: $version"
    exit 1
fi

if git rev-parse -q --verify "refs/tags/$version" >/dev/null; then
    echo "Tag $version already exists"
    exit 1
fi

echo "Creating release tag $version"
git tag -a "$version" -m "Release $version"

echo "Pushing $release_branch and $version"
git push --atomic origin "$release_branch" "$version"
