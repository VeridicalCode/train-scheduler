# Train Scheduler

## What Is This Thing?
This web app allows users to track and add train schedules. Simple JQuery scripting generates a table that shows all currently stored train lines, how often they arrive at station, and using moment.js, displays a realtime estimate of when each line will next arrive. Train information is stored on Firebase so it's acessible from anywhere, and users can add or remove lines from the display.

## How Do I Use It?
Simply navigating to the webpage will automatically load any existing trains and begin keeping accurate time. To add trains, fill out and submit the form at the bottom of the page; a validation check will ensure that intervals and arrival times are entered correctly, and the page should immediately refresh. A train line can be removed by clicking its corresponding "remove line" button on the table.

## Who Made It?
All local code was written solely by myself, Mars Getsoian. JQuery, Moment.js, and Bootstrap are the product of their respective communities, and the Firebase server service is provided by Google.