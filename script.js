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
    //const textEntry = document.querySelector("#latiText")

    // get user entered lat and long
    const latiInput = document.getElementById("lati");
    const longInput = document.getElementById("long");

    let lati = "";
    let long = "";

    // Set up map view w/ leaflet
    const carto = mapView();
    
    const dataMain = [];

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