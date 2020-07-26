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
let searchState = "";
let searchCity = "";
let searchKindId = "";

// Cache Variables
// --------------------------------------------------

/** Holds value of API calls */
var lastPlaceSearch, lastWeatherSearch;
/** Bools to track Async methods */
var isSearchingPlaces, isSearchingWeather;


// ==================================================
// AJAX CALLERS
// ==================================================

// OpenTripMap Places API
// --------------------------------------------------

/**
 * @class
 * 
 * @classdesc The class representation of a place retrieved by the OpenTripMap Places API
 * 
 * @property {string} name The name of the place
 * 
 * @property {string} imageURL The url linking to an image of the place
 * 
 * @property {placeURL} placeURL The url linking to a website for the place
 * 
 * @property {string} description An exerpt from the wikipedia page
 * 
 * @property {Array<string>} conditions The weather conditions to show this place for
 * 
 * @method processObjectId Takes a number representing the xid and makes an API call to retrieve and return the chosen attributes of the place
 */
class Places_Place{
    /**
     * @constructor
     * 
     * @param {Number} a_response The xid of the place
     */
    constructor(a_response){
        // Store the information in the instance
        this.name = a_response.name;
        this.imageURL = a_response.imageURL;
        this.placeURL = a_response.placeURL;
        this.description = a_response.description;
        this.kinds = a_response.kinds;
        this.conditions = a_response.conditions;
    }
}

/**
 * @function handlePlacesRequest
 * 
 * @description A function to handle callls to the OpenTripMap Places API
 * 
 * Enumerated below are the requests and their specific parameters:
 * 
 * "PlacesByBBox" : required{"lonMin", "lonMax", "latMin", "latMax"}, optional{"kinds", "rate", "format", "limit"}; 
 * 
 * "PlacesByRadius" : required{"lat","lon"}, optional{"kinds","format","rate","limit"};
 * 
 * "Coordinates" : required{"name"}, optional{"country"};
 * 
 * "PlaceInfo" : required{"placeId"}
 * 
 * @param {string} a_request one of: "PlacesByBBox", "PlacesByRadius", "Coordinates", "PlaceInfo"
 * 
 * @param {Object} a_parameters A object whose properties are members to pass to the API
 * 
 * @todo Fix kinds parameters
 */
function handlePlacesRequest(a_request, a_parameters){
    // Search is running
    isSearchingPlaces = true;

    /** The base url for the API */
    var url = "https://opentripmap-places-v1.p.rapidapi.com/en/places/";

    /** the settings for Ajax */
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": url,
        "method" : "GET",
        "headers": {
            "x-rapidapi-host": "opentripmap-places-v1.p.rapidapi.com",
            "x-rapidapi-key" : "1e3ad4ad08msh37dbc7f86166d8ap13837fjsncab8be83f428"
        }
    }
    
    // Depending on the passed request type
    switch(a_request){
        // CASE: Get places by bounding box
        case "PlacesByBBox": 
            // Append command to url
            url += "bbox?format=json";

            // Add optional parameters
            if(a_parameters["kinds"]){ url += "&kinds=" + a_parameters.kinds; }
            if(a_parameters["rate"]){ url += "&rate=" + a_parameters.rate; }
            if(a_parameters["limit"]){ url += "&limit=" + a_parameters.limit; }

            // Verify required parameters
            if(a_parameters["lon_min"] 
               && a_parameters["lon_max"] 
               && a_parameters["lat_min"] 
               && a_parameters["lat_max"]){
                // Add parameters to url
                url += "&lon_min=" + a_parameters.lon_min 
                    + "&lon_max=" + a_parameters.lon_max 
                    + "&lat_min=" + a_parameters.lat_min
                    + "&lat_max=" + a_parameters.lat_max;
            }
            else{
                // Console log error
                console.log("ERROR: Parameters give to Places API Handler for request: " + a_request + " was not paired with correct parameters: " + JSON.stringify(a_parameters));
            }

            break;
        // CASE: Get places by location and radius
        case "PlacesByRadius": 
            // Append command to url
            url += "radius?format=json";

            // Add optional parameters
            if(a_parameters["kinds"]){ url += "&kinds=" + a_parameters.kinds; }
            if(a_parameters["rate"]){ url += "&rate=" + a_parameters.rate; }
            if(a_parameters["limit"]){ url += "&limit=" + a_parameters.limit; }


            // Verify required parameters
            if(a_parameters["lat"] && a_parameters["lon"] && a_parameters["radius"]){
                // Add parameters to url
                url += "&radius=" + a_parameters.radius + "&lat=" + a_parameters.lat + "&lon=" + a_parameters.lon;
            }
            else{
                // Console log error
                console.log("ERROR: Parameters give to Places API Handler for request: " + a_request + " was not paired with correct parameters: " + JSON.stringify(a_parameters));
            }
            break;
        // CASE: Get coordinates
        case "Coordinates": 
            // Append command to url
            url += "geoname?format=json";

            // Add optional parameters
            if(a_parameters["country"]){ url += "&country=" + a_parameters.country; }

            // Verify required parameters
            if(a_parameters["name"]){ url += "&name=" + a_parameters.name; }
            else{
                // Console log error
                console.log("ERROR: Parameters give to Places API Handler for request: " + a_request + " was not paired with correct parameters: " + a_parameters);
            }
            break;
        // CASE: Get place information
        case "PlaceInfo": 
            // Append command to url
            url += "xid/";

            // Verify required parameters
            if(a_parameters["placeId"]){ url += a_parameters.placeId; }
            else{
                // Console log error
                console.log("ERROR: Parameters give to Places API Handler for request: " + a_request + " was not paired with correct parameters: " + a_parameters);
            }
            break;
        // DEFAULT: A valid request was not passed
        default:
            // Console log error
            console.log("ERROR: Request to Places API Handler was not a valid commend: " + a_request);
            return;
    }

    // Update settings URL
    settings.url = url;

    // Return API response
    var t_response = null;
    $.ajax(settings).done(function(a_response){
        console.log(a_response);
        
        // If the request was for place info
        if(a_request === "PlaceInfo"){
            lastPlaceSearch = new Places_Place(a_response);
        }

        // Search over
        isSearchingPlaces = false;
    })
}

async function searchLocation(a_parameters){
    // Create parameter object
    var t_params = {
        "limit": 20
    }

    // Call Places Ajax handler
    handlePlacesRequest("PlacesByRadius", );

    // Wait for Ajax call to finish
    await !isSearchingPlaces;
}



// OpenWeather API
// --------------------------------------------------

/**
 * @class
 * 
 * @classdesc An object representing the weather data for a city
 * 
 * @property {string} name The city name
 * 
 * @property {number} temp The temperature in Fahrenheit
 * 
 * @property {number} wind The wind speed
 * 
 * @property {number} UVIndex The UV Index
 * 
 * @property {number} time The last time the weather was updated
 * 
 * @property {CityForecast} forecast The 5 day forecast for the city
 */
class CityWeather{
    /**
     * @constructor
     * 
     * @param {Object} a_response The parameters to construct the object, typically a response to the OpenWeather 5-day forecast API
     */
    constructor(a_response){
        // Store city name
        this.name = a_response.city.name;
        
        // The coordinates of the area
        this.coordinates = {"lat": a_response.city.coord.lat, "lon": a_response.city.coord.lon}

        // The forecast of the area
        this.forecast = [];

        // For each of the 5 days
        for(let i = 0; i < 5; i++){
            // Initialize the ith array
            this.forecast[i] = [];

            // For each forecast
            for(let j = 0; j < 8; j++){
                // Store an object of data at i,j in forecast
                this.forecast[i][j] = {
                    "time": a_response.list[8 * i + j].dt_txt,
                    "temp": a_response.list[8 * i + j].main.temp,
                    "wind": a_response.list[8 * i + j].wind.speed,
                    "conditions": a_response.list[8 * i + j].weather[0].description,
                    "conditionsIcon": a_response.list[8 * i + j].weather[0].icon
                }
            }
        }
    }
}

/**
 * @function handleWeatherRequest
 * 
 * @description Handles requests to the OpenWeather API 
 * 
 * @param {string} a_request one of: "Weather", "Forecast"
 * 
 * @param {Object} a_parameters An object whose properties are parameters to pass to the API
 * 
 * @returns {Response}
 */
function handleWeatherRequest(a_request, a_parameters){
    /** URL for the OpenWeather API */
    var url = "http://api.openweathermap.org/data/2.5/";

    /** The settings for the Ajax call */
    var settings = {"method": "GET", "url": url}

    // Handle request types
    switch(a_request){
        // CASE: Get the current weather 
        case "Weather":
            // Append method call to url
            url += "weather\?";
            break;
        // CASE: Get the forecast for the next 5 days
        case "Forecast":
            // Append method call to url
            url += "forecast\?";
            break;
        // CASE: Request was not valid
        default:
            console.log("ERROR: The request passed to OpenWeather was not valid:" + a_request);
            return;
    }

    // Verify required parameters
    if(a_parameters["city"]){ url += "q=" + a_parameters.city; }
    else{
        console.log("ERROR: The request passed to OpenWeather " + a_request + "was passed invalid parameters: " + a_parameters);
    }

    // Handle optional parameters
    if(a_parameters["state"]){ url += "," + a_parameters.state; }
    if(a_parameters["country"]){ url += "," + a_parameters.country; }

    // Append API Key to the url
    url += "&appid=14dcce84f7b94920cbe9d542aace61ee&units=imperial";

    // Update URL
    settings.url = url;
    console.log(url);

    // Make Ajax call
    var t_return;
    $.ajax(settings).then(function(response){
        console.log(response);
        var t_cityWeather = new CityWeather(response);
        console.log(t_cityWeather);
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

    //Deliver API search parameters when search button is clicked
    $("#search-btn").click(function (event) {
        event.preventDefault();

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
            alert('City can not be left blank');
         }

         //grab the interest/kind that user selected
         if (searchKindId === "") {
            searchKindId = $("#list-kinds li.active").attr("data-target");
            
        }
        
        var searchKind = $("#list-kinds li.active").text();

         console.log ("Search button was clicked!");
         console.log ("You have entered the city name - " + searchCity);
         console.log ("You have selected the state - " + searchState);
         console.log ("You have selected the country - " + searchCountry);      
         console.log ("You have selected the kindID - " + searchKindId);
         console.log ("You have selected the kind - " + searchKind);

        // handleWeatherRequest("Forecast",{"city": "Tokyo", "country": "JP"})

         //   handleWeatherRequest("Weather",{"city": searchCity})
         //http://api.openweathermap.org/data/2.5/weather?q=Chicago&appid=14dcce84f7b94920cbe9d542aace61ee&units=imperial
         //   console.log (response);
         
         
            // currentWeather(searchCity);
        
         // fiveDayForecast(searchCity);

         // updateHistory(searchCity);
    });

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