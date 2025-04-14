document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resultsContainer = document.getElementById('resultsContainer');
    const loader = document.getElementById('loader');
    const noResults = document.getElementById('noResults');

    // Add event listeners
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Focus the search input on page load
    searchInput.focus();

    // Function to perform the search
    function performSearch() {
        const searchTerm = searchInput.value.trim();
        
        if (searchTerm === '') {
            alert('Please enter a search term');
            return;
        }

        // Show loader and hide previous results
        loader.style.display = 'block';
        resultsContainer.innerHTML = '';
        noResults.style.display = 'none';

        // Fetch universities data from API
        fetch(`https://universities.hipolabs.com/search?name=${encodeURIComponent(searchTerm)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Hide loader
                loader.style.display = 'none';

                // Check if we got any results
                if (data.length === 0) {
                    noResults.style.display = 'block';
                    return;
                }

                // Display results
                displayResults(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                loader.style.display = 'none';
                resultsContainer.innerHTML = `
                    <div class="error-message">
                        An error occurred while fetching data. Please try again later.
                    </div>
                `;
            });
    }

    // Function to display the results
    function displayResults(universities) {
        universities.forEach(university => {
            const card = document.createElement('div');
            card.className = 'university-card';

            // Create university information HTML
            card.innerHTML = `
            <div class="university-name">${university.name}</div>
            <div class="university-details">
                <div class="university-detail">
                    <div class="detail-label">Country:</div>
                    <div>${university.country}</div>
                </div>
                <div class="university-detail">
                    <div class="detail-label">State/Province:</div>
                    <div>${university.state_province || 'N/A'}</div>
                </div>
                <div class="university-detail">
                    <div class="detail-label">Alpha Code:</div>
                    <div>${university.alpha_two_code}</div>
                </div>
                ${university.domains?.length > 0 ? `
                <div class="university-detail">
                    <div class="detail-label">Domain:</div>
                    <div>${university.domains[0]}</div>
                </div>
                ` : ''}
            </div>
            ${university.web_pages?.length > 0 ? `
            <a href="${university.web_pages[0]}" class="university-website" target="_blank">Visit Website</a>
            ` : ''}
        `;
            // Add the card to the results container
            resultsContainer.appendChild(card);
        });
    }
});