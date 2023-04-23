  function injectHTML(list) {
    console.log("Fired injectHTML");
    const target = document.querySelector("#restaurant_list");
    target.innerHTML = "";
    list.forEach((item) => {
      const str = `<li>${item.name}</li>`;
      target.innerHTML += str;
    });
  }
  
  /* A quick filter that will return something based on a matching input */
  // function filterList(list, query) {
  //   return list.filter((item) => {
  //     const lowerCaseName = item.name.toLowerCase();
  //     const lowerCaseQuery = query.toLowerCase();
  //     return lowerCaseName.includes(lowerCaseQuery);
  //   });
  // }

  async function mainEvent() {
    const mainForm = document.querySelector(".main_form"); 
    const loadDataButton = document.querySelector("#data_load");
    const clearDataButton = document.querySelector("#data_clear");
         const generateListButton = document.querySelector("#generate");
    const textField = document.querySelector("#resto");
  
    const loadAnimation = document.querySelector("#data_load_animation");
    loadAnimation.style.display = "none";
    generateListButton.classList.add("hidden");

    const carto = initMap();
     
    const storedData = localStorage.getItem('storedData');
    let parsedData = JSON.parse(storedData);

    if(parsedData?.length > 0){
         generateListButton.classList.remove("hidden")
     }
  
    let currentList = [];
  
    loadDataButton.addEventListener("click", async (submitEvent) => {
      // async has to be declared on every function that needs to "await" something
  
      // This prevents your page from becoming a list of 1000 records from the county, even if your form still has an action set on it
      submitEvent.preventDefault();
  
      // this is substituting for a "breakpoint" - it prints to the browser to tell us we successfully submitted the form
      console.log("loading data");
      loadAnimation.style.display = "inline-block";
  
      // Basic GET request - this replaces the form Action
      const results = await fetch(
        "https://api.sunrise-sunset.org/json"
      );
  
      // This changes the response from the GET into data we can use - an "object"
      const storedList = await results.json();
      localStorage.setItem('storedData', JSON.stringify(storedList));
      parsedData = storedList;

      if(storedList?.length > 0){
        generateListButton.classList.remove("hidden")
      }

      loadAnimation.style.display = "none";
      //console.table(storedList);
      //injectHTML(currentList);
    });

    generateListButton.addEventListener("click", (event) => {
      console.log("generate new list");
      currentList = cutRestaurantList(parsedData);
      console.log(currentList);
      injectHTML(currentList);
      markerPlace(currentList, carto);
    });
  
    textField.addEventListener("input", (event) => {
      console.log("input", event.target.value);
      const newList = filterList(currentList, event.target.value);
      console.log(newList);
      injectHTML(newList);
      markerPlace(newList, carto);
    });

    clearDataButton.addEventListener("click", (event) => {
       console.log('clear browser data'); 
       localStorage.clear();
       console.log('localStorage Check', localStorage.getItem("storedData"));
    })

  }
  
  document.addEventListener("DOMContentLoaded", async () => mainEvent()); // the async keyword means we can make API requests
  