

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


Github Workflow:
1. Decide on a task that was assigned to you
2. Create an issue title issue-xx on Github.com to represent your task
3. Type into your git terminal ``` git branch issue-xx ``` to create a branch
4. Type into your git terminal ``` git checkout issue-xx ``` to move to that branch
5. Complete your task and add your code by ``` git add _filename_ ``` 
6. Type into your git terminal ``` git commit -m "A comment here" ``` to commit your changes
7. Type into your git terminal ``` git push --set-upstream origin issue-xx ``` to push your changes to the branch issue-xx
8. Type into your git terminal ``` git checkout dev ``` to move to the dev branch. NEVER move to the master branch, even the project lead will 90% of the time be using the dev branch
9. Type into your git terminal ``` git merge issue-xx ``` to merge your issue branch into the dev branch. 
    - If there is a merge conflict, you aren't communicating. We will have merge conflicts, but our goal is to try as hard as possible to prevent them.
    - In the case of a merge conflict, message the project lead to assit you with rectifying it. If it comes down to having code reverted, the default will be to revert the code the merger is trying to add.
10. Type into your git terminal ``` git push ``` to push your changes 


