// ==================================================
// DOM ELEMENTS
// ==================================================


// ==================================================
// GLOBAL VARIABLES
// ==================================================

// Form Variables
// --------------------------------------------------
const stateNames = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas',
    'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 
    'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 
    'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
    'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 
    'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];

  const countryNames = [
    'Canada', 'France', 'Germany','other'
];

// Cache Variables
// --------------------------------------------------

/** Holds value of API calls */
var lastPlaceSearch, lastWeatherSearch;
/** Bools to track Async methods */
var isSearchingPlaces, isSearchingWeather;

// Search Variables
// --------------------------------------------------
var searchResults = [];

// ==================================================
// AJAX CALLERS
// ==================================================

var weatherResults;
var api_url_places = "https://opentripmap-places-v1.p.rapidapi.com/en/places/";
var api_url_weather = "http://api.openweathermap.org/data/2.5/forecast\?";
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

function searchLocation(a_parameters){
  weatherResults = getForecast(a_parameters);
}

/**
 * 
 * 
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
   
    setCountry();
    setStates();

    let searchCountry = "USA";

    //grab search country from the select country dropdown box
    $("#input-select-country").change(function(){
        searchCountry = $(this).find("option:selected").val(); 
        console.log ("You have selected the country - " + searchCountry);
        if (searchCountry !== "USA") {
            $ ("#input-group-state").hide();
            searchState = "";
        }else{
            $ ("#input-group-state").show() 
        }
        
    });

    //Set Country
    function setCountry(){
        let selectCountry = document.getElementById("input-select-country");
        for (var i = 0; i < countryNames.length; i++) {
            var option = document.createElement("option");
            option.text = countryNames[i];
            option.value = countryNames[i];
            selectCountry.add(option);
        }   
    }

    //Set States
    function setStates(){
        
	    selectState = document.getElementById("input-select-state");
	    
	    for (var i = 0; i < stateNames.length; i++) {
            var option = document.createElement("option");
            option.text = stateNames[i];
            option.value = stateNames[i];
            selectState.add(option);
        }   
    }
})