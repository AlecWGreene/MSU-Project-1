// ==================================================
// DOM ELEMENTS
// ==================================================


// ==================================================
// GLOBAL VARIABLES
// ==================================================

// Form Variables
// --------------------------------------------------

const states = [
    ['Arizona', 'AZ'],
    ['Alabama', 'AL'],
    ['Alaska', 'AK'],
    ['Arkansas', 'AR'],
    ['California', 'CA'],
    ['Colorado', 'CO'],
    ['Connecticut', 'CT'],
    ['Delaware', 'DE'],
    ['Florida', 'FL'],
    ['Georgia', 'GA'],
    ['Hawaii', 'HI'],
    ['Idaho', 'ID'],
    ['Illinois', 'IL'],
    ['Indiana', 'IN'],
    ['Iowa', 'IA'],
    ['Kansas', 'KS'],
    ['Kentucky', 'KY'],
    ['Louisiana', 'LA'],
    ['Maine', 'ME'],
    ['Maryland', 'MD'],
    ['Massachusetts', 'MA'],
    ['Michigan', 'MI'],
    ['Minnesota', 'MN'],
    ['Mississippi', 'MS'],
    ['Missouri', 'MO'],
    ['Montana', 'MT'],
    ['Nebraska', 'NE'],
    ['Nevada', 'NV'],
    ['New Hampshire', 'NH'],
    ['New Jersey', 'NJ'],
    ['New Mexico', 'NM'],
    ['New York', 'NY'],
    ['North Carolina', 'NC'],
    ['North Dakota', 'ND'],
    ['Ohio', 'OH'],
    ['Oklahoma', 'OK'],
    ['Oregon', 'OR'],
    ['Pennsylvania', 'PA'],
    ['Rhode Island', 'RI'],
    ['South Carolina', 'SC'],
    ['South Dakota', 'SD'],
    ['Tennessee', 'TN'],
    ['Texas', 'TX'],
    ['Utah', 'UT'],
    ['Vermont', 'VT'],
    ['Virginia', 'VA'],
    ['Washington', 'WA'],
    ['West Virginia', 'WV'],
    ['Wisconsin', 'WI'],
    ['Wyoming', 'WY'],
];

  const countryNames = [
    ['Canada', 'CA'],
    ['France', 'FR'],
    ['Germany','DE'],
    ['Japan',  'JP'],
];

let searchCountry = "US";
let searchCountryName = "USA";
let searchState = "";
let searchCity = "";
let searchKindId = "";




// ==================================================
// GLOBAL VARIABLES
// ==================================================

// Search Variables
// --------------------------------------------------

/* Base url for OpenTripMap Places API */
var api_url_places = "https://opentripmap-places-v1.p.rapidapi.com/en/places/";
/* Base url for openWeather 5-day Forecast API */
var api_url_weather = "http://api.openweathermap.org/data/2.5/forecast\?";
/* The settings to pass to the Ajax handler for the OpenTripMap Places API */
var api_settings_places = {
        "async": true,
        "crossDomain": true,
        "url": "",
        "method" : "GET",
        "headers": {
            "x-rapidapi-host": "opentripmap-places-v1.p.rapidapi.com",
            "x-rapidapi-key" : "1e3ad4ad08msh37dbc7f86166d8ap13837fjsncab8be83f428"
        }
    }

/* The collection of objects containing place information returned by the APIs */
var searchResults = [];





// ==================================================
// AJAX CALLERS
// ==================================================

/**
 * @function getForecast 
 * 
 * @param {Object} a_parameters An object with properties City, State, Country
 * 
 * @description Gets the forecast for the passed city information and calls @see getPlaces
 */
function getForecast(a_parameters){
    
    // The base weather url 
    let t_url = api_url_weather;
  
    // Add query to url
    t_url += "q=" + a_parameters.city;
  
    // Add API Key and units parameter
    t_url += "&appid=14dcce84f7b94920cbe9d542aace61ee&units=imperial";
  
    // Make Ajax call to openWeather
    $.ajax({
        "url": t_url,
        "method": "GET"
    }).then(function(response){
        // Grab relevant data
        var t_return = {
            "lat": response.city.coord.lat,
            "lon": response.city.coord.lon
        }

        // Get places in the area
        getPlaces(t_return);
    });
}

/**
 * @function getPlaces
 * 
 * @param {Response} a_response A response from the OpenTripMap Places method GetPlacesByRadius
 * 
 * @description Takes a response from the API and calls @see getPlaceInfo on each feature returned
 */
function getPlaces(a_response){

    // Base places url
    let t_url = api_url_places;

    // Add parameters to url
    t_url += "radius?radius=500";
    t_url += "&lon=" + a_response.lon + "&lat=" + a_response.lat;

    // Update url in settings
    api_settings_places.url = t_url;
    
    // Make Ajax call to OpenTripMap Places 
    $.ajax(api_settings_places).then(function(a_response2){

        // For each returned place
        for(let i = 0; i < a_response2.features.length; i++){
            // Store place info
            getPlaceInfo(a_response2.features[i].properties.xid);
        }
    });
}

/**
 * @function getPlaceInfo
 * 
 * @param {String} a_placeId The xid of the place
 * 
 * @description Takes an object containing information retrieved from the OpenTripMap Places API and pushes it to searchResults 
 */
function getPlaceInfo(a_placeId){
    // Helper variables to return
    var t_return;

    // Base places url
    let t_url = api_url_places;
    
    // Add parameters to url
    t_url += "xid/" + a_placeId;

    // Update settings 
    api_settings_places.url = t_url;

    // Make Ajax call to OpenTripMap Places
    $.ajax(api_settings_places).then(function(a_response){

        // Get relevant properties from a_response
        var t_info ={"name": a_response.name, "kinds": a_response.kinds }  

        // Get possible properties
        if(a_response["address"]){ t_info["address"] = a_response["address"]; }
        if(a_response["wikipedia_extracts"]){ t_info["description"] = a_response["wikipedia_extracts"].text; }

        // If place has a name
        if(t_info.name != null && t_info.name != ""){
            searchResults.push(t_info);
        }

    });
}





// ==================================================
// DISPLAY FUNCTIONS
// ==================================================
//Fake result 1
var response1 = {"name": "Kelsey Museum of Archaeology",
"imageURL": "https://commons.wikimedia.org/wiki/File:Nickels_Arcade_at_night.jpg",
"placeURL":"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.gSNCdRYeQKULxd5CDPUfmwHaFj%26pid%3DApi&f=1",
"kinds":"museums,archaeological_museums,cultural,interesting_places,history_museums",
"description":"Lorem ipsum",
"conditions": ["hot","cold","rainy","snowy"]}

// Fake result 2
var response2 = {"name": "Nickels Arcade",
"imageURL": "https://commons.wikimedia.org/wiki/File:Nickels_Arcade_at_night.jpg",
"kinds":"historic_architecture,architecture,interesting_places,other_buildings_and_structures",
"description": "Nickels Arcade is a commercial building located at 326-330 South State Street in Ann Arbor, Michigan. It was listed on the National Register of Historic Places in 1987. The building is notable as perhaps the only remaining example in Michigan of a free-standing commercial arcade building that was popularized by the Cleveland Arcade.",
"conditions": ["hot","cold","rainy","snowy"]}

// Array of search results
var responseArray = [response1, response2,response1, response2,response1, response2,response1, response2,response1, response2];

// ==================================================
// EVENT HANDLERS
// ==================================================


// ==================================================
// RUNTIME
// ==================================================
$(document).ready(function () {
   
    //Dynamically build dropdown options list for countries
    setCountry();

    //Dynamically build dropdown options list for the states
    setStates();
 
    //If user updated country, grab the country from the select country dropdown box
    $("#input-select-country").change(function(){
        searchCountry = $(this).find("option:selected").val(); 
        searchCountryName = $(this).find("option:selected").text();
        console.log ("You have selected the country - " + searchCountry);
        if (searchCountry !== "US") {
            $ ("#input-group-state").hide();
            $ ("#input-group-state").val('')
        }else{
            $ ("#input-group-state").show() 

        }
        
    });

    //If user selected state, grab the state from the select state dropdown box
    $("#input-select-state").change(function(){  
        let searchState = $(this).find("option:selected").val();   
        let searchStateName = $(this).find("option:selected").text();   
        console.log ("Name:" + searchStateName) 
        console.log ("Value:" + searchState)  
    });    

    //If user clicks on interest (kind), then select this list-group item
      $('.list-group-item').click(function(e) {
         e.preventDefault();
         $(this).addClass('active').siblings().removeClass('active');        
            searchKindId = $(this).attr("data-target");
            console.log("ActiveID selected before search: " + searchKindId);
     });

    //Deliver API search parameters when SEARCH button is clicked
    $("#search-btn").click(function (event) {
        event.preventDefault();

        // Clear search results
        searchResults = [];

         //grab search country from the select country dropdown box
         let searchCountry = $("#input-select-country").val().trim();

         //grab search state from the select state dropdown box
         let searchState = $("#input-select-state").val().trim();       

         if (searchCountry !== "US") {
             searchState = ""
             $ ("#input-group-state").val('')
         }

        //grab search city from input field
         let searchCity = $("#input-text-city").val().trim();
         if (searchCity === ''){
            alert('City can not be left blank');  //remove
            
         }

         //grab the interest/kind that user selected
         if (searchKindId === "") {
            searchKindId = $("#list-kinds li.active").attr("data-target");
            
        }
        
        // The kinds of places to return
        var searchKind = $("#list-kinds li.active").text();

         console.log ("Search button was clicked!");
         console.log ("You have entered the city name - " + searchCity);
         console.log ("You have selected the state - " + searchState);
         console.log ("You have selected the country - " + searchCountry);      
         console.log ("You have selected the kindID - " + searchKindId);
         console.log ("You have selected the kind - " + searchKind);

         displayCityHeader (searchCity, searchState, searchCountryName, searchKind);

        // handleWeatherRequest("Forecast",{"city": "Tokyo", "country": "JP"})

         //   handleWeatherRequest("Weather",{"city": searchCity})
         //http://api.openweathermap.org/data/2.5/weather?q=Chicago&appid=14dcce84f7b94920cbe9d542aace61ee&units=imperial
         //   console.log (response);
         
         
            // currentWeather(searchCity);
        
         // fiveDayForecast(searchCity);
        // Combine search paremters into an object
        var t_searchParameters = {"city": searchCity}
        if(searchState != "" && searchState != null && searchState != "Choose..." && searchCountry === "US"){ t_searchParameters["state"] = searchState; }
        if(searchCountry != "" && searchCountry != null){ t_searchParameters["country"] = searchCountry;}
        console.log(t_searchParameters);

        // Gets the forecast, and calls methods to get places
        getForecast(t_searchParameters);
    });
    function  displayCityHeader (searchCity, searchState, searchCountryName, searchKind){
        
        let cityHeader = ""
        if (searchCountryName === "USA") {
            cityHeader = $("#orange").html("<h4>Explore " + searchKind + " in " + searchCity + ", "  + searchState + "</h4>");
        }else{
            cityHeader = $("#orange").html("<h4>Explore " + searchKind + " in " + searchCity + ", "  + searchCountryName+ "</h4>");
        }
         $("container").append(cityHeader);
        
    };

    //Dynamically build dropdown options list for the country
    function setCountry(){
        let selectCountry = document.getElementById("input-select-country");
        for (var i = 0; i < countryNames.length; i++) {
            var option = document.createElement("option");
            option.text = countryNames[i][0];
            option.value = countryNames[i][1];
            selectCountry.add(option);
        }   
    }

    //Dynamically build dropdown options list for the US States
    function setStates(){
        
	    selectState = document.getElementById("input-select-state");
	    
	    for (var i = 0; i < states.length; i++) {
            var option = document.createElement("option");           
            option.text = states[i][0];
            option.value = states[i][1];          
            selectState.add(option);
        }   
    }
})