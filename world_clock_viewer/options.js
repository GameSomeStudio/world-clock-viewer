document.addEventListener("DOMContentLoaded", () => {
  const cityList = document.getElementById("cityList");

  function loadCities() {
    chrome.storage.sync.get({ cities: [] }, (data) => {
      cityList.innerHTML = '';
      data.cities.forEach(({ name, tz }, index) => {
        const li = document.createElement("li");
        li.style.display = "flex";
        li.style.justifyContent = "space-between";
        li.style.alignItems = "center";

        const span = document.createElement("span");
        span.textContent = `${name} (${tz})`;

        // Delete button
        const delBtn = document.createElement("button");
        delBtn.textContent = "❌";
        delBtn.title = "Delete city";
        delBtn.style.cursor = "pointer";
        delBtn.style.background = "transparent";
        delBtn.style.border = "none";
        delBtn.style.color = "red";
        delBtn.style.fontSize = "16px";
        delBtn.addEventListener("click", () => {
          data.cities.splice(index, 1);
          chrome.storage.sync.set({ cities: data.cities }, loadCities);
        });

        // Up button
        const upBtn = document.createElement("button");
        upBtn.textContent = "⬆️";
        upBtn.title = "Move up";
        upBtn.style.cursor = "pointer";
        upBtn.style.background = "transparent";
        upBtn.style.border = "none";
        upBtn.style.marginLeft = "2px";
        upBtn.disabled = index === 0;
        upBtn.addEventListener("click", () => {
          if (index > 0) {
            const temp = data.cities[index];
            data.cities[index] = data.cities[index - 1];
            data.cities[index - 1] = temp;
            chrome.storage.sync.set({ cities: data.cities }, loadCities);
          }
        });

        // Down button
        const downBtn = document.createElement("button");
        downBtn.textContent = "⬇️";
        downBtn.title = "Move down";
        downBtn.style.cursor = "pointer";
        downBtn.style.background = "transparent";
        downBtn.style.border = "none";
        downBtn.style.marginLeft = "2px";
        downBtn.disabled = index === data.cities.length - 1;
        downBtn.addEventListener("click", () => {
          if (index < data.cities.length - 1) {
            const temp = data.cities[index];
            data.cities[index] = data.cities[index + 1];
            data.cities[index + 1] = temp;
            chrome.storage.sync.set({ cities: data.cities }, loadCities);
          }
        });

        const buttonGroup = document.createElement("div");
        buttonGroup.style.display = "flex";
        buttonGroup.style.gap = "2px";
        buttonGroup.appendChild(upBtn);
        buttonGroup.appendChild(downBtn);
        buttonGroup.appendChild(delBtn);

        li.appendChild(span);
        li.appendChild(buttonGroup);
        cityList.appendChild(li);
      });
    });
  }

  document.getElementById("addBtn").addEventListener("click", () => {
    const tz = document.getElementById("tz").value.trim();
    const city = document.getElementById("city").value.trim();

    if (!tz || !city) return;

    const displayName = `${city}`;
    chrome.storage.sync.get({ cities: [] }, (data) => {
      data.cities.push({ name: displayName, tz });
      chrome.storage.sync.set({ cities: data.cities }, loadCities);
      document.getElementById("tz").value = "";
      document.getElementById("city").value = "";
    });
  });

  loadCities();
});
