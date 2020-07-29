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
var filterConditions = "";



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

/** Tracks how many accordion tabs have been created */
var numberTabs = 0;
/** Currently selected results tab */
var checkedTab = null;

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
    t_url += "radius?kinds=" + searchKindId + "&radius=5000";
    t_url += "&lon=" + a_response.lon + "&lat=" + a_response.lat;
    console.log(t_url);

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

     console.log ("city header");
     console.log (cityHeader)
    let cityInfo = "";
    $("#destination-info").empty();
    if (searchCountryName === "USA") {
        if (searchState !=="") {
            cityInfo = $("#destination-info").html("Weather forecast in " + searchCity + ", "  + searchState);
        }else{
            cityInfo = $("#destination-info").html("Weather forecast in " + searchCity); 
        }    
    }else{
        cityInfo = $("#destination-info").html("Weather forecast in " + searchCity + ", "  + searchCountryName);
    }
     $("#destination-info").append(cityInfo);
     console.log (cityInfo);

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

    // For each day of the displayed weather
    for(let i = 0; i < 6; i++){
           
        // Store data in the array
        forecastArray[i] = {
            day: moment(cityForecast[7 * i].dt_txt).format("dddd"),                     //Tuesday, Wednesday, Thursday
            date: (cityForecast[7 * i].dt_txt).slice(8,10),                             //date number only
            dayImage: iconUrl + cityForecast[7 * i].weather[0].icon + png_suffix,       //image
            tempHigh: Math.round(cityForecast[7 * i].main.temp_max) + temp_suffix,      //max temp
            wind: Math.round(cityForecast[7 * i].wind.speed) + wind_suffix              //wind
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
    let dispRow3 = "";
    let dispRowfull1 = "";
    let dispRowfull2 = "";
    let dispTable = "";

     // For each of the next 5 days
    for(let i = 0; i < 6; i++){

        //dispImg = $("<img>").attr("src", forecastArray[i].dayImage);
        dispImg = "<img src=" + forecastArray[i].dayImage + ">"         //weather image for the day
        dispTemp = forecastArray[i].tempHigh;                           //display temp
        dispWind = forecastArray[i].wind;                               //display wind
        dispDate = forecastArray[i].date;                               //display date number as 'dd' format
        dispDay = forecastArray[i].day;                                 //display day of the week
        dispCol1 = "<td class='w-td'>" + dispImg + dispDay + ", " + dispDate +  "</td>";
        dispCol2 = "<td class='w-td'>"+ "Temp: " + dispTemp + "</td>";
        dispCol3 = "<td class='w-td'>" + "Wind: " + dispWind + "</td>";
        
        dispRow1 = dispRow1 + dispCol1;
        dispRow2 = dispRow2 + dispCol2;
        dispRow3 = dispRow3 + dispCol3;
     }//end of for loop

     dispRowfull1 = "<tr>" + dispRow1 + "</tr>"; //assemble row 1
     dispRowfull2 = "<tr>" + dispRow2 + "</tr>"; //assemble row 2
     dispRowfull3 = "<tr>" + dispRow3 + "</tr>"; //assemble row 3
     dispRowfull = dispRowfull1 + dispRowfull2 + dispRowfull3;  //assemble content
     dispTable = "<table id='weather-table'>" + dispRowfull + "</table>";

     //load weather div with the content
     $("#display-weather").html(dispTable); 
     
     $("td").on("click",function(){

     });
        
}//end of displayForecast

/**
 * @function displayPlace
 * 
 * @param {Object} a_placeInfo An object with the properties relating to information retrieved through the API
 * 
 * @description Display an object with the place info
 */
function displayPlace(a_placeInfo){
    // Increment tabs counter
    numberTabs++;

    // Create wrapper div
    var t_displayDiv = $("<div>").addClass("tab w-full overflow-hidden border-t");

    // Create the toggler
    var t_button = $("<input>").addClass("absolute opacity-0").attr("id","tab-single-" + numberTabs).attr("type","radio").attr("name","results-button");

    // Create the header section
    var t_header = $("<label>").text(a_placeInfo.name).addClass("block leading-normal cursor-pointer mb-0").attr("for","tab-single-" + numberTabs);

    // Create body div
    var t_bodyDiv = $("<div>").addClass("tab-content overflow-hidden leading-normal scrollable");

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
    t_bodyDiv.append(t_address).append(t_description);
    t_displayDiv.append(t_button).append(t_header).append(t_bodyDiv);

    // Append to results div
    $("#results-wrapper").append(t_displayDiv);

    // Add click listener to button
    $(t_button).on("click",function(){
        if(this != checkedTab){
            checkedTab = this;
            this.checked = true;
        }
        else{
            this.checked = false;
            checkedTab = null;
        }
    });
}

/**
 * @function displayErrorModal
 * 
 * @param {String} a_error The type of error that occured
 * 
 * @param {String} a_message A message informing the user the details of the error
 * 
 * @description Displays a modal informing the user an error occured
 */
function displayErrorModal(a_error,a_message){
    // Create wrapper div
    var t_modalDiv = $("<div>").addClass("error-modal");

    // Create header div
    var t_headerDiv = $("<div>").addClass("modal-header");
    var t_header = $("<h2>").addClass("modal-header-text").text("ERROR: " + a_error);
    t_headerDiv.append(t_header);

    // Create body div
    var t_bodyDiv = $("<div>").addClass("modal-body").append($("<p>").text(a_message));

    // Assemble modal
    t_modalDiv.append(t_headerDiv).append(t_bodyDiv);

    $(t_modalDiv).on("click",function(){
        $(t_modalDiv).remove();
    });

    // Append modal to body
    $(document.body).append(t_modalDiv);
}

// ==================================================
// EVENT HANDLERS
// ==================================================

/**
 * 
 * 
 */
function handleCollapseButtonClick(a_event){
    a_event.preventDefault();
    // Store icon svgs
    var collapse_icon = "<svg width='100\%' height='1em' viewBox='0 0 16 16' class='bi bi-arrows-collapse' fill='currentColor' xmlns='http://www.w3.org/2000/svg'><path fill-rule='evenodd' d='M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8zm6-7a.5.5 0 0 1 .5.5V6a.5.5 0 0 1-1 0V1.5A.5.5 0 0 1 8 1z'/><path fill-rule='evenodd' d='M10.354 3.646a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L8 5.293l1.646-1.647a.5.5 0 0 1 .708 0zM8 15a.5.5 0 0 0 .5-.5V10a.5.5 0 0 0-1 0v4.5a.5.5 0 0 0 .5.5z'/><path fill-rule='evenodd' d='M10.354 12.354a.5.5 0 0 0 0-.708l-2-2a.5.5 0 0 0-.708 0l-2 2a.5.5 0 0 0 .708.708L8 10.707l1.646 1.647a.5.5 0 0 0 .708 0z'/></svg>";
    var expand_icon = "<svg width='100\%' height='1em' viewBox='0 0 16 16' class='bi bi-arrows-expand' fill='currentColor' xmlns='http://www.w3.org/2000/svg'/><path fill-rule='evenodd' d='M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8zm6-1.5a.5.5 0 0 0 .5-.5V1.5a.5.5 0 0 0-1 0V6a.5.5 0 0 0 .5.5z'/><path fill-rule='evenodd' d='M10.354 3.854a.5.5 0 0 0 0-.708l-2-2a.5.5 0 0 0-.708 0l-2 2a.5.5 0 1 0 .708.708L8 2.207l1.646 1.647a.5.5 0 0 0 .708 0zM8 9.5a.5.5 0 0 1 .5.5v4.5a.5.5 0 0 1-1 0V10a.5.5 0 0 1 .5-.5z'/><path fill-rule='evenodd' d='M10.354 12.146a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L8 13.793l1.646-1.647a.5.5 0 0 1 .708 0z'/></svg>";
    
    // Toggle icons
    if($(this).hasClass("collapsed") === true){
        $(a_event.target).html(collapse_icon);
    }
    else if($(this).hasClass("collapsed") === false){
        $(a_event.target).html(expand_icon);
    }
}

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

        // Clear search div
        $("#results-wrapper").empty();

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
            displayErrorModal("Invalid Search Parameters","Please enter a city name"); 
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
        
        // If no results found in 5 seconds, display error
        setTimeout(function(){ if(searchResults.length === 0){ displayErrorModal("No Results Found","The search did not return any places, please enter different parameters and search again."); } },3000);
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

    $(".collapse-button").on("click",handleCollapseButtonClick);

})