

Project: Travel Planner 

User: 
AS A person who travels a lot
I WANT TO find activities in my area
SO THAT I can avoid unfavorable weather

APIs:
- openWeather
- places
- yelp GraphQL

Teams:
-- Front End --
<> Ron Pitts
<> Dhurba Gc

-- Back End --
<> Alec Greene
<> Alina Gorelik

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

GIVEN a user decides they want to plan a trip
WHEN they choose a city
THEN a trip object is created
WHEN they choose an attraction
THEN the attraction is saved to their trip 
WHEN the user wants to move an attractions' time
THEN they can drag and drop attractions between planned days


## Github Workflow

1. Decide on a task that was assigned to you
2. Always type into your terminal ``` git fetch ``` to make sure that you have the most up to date code
3. Create an issue title issue-xx on Github.com to represent your task
4. Type into your git terminal ``` git branch issue-xx ``` to create a branch
5. Type into your git terminal ``` git checkout issue-xx ``` to move to that branch
6. Complete your task and add your code by ``` git add _filename_ ``` 
7. Type into your git terminal ``` git commit -m "A comment here" ``` to commit your changes
8. Type into your git terminal ``` git push origin issue-xx ``` to push your changes to the branch issue-xx
9. Type into your git terminal ``` git checkout dev ``` to move to the dev branch. NEVER move to the master branch, even the project lead will 90% of the time be using the dev branch
10. Type into your git terminal ``` git merge issue-xx ``` to merge your issue branch into the dev branch. 
    - If there is a merge conflict, you aren't communicating. We will have merge conflicts, but our goal is to try as hard as possible to prevent them.
    - In the case of a merge conflict, message the project lead to assit you with rectifying it. If it comes down to having code reverted, the default will be to revert the code the merger is trying to add.
11. Type into your git terminal ``` git push ``` to push your changes 

## Project Outline

Epics: Design UI, Create scripts to collect data, Create scripts to display data
Initiatives: Outline UI, Collect and document our APIs, 
Tasks:

Stage 2 Design
- Implement the CSS Interface
- Write code to store user selection data
- Write code to animate or alter DOM elements

## Issue Assignments

Issue-02 --- Create Issue-02 --- Alec Greene
                +++ Stage 1 +++
Issue-03 --- Wireframe Index.html --- Ron Pitts
Issue-04 --- Research APIs --- Alec Greene
Issue-05 --- Create Index.html DOM --- Dhurba DC
Issue-06 --- Design Index.html display Scripts and Test functions --- Alina Gorelik
                +++ Stage 2 +++

                +++ Stage 3 +++