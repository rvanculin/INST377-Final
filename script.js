function injectHTML(data) {
    console.log("Fired injectHTML");
    const target = document.querySelector("#test");
    target.innerHTML = "";
    // console.log(data[0])
    target.innerHTML += "<li>Sunrise: " + data[0] + "</li>";
    target.innerHTML += "<li>Sunset: " + data[1] + "</li>";
    target.innerHTML += "<li>Solar Noon: " + data[2] + "</li>";
    target.innerHTML += "<li>Day Length: " + data[3] + "</li>";
  }

function mapView() {
    console.log("Load Map")
    const carto = L.map('map').setView([38.98, -76.93], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(carto);
    return carto;  
}

function showOnMap(latitude, longitude, carto) {
  const marker = L.marker([latitude, longitude]).addTo(carto);

}

function convertUTCToLocal(utcTime) {
    const [time, period] = utcTime.split(' ');
    const [hours, minutes, seconds] = time.split(':');
  
    let convertedHours = Number(hours);
    if (period.toLowerCase() === 'pm' && convertedHours !== 12) {
      convertedHours += 12;
    } else if (period.toLowerCase() === 'am' && convertedHours === 12) {
      convertedHours = 0;
    }
  
    const currentUtcDateTime = new Date();
    currentUtcDateTime.setUTCHours(convertedHours, minutes, seconds);
  
    const localESTDateTime = new Date(currentUtcDateTime.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  
    const localESTTime = localESTDateTime.toLocaleTimeString([], { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    return localESTTime;

  }

async function mainEvent() {
    const generateResultsButton = document.querySelector("#generate");
    const loadDataButton = document.querySelector("#data_load");
    const clearDataButton = document.querySelector("#data_clear");

    // get user entered lat and long
    const latiInput = document.getElementById("lati");
    const longInput = document.getElementById("long");
    
    const dataMain = [];
    let lati = "";
    let long = "";

    // Set up map view w/ leaflet + show coordinates on map
    const carto = mapView();

    latiInput.addEventListener("input", (event) => {
        lati = event.target.value;
    })

    longInput.addEventListener("input", (event) => {
        long = event.target.value;
    })
    
    loadDataButton.addEventListener("click", async (submitEvent) => {
        console.log("loading data");
        console.log("load URL", lati, long)

        const APIurl = `https://api.sunrise-sunset.org/json?lat=${lati}&lng=${long}`;
        console.log(APIurl)

        const results = await fetch(APIurl);
        const data = await results.json();
        console.table(data);

        const utcSunrise = data.results.sunrise;
        const utcSunset = data.results.sunset;
        const utcSolarNoon = data.results.solar_noon;

        const localSunrise = convertUTCToLocal(utcSunrise);
        const localSunset = convertUTCToLocal(utcSunset);
        const localSolarNoon = convertUTCToLocal(utcSolarNoon);
        
        // with local time considered
        dataMain.push(localSunrise);
        dataMain.push(localSunset);
        dataMain.push(localSolarNoon)
        dataMain.push(data.results.day_length);

    });

    generateResultsButton.addEventListener("click", (event) => {
        console.log("generate new list");    
        injectHTML(dataMain);
        showOnMap(lati, long, carto);
      });

    clearDataButton.addEventListener("click", (event) => {
    console.log('clear browser data'); 
    localStorage.clear();
    console.log('localStorage Check', localStorage.getItem("storedData"));
    })
}

document.addEventListener("DOMContentLoaded", async () => mainEvent());