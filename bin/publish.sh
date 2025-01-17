#!/bin/bash
set -e  # Stop script execution on any error

# Check if there are uncommitted changes
if git diff-index --quiet HEAD --; then
    echo "No changes to stash"
else
    echo "Stashing changes"
    git stash
    should_pop_stash=true
fi

# Switch to master branch
echo "Switching to master branch"
git checkout master

# Generate changelog entries
echo "Generating changelog entries"
changelog_entries=$(git log master..dev --pretty=format:"* %s" --reverse)

if [ ! -z "$changelog_entries" ]; then
    echo "Updating changelog.txt"
    echo -e "\n## $(date +%Y-%m-%d)\n" >> changelog.txt
    echo "$changelog_entries" >> changelog.txt
    git add changelog.txt
    git commit -m "Update changelog"
fi

# Merge dev into master
echo "Merging dev into master"
git merge dev

# Push master and dev branches to origin
echo "Pushing to origin"
git push origin dev master

# Switch back to dev branch
echo "Switching back to dev branch"
git checkout dev

# Pop the stash if there were changes stashed
if [ "$should_pop_stash" = true ]; then
    echo "Popping stash"
    git stash pop
fi