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

# Generate changelog entries
echo "Generating changelog entries"
changelog_entries=$(git log master..dev --pretty=format:"* %s" --reverse)

if [ ! -z "$changelog_entries" ]; then
    echo "Updating changelog.txt"
    # Create new changelog content
    tmp_file=$(mktemp)
    echo -e "\n## $(date +%Y-%m-%d)\n" > "$tmp_file"
    
    # Try to generate summary
    echo "Generating summary..."
    if summary=$(echo "$changelog_entries" | npm run summarize-changelog --silent); then
        # Create a temporary file for review
        summary_file=$(mktemp)
        echo "Summary to be added:" > "$summary_file"
        echo "$summary" >> "$summary_file"
        echo -e "\nChangelog entries to be added:" >> "$summary_file"
        echo "$changelog_entries" >> "$summary_file"
        
        # Open in VS Code and wait for user to review
        code --wait "$summary_file"
        
        # Ask for confirmation
        read -p "Proceed with these changes? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "Aborting changelog update"
            rm "$summary_file"
            exit 1
        fi
        
        # Clean up
        rm "$summary_file"
        
        # Continue with changelog update
        echo "Summary:" >> "$tmp_file"
        echo "$summary" >> "$tmp_file"
        echo -e "\n" >> "$tmp_file"
    fi
    echo "Changes:" >> "$tmp_file"
    
    echo "$changelog_entries" >> "$tmp_file"
    if [ -f changelog.txt ]; then
        cat changelog.txt >> "$tmp_file"
    fi
    mv "$tmp_file" changelog.txt
    
    # Commit the changes
    git add changelog.txt
    git commit -m "Update changelog"
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