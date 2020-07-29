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
let searchStateName = "";
let searchCity = "";
let searchKindId = "";
var forecastArray = [];



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
/* The forecast for the search city */
var cityForecast = [];




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
            "lon": response.city.coord.lon,
        }
        
        // Get forecast
        cityForecast = response.list;

        //Display weather forecast
        displayForecast (cityForecast);  
        
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
            displayPlace(t_info);
        }

    });
}

// ==================================================
// DISPLAY FUNCTIONS
// ==================================================


//Display a header for the results based on parameters passed
 function  displayCityHeader (searchCity, searchState, searchCountryName, searchKind){
        
    let cityHeader = "";
    $("#results-header").empty();
    if (searchCountryName === "USA") {
        if (searchState !=="") {
            cityHeader = $("#results-header").html("Explore " + searchKind + " in " + searchCity + ", "  + searchState);
        }else{
            cityHeader = $("#results-header").html("Explore " + searchKind + " in " + searchCity); 
        }    
    }else{
        cityHeader = $("#results-header").html("Explore " + searchKind + " in " + searchCity + ", "  + searchCountryName);
    }
     $("#results-header").append(cityHeader);
 };
   
function currentWeather (searchCity){

        var APIKey = "b842e13062ebcdc52faeb1014bc3a489";
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchCity + "&appid=" + APIKey;
        console.log("Weather Query: " + queryURL);

        //ajax call for local weather
        $.ajax({
          url: queryURL,
          method: "GET"
        }).then(function(response) {
            console.log("Weather response: ")
            console.log(response)
            // Convert the temp to fahrenheit
            let tempF = (response.main.temp - 273.15) * 1.80 + 32;
            let roundedTemp = Math.floor(tempF);
            $("#destination-info").empty();
         
            //temp elements added to html
            // let tempDataF = $("<p>").text("Temp: " + roundedTemp + "F");
            // let windData = $("<p>").text("Wind: " + response.wind.speed + "mph");
            var iconCode = response.weather[0].icon;
            var iconUrl = "https://openweathermap.org/img/wn/" + iconCode + ".png";
            let weatherImg = $("<img>").attr("src", iconUrl);
            //cityData.append(weatherImg, tempDataF, windData );
            var cityData = "<tr><td>" + response.name + " weather today: " + "T - " + roundedTemp + "F,  W - " + response.wind.speed + "mph</td></tr>";
            //var cityData = "<p>" + response.name + " weather today: T: " + roundedTemp +  + "F  W: " + response.wind.speed + "mph";
            console.log(cityData);
            // cityData.append(weatherImage);
            $("#destination-info").append(weatherImg);

            $("#destination-info").append(cityData);

    }); //function response
}; //currentWeather

//$(".city").html("<h1>" + response.name + " Weather</h1>");
//cityData.append(weatherImg, windData, humidityData, tempData, tempDataF);
//$("container").append(cityData);

// let item1Group = $(".wrapper").addClass("item-group")
// var item1Header = $("#list-item-1").html(response1.name);
// var item1Desc = $("<p>").text(response1.description);
// item1Group.append(item1Header, item1Desc);
// $("container").append(item1Text);
// $("#list-item-1").html(response1.name);
// $("#list-desc-1").html(response1.description);
// $("#list-item-2").html(response2.name);
// $("#list-desc-2").html(response2.description);
//      $("container").append(cityHeader);

//Function to display 5 day weather forecast
function displayForecast (cityForecast){

    console.log ("city forecast from displayForecast");
    console.log (cityForecast)

    var iconUrl = "https://openweathermap.org/img/wn/" 
    var png_suffix = ".png";
    var wind_suffix = "mph";
    var temp_suffix = "F";

    //Empty the div holders
    $("#destination-info").empty();
    $("#display-weather").empty();

    // For each day of the 
    for(let i = 0; i < 5; i++){
           
        // Store data in the array
        forecastArray[i] = {
            day: moment(cityForecast[8 * i].dt_txt).format("dddd"),                     //Tuesday, Wednesday, Thursday
            date: (cityForecast[8 * i].dt_txt).slice(8,10),                             //date number only
            dayImage: iconUrl + cityForecast[8 * i + 6].weather[0].icon + png_suffix,   //image
            tempHigh: cityForecast[8 * i + 6 ].main.temp_max + temp_suffix,             //max temp at 15:00
            wind: cityForecast[8 * i + 6].wind.speed + wind_suffix                      //wind
        };
    }//end of for loop for 5 days

    console.log ("forecastArray: ");
    console.log (forecastArray[0].day,forecastArray[1].day,forecastArray[2].day);
    console.log (forecastArray[0].date,forecastArray[1].date,forecastArray[2].date);
    console.log (forecastArray[0].tempHigh,forecastArray[1].tempHigh,forecastArray[2].tempHigh,forecastArray[3].tempHigh,forecastArray[4].tempHigh);
    console.log (forecastArray[0].dayImage,forecastArray[1].dayImage,forecastArray[2].dayImage);
    console.log (forecastArray[0].wind,forecastArray[1].wind,forecastArray[2].wind);

    //let dispImg = "";
    var dispImg
    let dispTemp = "";
    let dispWind = "";
    let dispDate = "";
    let dispDay = "";
    let dispCol1 = "";
    let dispCol2 = "";
    let dispRow1 = "";
    let dispRow2 = "";
    let dispRowfull1 = "";
    let dispRowfull2 = "";

     // For each of the next 5 days
    for(let i = 0; i < 5; i++){

        //dispImg = $("<img>").attr("src", forecastArray[i].dayImage);
        dispImg = "<img src=" + forecastArray[i].dayImage + ">"         //weather image for the day
        console.log ("disp Image")
        console.log (dispImg)
        dispTemp = forecastArray[i].tempHigh;                           //display temp
        dispWind = forecastArray[i].wind;                               //display wind
        dispDate = forecastArray[i].date;                               //display date number as 'dd' format
        dispDay = forecastArray[i].day;                                 //display day of the week
        dispCol1 = "<td width= 15%>" + dispDay + ", " + dispDate + dispImg + "</td>";
        dispCol2 = "<td width= 15%>"+ "T: " + dispTemp + " ,W: " + dispWind + "</td>";
        
        dispRow1 = dispRow1 + dispCol1;
        dispRow2 = dispRow2 + dispCol2;
     }//end of for loop

     dispRowfull1 = "<tr>" + dispRow1 + "</tr>"; //assemble row 1
     dispRowfull2 = "<tr>" + dispRow2 + "</tr>"; //assemble row 2
     dispRowfull = dispRowfull1 + dispRowfull2;  //assemble content
   
     //load weather div with the content
     $("#display-weather").html(dispRowfull);    
        
}//end of displayForecast

//
function displayPlace(a_placeInfo){
    // Create wrapper div
    var t_displayDiv = $("<div>");

    // Create the text sections
    var t_header = $("<h4>").text(a_placeInfo.name);

    // Create the address section   
    var t_address = $("<span>");
    var t_string = "";
    // Add house name
    if(a_placeInfo.address["house"]){t_string += a_placeInfo.address["house"]}
    // Add street number
    if(a_placeInfo.address["house_number"] && a_placeInfo.address["house"]){ t_string += ", " + a_placeInfo.address["house_number"]}
    else if(a_placeInfo.address["house_number"]){ t_string += a_placeInfo.address["house_number"]; }
    // Add the road
    if(a_placeInfo.address["road"]){ t_string += a_placeInfo.address["road"]; }

    // Add the address text
    t_address.text(t_string);
    
    // Create the description section
    var t_description = $("<p>").text(a_placeInfo.description);

    // Append to wrapper div
    t_displayDiv.append(t_header).append(t_address).append(t_description);

    // Append to results div
    $("#results-wrapper").append(t_displayDiv);
}

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

         //grab the id of the interest/kind user selected
         if (searchKindId === "") {
            searchKindId = $("#list-kinds li.active").attr("data-target");
            
        }
        
        // grab the name of the interest/kind user selected
        var searchKind = $("#list-kinds li.active").text();

         console.log ("Search button was clicked!");
         console.log ("You have entered the city name - " + searchCity);
         console.log ("You have selected the state - " + searchState);
         console.log ("You have selected the country - " + searchCountry);      
         console.log ("You have selected the kindID - " + searchKindId);
         console.log ("You have selected the kind - " + searchKind);

         //currentWeather(searchCity);
         
         //Display header for the search results based on the parameters entered
         displayCityHeader (searchCity, searchState, searchCountryName, searchKind);

        // Combine search paremters into an object
        var t_searchParameters = {"city": searchCity}
        if(searchState != "" && searchState != null && searchState != "Choose..." && searchCountry === "US"){ t_searchParameters["state"] = searchState; }
        if(searchCountry != "" && searchCountry != null){ t_searchParameters["country"] = searchCountry;}

        // Gets the forecast, and calls methods to get places
        getForecast(t_searchParameters);
        
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