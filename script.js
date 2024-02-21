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

    // Initialize an object to hold the first values
    const firstProfileDetails = {
        avatar: "",
        name: "",
        description: "",
        location: "",
        links: new Map()
    };

    // Use the first non-empty values encountered for avatar, description, and location
    profiles.forEach(profile => {
        if (!firstProfileDetails.avatar && profile.avatar) firstProfileDetails.avatar = profile.avatar;
        if (!firstProfileDetails.name && profile.displayName) firstProfileDetails.name = profile.displayName;
        if (!firstProfileDetails.description && profile.description) firstProfileDetails.description = profile.description;
        if (!firstProfileDetails.location && profile.location) firstProfileDetails.location = profile.location;

        // For links, add all unique ones encountered
        Object.entries(profile.links || {}).forEach(([key, value]) => {
            if (!firstProfileDetails.links.has(key)) {
                firstProfileDetails.links.set(key, value.link);
            }
        });
    });

    // Construct the HTML for the single card using the first encountered values
    const profileHtml = `
        <div class="mb-5 p-4 bg-white rounded-lg shadow">
            ${firstProfileDetails.avatar ? `<img class="w-20 h-20 rounded-full mx-auto" src="${firstProfileDetails.avatar}" alt="Profile Avatar">` : ''}
            <h2 class="text-xl font-semibold mt-2 text-center">${firstProfileDetails.name || 'N/A'}</h2>
            <p class="text-gray-600 text-center">${firstProfileDetails.description || 'No description provided.'}</p>
            <p class="text-gray-600 text-center">Location: ${firstProfileDetails.location || 'N/A'}</p>
            <div class="mt-3 text-center">
                ${Array.from(firstProfileDetails.links).map(([key, link]) => `
                    <a href="${link}" class="inline-block bg-blue-500 text-white rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2">${key}</a>
                `).join('')}
            </div>
        </div>
    `;

    // Set the innerHTML to the newly created profileHtml
    profileContainer.innerHTML = profileHtml;
}
// Call the function when the window loads
window.addEventListener('load', fetchProfileData);
