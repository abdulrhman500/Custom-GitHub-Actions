const core = require('@actions/core');

async function run() {
    try {
        const commitMessage = core.getInput('commit_message');
        const latestTag = core.getInput('latest_tag') || '1.0.0';  
        const newVersion = determineVersion(commitMessage, latestTag);
        core.setOutput('new_version', newVersion);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();





function determineVersion(commit, tag) {
    const patchKeywords = ["fix"];
    const minorKeywords = ["feat"];
    const majorKeywords = ["breaking change"];
  
    let changeType = 2; // Default to patch
  
    // Create a tag if none exists
    if (!tag) {
      return "1.0.0";
    }
  
    // Determine the type of version bump
    if (commit.includes("!") || majorKeywords.some(k => commit.toLowerCase().includes(k))) {
      changeType = 0; // Major change
    } else if (minorKeywords.some(k => commit.toLowerCase().includes(k))) {
      changeType = 1; // Minor change
    } else if (patchKeywords.some(k => commit.toLowerCase().includes(k))) {
      changeType = 2; // Patch change
    }
  
    // Split version number into parts
    const versionParts = tag.split('.').map(Number);
  
    // Increment the appropriate version part
    versionParts[changeType]++;
  
    // Reset lower versions if it's a major or minor bump
    if (changeType < 2) {
      versionParts[2] = 0;
    }
    if (changeType === 0) {
      versionParts[1] = 0;
    }
  
    // Generate the new tag
    return versionParts.join('.');
  }

  