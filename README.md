# Train Scheduler

## What Is This Thing?
This web app allows users to track and add train schedules. Simple JQuery scripting generates a table that shows all currently stored train lines, how often they arrive at station, and when they'll next arrive in realtime (sorted so that upcoming trains are at the top). Train information is stored on Firebase so it's acessible from anywhere, and users can add or remove lines from the display.

## How Do I Use It?
Simply navigating to the webpage will automatically load any existing trains and begin keeping accurate time. To add trains, fill out and submit the form at the bottom of the page; a validation check will ensure that intervals and arrival times are entered correctly, and the page should immediately refresh. A train line can be removed by clicking its corresponding "remove line" button on the table.

## Are There Problems With It?
A single known bug exists with the sorting function around noon and midnight, when trains scheduled to arrive after 1:00 sort higher than trains arriving earlier at times with higher numbers (generally 11-12). The solution is known and will be implemented in any further patches.

## Who Made It?
All local code was written solely by myself, Mars Getsoian. JQuery, Moment.js, and Bootstrap are the product of their respective communities, and the Firebase server service is provided by Google.
