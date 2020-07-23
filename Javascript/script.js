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
 * @returns {Response}
 */
function handlePlacesRequest(a_request, a_parameters){
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
    $.ajax(settings).done(function(response){
        console.log(response);
        t_reponse = response;
        return t_response;
    })
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


// ==================================================
// EVENT HANDLERS
// ==================================================


// ==================================================
// RUNTIME
// ==================================================