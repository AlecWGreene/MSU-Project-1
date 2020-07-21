// ==================================================
// DOM ELEMENTS
// ==================================================


// ==================================================
// GLOBAL VARIABLES
// ==================================================


// ==================================================
// AJAX CALLERS
// ==================================================

// OpenTripMap Places API
// --------------------------------------------------

class Places_Place{
    constructor(){

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
 * @returns {Response}
 */
function handlePlacesRequest(a_request, a_parameters){
    /** the settings for Ajax */
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": this.url,
        "method" : "GET",
        "headers": {
            "x-rapidapi-host": "opentripmap-places-v1.p.rapidapi.com",
            "x-rapidapi-key" : "1e3ad4ad08msh37dbc7f86166d8ap13837fjsncab8be83f428"
        }
    }

    /** The base url for the API */
    var url = "https://opentripmap-places-v1.p.rapidapi.com/en/places/";
    
    // Depending on the passed request type
    switch(a_request){
        // CASE: Get places by bounding box
        case "PlacesByBBox": 
            // Append command to url
            url += "bbox?";

            // Add optional parameters
            if(a_parameters["kinds"]){ url += a_parameters.kinds; }
            if(a_parameters["rate"]){ url += a_parameters.rate; }
            url += "&format=JSON";
            if(a_parameters["limit"]){ url += a_parameters.limit; }

            // Verify required parameters
            if(a_parameters["lonMin"] 
               && a_parameters["lonMax"] 
               && a_parameters["latMin"] 
               && a_parameters["latMax"]){
                // Add parameters to url
                url += "&lon_min=" + a_parameters.lonMin 
                    + "&lon_max=" + a_parameters.lonMax 
                    + "&lat_min=" + a_parameters.latMin
                    + "&lat_max=" + a_parameters.latMax;
            }
            else{
                // Console log error
                console.log("ERROR: Parameters give to Places API Handler for request: " + a_request + " was not paired with correct parameters: " + a_parameters);
            }

            break;
        // CASE: Get places by location and radius
        case "PlacesByRadius": 
            // Append command to url
            url += "radius?";

            // Add optional parameters
            if(a_parameters["kinds"]){ url += a_parameters.kinds; }
            url += "&format=JSON";
            if(a_parameters["rate"]){ url += a_parameters.rate; }
            if(a_parameters["limit"]){ url += a_parameters.limit; }


            // Verify required parameters
            if(a_parameters["lat"] && a_parameters["lon"]){
                // Add parameters to url
                url += "&lat=" + a_parameters.lat + "&lon=" + a_parameters.lon;
            }
            else{
                // Console log error
                console.log("ERROR: Parameters give to Places API Handler for request: " + a_request + " was not paired with correct parameters: " + a_parameters);
            }
            break;
        // CASE: Get coordinates
        case "Coordinates": 
            // Append command to url
            url += "geoname?";

            // Add optional parameters
            if(a_parameters["country"]){ url += a_parameters.country; }

            // Verify required parameters
            if(a_parameters["name"]){ url += a_parameters.name; }
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
    var t_response;
    $.ajax(settings).done(function(response){
        t_reponse = response;
    })
    return response;
}

function processPlacesResponse(a_response){
    

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
     * @param {Object} a_parameters The parameters to construct the object
     */
    constructor(a_parameters){
        this.name = a_parameters.name;
        this.temp = a_parameters.temp;
        this.wind = a_parameters.wind;
        this.UVIndex = a_parameters.UVIndex;
        this.time = a_parameters.time;
        /** @todo Programatically initialize forecast */
        this.forecast = new CityForecast();
    }
}

/**
 * @class 
 * 
 * @classdesc An object that represents A 5-day forecast
 * 
 * @property {Array<CityForecastDay>} days The array of forecasts, one for each day
 */
class CityForecast{
    /**
     * @constructor
     * 
     * @param {Object} a_parameters
     */
    constructor(a_parameters){
        /** The array of days that have been forecasted */
        this.days = [];

        // For each day
        for(let i = 0; i < 5; i++){
            this.days.push(new CityForecastDay(a_parameters.day1));
        }
    }
}

/**
 * @class
 * 
 * @classdesc A day of forecasts for every 3 hours
 * 
 * @property {Object} date The date of the forecast
 * 
 * @property {Object} weather An array of objects representing weather forecasts, where each property is a 3-hour increment from 00 to 21 hours 
 */
class CityForecastDay{
    /**
     * @constructor
     * 
     * @param {Object} a_parameters The data for the day's forecast, passed as a property array of forecasts
     */
    constructor(a_parameters){
        this.date = a_parameters.date;
        this.weather = {"00": a_parameters.forecasts[0],
                        "03": a_parameters.forecasts[1],
                        "06": a_parameters.forecasts[2],
                        "09": a_parameters.forecasts[3],
                        "12": a_parameters.forecasts[4],
                        "15": a_parameters.forecasts[5],
                        "18": a_parameters.forecasts[6],
                        "21": a_parameters.forecasts[7]}
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
    var url = "api.openweathermap.org/data/2.5/";

    /** The settings for the Ajax call */
    var settings = {"method": "GET", "url": url}

    // Handle request types
    switch(a_request){
        // CASE: Get the current weather 
        case "Weather":
            // Append method call to url
            url += "weather?";
            break;
        // CASE: Get the forecast for the next 5 days
        case "Forecast":
            // Append method call to url
            url += "forecast/climate?";
            break;
        // CASE: Request was not valid
        default:
            console.log("ERROR: The request passed to OpenWeather was not valid:" + a_request);
            return;
    }

    // Verify required parameters
    if(a_parameters["name"]){ url += "q=" + a_parameters.name; }
    else{
        console.log("ERROR: The request passed to OpenWeather " + a_request + "was passed invalid parameters: " + a_parameters);
    }

    // Handle optional parameters
    if(a_parameters["state"]){ url += "," + a_parameters.state; }
    if(a_parameters["country"]){ url += "," + a_parameters.country; }

    // Append API Key to the url
    url += "&appid=14dcce84f7b94920cbe9d542aace61ee";

    // Update URL
    settings.url = url;

    // Make Ajax call
    var t_return;
    $.ajax(settings).then(function(response){
        t_return = response;
    });
    return response;
}

function processWeatherResponse(a_response){

}

// ==================================================
// DISPLAY FUNCTIONS
// ==================================================


// ==================================================
// EVENT HANDLERS
// ==================================================


// ==================================================
// RUNTIME
// ==================================================