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