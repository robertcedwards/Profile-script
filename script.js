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
    profileContainer.innerHTML = ''; // Clear existing content
    profiles.forEach(profile => {
        const profileHtml = `
            <div class="mb-5 p-4 bg-white rounded-lg shadow">
                <img class="w-20 h-20 rounded-full mx-auto" src="${profile.avatar || ''}" alt="${profile.displayName || 'Profile Avatar'}">
                <h2 class="text-xl font-semibold mt-2 text-center">${profile.displayName || 'N/A'}</h2>
                <p class="text-gray-600 text-center">${profile.description || 'No description provided.'}</p>
                <p class="text-gray-600 text-center">Location: ${profile.location || 'N/A'}</p>
                <div class="mt-3 text-center">
                    ${Object.entries(profile.links || {}).map(([key, value]) => `
                        <a href="${value.link}" class="inline-block bg-blue-500 text-white rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2">${key}</a>
                    `).join('')}
                </div>
            </div>
        `;
        profileContainer.innerHTML += profileHtml;
    });
}

// Call the function when the window loads
window.addEventListener('load', fetchProfileData);
