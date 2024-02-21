async function fetchProfileData() {
    const apiUrl = 'https://api.web3.bio/profile/0xhashbrown.eth';
    try {
        const response = await fetch(apiUrl);
        const profiles = await response.json();
        displayProfiles(profiles);
    } catch (error) {
        console.error('Error fetching profile data:', error);
    }
}
function displayProfiles(profiles) {
    const profileContainer = document.getElementById('profileContent');
    const similarityThreshold = 2; // Define your similarity threshold here

    // Initialize an object to hold the merged profile
    const mergedProfile = {
        avatar: "", // Assuming you will use the first one
        names: new Set(),
        descriptions: new Set(),
        locations: new Set(),
        links: new Map()
    };

    profiles.forEach(profile => {
        // For simplicity, take the first avatar
        if (!mergedProfile.avatar) mergedProfile.avatar = profile.avatar;

        // Use Levenshtein distance to check for similarity before adding
        let isNameSimilar = Array.from(mergedProfile.names).some(name => levenshteinDistance(name, profile.displayName) <= similarityThreshold);
        if (!isNameSimilar) mergedProfile.names.add(profile.displayName);

        if (profile.description) {
            let isDescriptionSimilar = Array.from(mergedProfile.descriptions).some(description => levenshteinDistance(description, profile.description) <= similarityThreshold);
            if (!isDescriptionSimilar) mergedProfile.descriptions.add(profile.description);
        }

        if (profile.location) {
            let isLocationSimilar = Array.from(mergedProfile.locations).some(location => levenshteinDistance(location, profile.location) <= similarityThreshold);
            if (!isLocationSimilar) mergedProfile.locations.add(profile.location);
        }

        Object.entries(profile.links || {}).forEach(([key, value]) => {
            // For links, consider adding new ones or checking similarity based on key
            if (!mergedProfile.links.has(key)) {
                mergedProfile.links.set(key, value.link);
            }
        });
    });

    // Construct the merged profile card HTML
    const profileHtml = `
        <div class="mb-5 p-4 bg-white rounded-lg shadow">
            ${mergedProfile.avatar ? `<img class="w-20 h-20 rounded-full mx-auto" src="${mergedProfile.avatar}" alt="Profile Avatar">` : ''}
            <h2 class="text-xl font-semibold mt-2 text-center">${Array.from(mergedProfile.names).join(', ')}</h2>
            <p class="text-gray-600 text-center">${Array.from(mergedProfile.descriptions).join(', ')}</p>
            <p class="text-gray-600 text-center">Location: ${Array.from(mergedProfile.locations).join(', ')}</p>
            <div class="mt-3 text-center">
                ${Array.from(mergedProfile.links).map(([key, link]) => `
                    <a href="${link}" class="inline-block bg-blue-500 text-white rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2">${key}</a>
                `).join('')}
            </div>
        </div>
    `;

    profileContainer.innerHTML = profileHtml;
}
function levenshteinDistance(s1, s2) {
    // Create a matrix
    const matrix = Array(s2.length + 1).fill(null).map(() => Array(s1.length + 1).fill(null));
  
    // Initialize the matrix
    for (let i = 0; i <= s1.length; i += 1) matrix[0][i] = i;
    for (let j = 0; j <= s2.length; j += 1) matrix[j][0] = j;
  
    // Populate the matrix
    for (let j = 1; j <= s2.length; j += 1) {
      for (let i = 1; i <= s1.length; i += 1) {
        const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // Deletion
          matrix[j - 1][i] + 1, // Insertion
          matrix[j - 1][i - 1] + indicator, // Substitution
        );
      }
    }
  
    // Return the Levenshtein distance
    return matrix[s2.length][s1.length];
  }
  function mergeSimilarProfiles(profiles) {
    const threshold = 2; // Define a threshold for similarity
    const mergedProfile = {
      avatars: new Set(),
      names: new Set(),
      descriptions: new Set(),
      locations: new Set(),
      links: new Map()
    };
  
    profiles.forEach(profile => {
      // Check if the profile's name is similar to any existing name in the mergedProfile
      let isSimilar = Array.from(mergedProfile.names).some(name => levenshteinDistance(name, profile.displayName) <= threshold);
  
      if (isSimilar) {
        // If similar, merge profile data
        mergedProfile.avatars.add(profile.avatar);
        mergedProfile.names.add(profile.displayName);
        profile.description && mergedProfile.descriptions.add(profile.description);
        profile.location && mergedProfile.locations.add(profile.location);
        Object.entries(profile.links || {}).forEach(([key, value]) => {
          mergedProfile.links.set(key, value.link);
        });
      }
    });
  
    // Convert Sets and Maps to arrays or strings for display
    return {
      avatar: Array.from(mergedProfile.avatars)[0], // Example: taking the first avatar
      name: Array.from(mergedProfile.names).join(', '),
      description: Array.from(mergedProfile.descriptions).join(', '),
      location: Array.from(mergedProfile.locations).join(', '),
      links: Array.from(mergedProfile.links).map(([key, link]) => ({ key, link }))
    };
  }
// Call the function when the window loads
window.addEventListener('load', fetchProfileData);
