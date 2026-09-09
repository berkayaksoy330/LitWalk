const fs = require('fs');

// This function fetches live crime data from the UK Police open data system
async function fetchLondonCrimeData() {
    console.log("Connecting to government open data sources...");

    try {
        // Official and free Open Data API fetching recent police records for central London
        const response = await fetch('https://data.police.uk/api/crimes-street/all-crime?lat=51.5134&lng=-0.1300');
        const data = await response.json();

        console.log(`Successfully fetched ${data.length} total records from the London Police.`);

        // Filter the data STRICTLY for night-walking relevant physical threats
        const relevantCrimes = data.filter(crime => 
            crime.category === 'robbery' || 
            crime.category === 'theft-from-the-person' ||
            crime.category === 'violent-crime' ||
            crime.category === 'anti-social-behaviour' ||
            crime.category === 'public-order' ||
            crime.category === 'drugs'
        );

        // Kodu test ederken kaç tane tehlikeli olay kaldığını görelim
        console.log(`Filtered down to ${relevantCrimes.length} critical physical threat records.`);

        // Format it into a clean structure that the LitWalk map can understand
        const formattedScams = relevantCrimes.map(crime => ({
            title: "Official Alert: " + crime.category.replace(/-/g, ' ').toUpperCase(),
            lat: parseFloat(crime.location.latitude),
            lon: parseFloat(crime.location.longitude),
            desc: crime.location.street.name || "Unknown Street"
        }));

        // Save the data automatically to a file named 'scam-data.json' for LitWalk to use
        fs.writeFileSync('scam-data.json', JSON.stringify(formattedScams, null, 2));
        console.log("High-risk zones successfully saved to 'scam-data.json'! System is ready.");

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Execute the function
fetchLondonCrimeData();