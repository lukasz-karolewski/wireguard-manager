#!/bin/bash
set -euo pipefail

release_branch="dev"
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

latest_tag=$(git describe --tags --abbrev=0 --match "v*" 2>/dev/null || true)
if [ -n "$latest_tag" ]; then
    changelog_range="$latest_tag..HEAD"
else
    changelog_range="$(git rev-list --max-parents=0 HEAD)..HEAD"
fi

echo "Generating changelog entries from ${latest_tag:-initial commit}"
changelog_entries=$(git log "$changelog_range" --pretty=format:"* %s" --reverse)

if [ -n "$changelog_entries" ]; then
    echo "Updating changelog.txt"
    tmp_file=$(mktemp)
    {
        echo
        echo "## $(date +%Y-%m-%d)"
        echo
        echo "Changes:"
        echo "$changelog_entries"
        if [ -f changelog.txt ]; then
            cat changelog.txt
        fi
    } > "$tmp_file"
    mv "$tmp_file" changelog.txt

    git add changelog.txt
    git commit -m "Update changelog"
fi

version=${1:-}
if [ -z "$version" ]; then
    version="v$(date +'%y.%m.%d').$(git rev-parse --short HEAD)"
fi

if git rev-parse -q --verify "refs/tags/$version" >/dev/null; then
    echo "Tag $version already exists"
    exit 1
fi

echo "Creating release tag $version"
git tag -a "$version" -m "Release $version"

echo "Pushing $release_branch and $version"
git push origin "$release_branch" "$version"
