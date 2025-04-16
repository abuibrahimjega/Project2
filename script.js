document.getElementById('searchButton').addEventListener('click', () => {
    const rawQuery = document.getElementById('searchInput').value.trim();
  
    if (rawQuery === "") {
      alert("Please enter a university name.");
      return;
    }
  
    const query = encodeURIComponent(rawQuery);
  
    fetch(`http://universities.hipolabs.com/search?name=${query}`)
      .then(response => response.json())
      .then(data => {
        const container = document.getElementById('resultsContainer');
        container.innerHTML = "";
  
        // Filter results in JS just in case API gives broader results
        const filteredData = data.filter(uni => 
          uni.name.toLowerCase().includes(rawQuery.toLowerCase())
        );
  
        if (filteredData.length === 0) {
          container.innerHTML = "<p>No universities found matching your search.</p>";
          return;
        }
  
        filteredData.forEach(uni => {
          const card = document.createElement('div');
          card.className = "result-card";
          card.innerHTML = `
            <h3>${uni.name}</h3>
            <p><strong>Country:</strong> ${uni.country}</p>
            <p><strong>Website:</strong> <a href="${uni.web_pages[0]}" target="_blank">${uni.web_pages[0]}</a></p>
          `;
          container.appendChild(card);
        });
      })
      .catch(error => {
        document.getElementById('resultsContainer').innerHTML = "<p>Error fetching data.</p>";
        console.error('Error:', error);
      });
  });
  
