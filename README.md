# MSU-Project-1
Project 1 for the MSU Fullstack Web Development Bootcamp

User Story: 

<mvp>
GIVEN a location
WHEN a user loads the home page
THEN recommended attractions and weather are displayed
WHEN a location and date range is entered
THEN recommended attractions for the paramaters are displayed
WHEN a user selects an attractions
THEN reviews are displayed to the user
</mvp>

## API Documentation

### OpenTripMap Places API

#### Ajax Calls

User Input => PlacesAPI.GetPlaces => PlacesAPI.GetPlaceInfo => Display To Dom

##### GET Places by Bounding Box
Ajax Settings
- "async" : true
- "crossDomain" : true
- "url" : "https://opentripmap-places-v1.p.rapidapi.com/en/places/bbox?"
    - OPTIONAL:
        - "&kinds="
        - "&rate="
        - "&format="
        - "&limit="
    - REQUIRED:
    - "&lon_min"
    - "&lon_max"
    - "&lat_min"
    - "&lat_max"
- "headers" : {
    - "x-rapidapi-host" : "opentripmap-places-v1.p.rapidapi.com"
    - "x-rapidapi-key" : "1e3ad4ad08msh37dbc7f86166d8ap13837fjsncab8be83f428"}

Response
- "features" : array
    - [index] 
        - "id" : integer
        - "properties" : object
            - "xid" : number
            - "rate" : integer
            - "name" : string
            - "kinds" : string (separated by commas)
            - "wikidata"

##### GET Places by Radius
Ajax Settings
- "async" : true
- "crossDomain" : true
- "url" : "https://opentripmap-places-v1.p.rapidapi.com/en/places/radius?"
    - OPTIONAL:
        - "&kinds="
        - "&format="
        - "&rate="
        - "&limit="
    - REQUIRED:
        - "&lat="
        - "&lon="
- "headers" : {
    - "x-rapidapi-host" : "opentripmap-places-v1.p.rapidapi.com"
    - "x-rapidapi-key" : "1e3ad4ad08msh37dbc7f86166d8ap13837fjsncab8be83f428"}

Response
- "features" : array
    - [index] 
        - "id" : integer
        - "properties" : object
            - "xid" : number
            - "rate" : integer
            - "name" : string
            - "kinds" : string (separated by commas)
            - "wikidata"

##### GET Geographic Coordinates
Ajax Settings
- "async" : true
- "crossDomain" : true
- "url" : "https://opentripmap-places-v1.p.rapidapi.com/en/places/geoname?
    - OPTIONAL:
        - "&country="
    - REQUIRED:
        - "&name="
- "headers" : {
    - "x-rapidapi-host" : "opentripmap-places-v1.p.rapidapi.com"
    - "x-rapidapi-key" : "1e3ad4ad08msh37dbc7f86166d8ap13837fjsncab8be83f428"}

Response
- "country" : string
- "timezone" : string
- "name" : string
- "lon" : number
- "lat" : number 
- "population" : number


##### GET Place Information
Ajax Settings
- "async" : true
- "crossDomain" : true
- "url" : "https://opentripmap-places-v1.p.rapidapi.com/en/places/xid/"
    - REQUIRED:
        - "ObjectID"
- "headers" : {
    - "x-rapidapi-host" : "opentripmap-places-v1.p.rapidapi.com"
    - "x-rapidapi-key" : "1e3ad4ad08msh37dbc7f86166d8ap13837fjsncab8be83f428"}

Response
- "preview" : object
    - "width" : integer
    - "height" : integer
    - "source" : string
- "image" : string
- "sources" : string[] (don't need this)
- "wikipedia_extracts" : object
    - "html" : string
    - "text" : string
    - "title" : string
- "bbox" : object
    - "lat_max" : number
    - "lat_min" : number
    - "lon_max" : number
    - "lon_min" : number
- "kinds" : string
- "url" : string
- "rate" : string
- "name" : string
- "nkinds" : string
- "wikipedia" : string
- "wikidata" : string
- "info" : object
    - "descr" : string
    - "image" : string
    - "src_id" : string
    - "src" : string
    - "web" : string
    - "url" : string
