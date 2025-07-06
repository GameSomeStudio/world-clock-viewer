function displayCities(cities) {
  const container = document.getElementById('cityTimes');
  container.innerHTML = '';

  if (!Array.isArray(cities) || cities.length === 0) {
    container.innerHTML = '<p>No cities added yet.</p>';
    return;
  }



  cities.forEach(({ name, tz }, index) => {
    const row = document.createElement('div');
    row.className = `city-row ${index % 2 === 0 ? 'even' : 'odd'}`;
    row.style.display = "flex";
    row.style.justifyContent = "space-between";
    row.style.alignItems = "center";
	
	
	const nameSpan = document.createElement("span");
nameSpan.textContent = name;
nameSpan.className = "city-name"; // CSS sınıfı kullanılıyor

const timeSpan = document.createElement("span");
timeSpan.textContent = getTimeString(tz);
timeSpan.className = "city-time"; // CSS sınıfı kullanılıyor
	

    


    row.appendChild(nameSpan);
    row.appendChild(timeSpan);
    container.appendChild(row);
  });
}



function getTimeString(timeZone) {
  const now = new Date();
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timeZone,
    hour12: false
  };
  return new Intl.DateTimeFormat('en-US', options).format(now);
}



// Load cities or add default
chrome.storage.sync.get({ cities: [] }, (data) => {
  if (data.cities.length === 0) {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    const [region, cityRaw] = tz.split("/");
    const city = cityRaw.replace(/_/g, " ");
    const displayName = `${city} (${region})`;

    const defaultCity = {
      name: displayName,
      tz: tz
    };

    chrome.storage.sync.set({ cities: [defaultCity] }, () => {
      displayCities([defaultCity]);
    });
  } else {
    displayCities(data.cities);
  }
});

document.getElementById("openOptions").addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});
