function injectHTML(data) {
    console.log("Fired injectHTML");
    const target = document.querySelector("#test");
    target.innerHTML = "";
    console.log(data[0])
    target.innerHTML += "<li>Sunrise: " + data[0] + "</li>";
    target.innerHTML += "<li>Sunset: " + data[1] + "</li>";
    target.innerHTML += "<li>Solar Noon: " + data[2] + "</li>";
    target.innerHTML += "<li>Day Length: " + data[3] + "</li>";
  }

function mapView() {
    const carto = L.map('map').setView([38.98, -76.93], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(carto);
    return carto;  
}

async function mainEvent() {
    const generateResultsButton = document.querySelector("#generate");
    const loadDataButton = document.querySelector("#data_load");

    // get user entered lat and long
    const lati = document.getElementById("lati").value;
    const long = document.getElementById("long").value;

    // Sunrise Sunset API URL
    const APIurl = 'https://api.sunrise-sunset.org/json';

    // Set up map view w/ leaflet
    const carto = mapView();
    
    const dataMain = [];
    
    loadDataButton.addEventListener("click", async (submitEvent) => {
        console.log("loading data");
        const results = await fetch(APIurl);
        const data = await results.json();
        console.table(data);

        dataMain.push(data.results.sunrise);
        dataMain.push(data.results.sunset);
        dataMain.push(data.results.solar_noon);
        dataMain.push(data.results.day_length);
    });

    generateResultsButton.addEventListener("click", (event) => {
        console.log("generate new list");   
        injectHTML(dataMain);
        

      });
}

document.addEventListener("DOMContentLoaded", async () => mainEvent());