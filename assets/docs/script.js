
// configure firebase
var firebaseConfig = {
  apiKey: "AIzaSyCZz0mCv73gPlTZPUpkD9KQtLFMSTs3GYg",
  authDomain: "train-scheduler-25bdb.firebaseapp.com",
  databaseURL: "https://train-scheduler-25bdb.firebaseio.com",
  projectId: "train-scheduler-25bdb",
  storageBucket: "",
  messagingSenderId: "675015774691",
  appId: "1:675015774691:web:379e61471ba886c4ac10d6"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Create a variable to reference the database
const database = firebase.database();
const trainTable = database.ref('trainTable');

// function: compare that allows to sort trains by arrival time
function compare(a, b) {
  const arrivalA = a.nextArrivalVar;
  const arrivalB = b.nextArrivalVar;

  if (arrivalA > arrivalB) {
    return 1;
  } else if (arrivalA < arrivalB) {
    return -1;
  }
  else return 0;
}


// function: input train frequency and first arrival, calculate next arrival
function nextArrivalFromFrequency(trainInterval, initialTime) {

  if (initialTime.length === 4) { // normalize time string to 24h
    initialTime = '0' + initialTime;
  }
  // separate minutes and hours to feed back to moment() since it doesn't seem to like the string as-is
  let initialHours = initialTime.slice(0, 2);
  let initialMinutes = initialTime.slice(3);
  let startTime = moment().hours(initialHours).minutes(initialMinutes);

  // subtract initialTime from current time
  let currentTimeDelta = moment().diff(startTime, 'minutes');

  // divide result by trainInterval
  // if %=0, return "HERE"
  if (parseInt(currentTimeDelta) % trainInterval === 0) {
    return `HERE`;
  }
  else {
    // else floor(result)++, multiply by trainInterval, add to initialTime, return that
    let workingInterval = Math.floor(parseInt(currentTimeDelta) / trainInterval); // arrivals since initial departure
    workingInterval++; // the number of arrivals that will have happened at next arrival
    workingInterval *= trainInterval; // # of arrivals at next arrival * arrival interval = minutes from first arrival to upcoming arrival
    let workingArrival = startTime.add(workingInterval, 'minutes') // add that to the departure time
    workingArrival = workingArrival.format('hh:mm'); // format properly
    return workingArrival;
  }
}

// function: add train data from form on click of register
$('#registerButton').on('click', () => {
  event.preventDefault(); // don't reload the page
  // get form input

  let currentName = $('#trainNameInput').val().trim();
  let currentNumber = parseInt($('#trainNumberInput').val()); // parseInt isn't really necessary but i like it for safety
  let currentInterval = $('#trainFrequencyInput').val();
  let currentArrival = $('#trainArrivalInput').val();

  // make sure currentInterval is in minutes
  if (currentInterval.includes(':')) {
    // some fancy moment.js to make currentInterval = number of minutes (make sure it's a number not a string)
    currentInterval = moment(currentInterval, ['mm:hh', 'm:hh']).format('mm');
    currentInterval = parseInt(currentInterval);
  }
  let calculatedArrival = nextArrivalFromFrequency(currentInterval, currentArrival);
  // clear form values
  $('#trainNameInput').val('Red Line');
  $('#trainNumberInput').val('##');
  $('#trainFrequencyInput').val('H:MM');
  $('#trainArrivalInput').val('HH:MM');

  // push to firebase
  database.ref(`/trainTable/${currentNumber}`).set({
    trainName: currentName,
    trainInterval: currentInterval,
    firstDeparture : currentArrival
  }, function(error) { // throw errors to console
    if (error) console.log(`Firebase write error: ${error}`);
  });
  populateTableRow(currentNumber, currentName, currentInterval, calculatedArrival);

});


// function to populate table row from data. separated from data calls for readability
function populateTableRow(lineNumber, lineName, lineInterval, nextArrival) {
  let rowDiv = $('<tr>'); // make a table row
  rowDiv.attr('trainIndex', lineNumber); // give it the line number as an index so we can kill it if needed

  let thDiv = $(`<th scope="row">`) // make the first column
    .text(lineNumber); // give it the line number
  rowDiv.append(thDiv);
  let tdDiv1 = $('<td>') // next column, line name
    .text(lineName);
  rowDiv.append(tdDiv1);
  let tdDiv2 = $('<td>') // next column, arrival interval
    .text(`${lineInterval} minutes`);
  rowDiv.append(tdDiv2);
  let tdDiv3 = $('<td>') // next column, next arrival time
    .text(nextArrival);
  rowDiv.append(tdDiv3);
  let tdDiv4 = $('<td>') // next column, remove button
    .html(`<button class="removeBtn" trainIndex="${lineNumber}">remove</button></td>`);
  rowDiv.append(tdDiv4);
  $('#tableAnchorDiv').append(rowDiv); // attach the whole thing to the table

}

// function: grab data from firebase
function pullTrainsFromServer() {
  // clear the whole table div first so we don't end up cloning it repeatedly
  $('#tableAnchorDiv').empty();
  let trainSortArray = []; // temporary array, used to sort trains by arrival order
  // loop through the objects on the server
  
  for (let i = 0; i < 4; i++) {
    // get the variables
    // (call nextArrivalFromFrequency('trainFrequency','firstArrival'), store it as nextArrivalVar)
    let lineNumberVar;
    let lineNameVar;
    let lineIntervalVar;
    let nextArrivalVar;
    // create a train object with appropriate keys & push to trainSortArray
    trainSortArray.push({
      lineNumber: lineNumberVar,
      lineName: lineNameVar,
      lineInterval: lineIntervalVar,
      nextArrival, nextArrivalVar
    });
  }

  // once array is populated with all trains, sort it
  trainSortArray.sort(compare);
  // then loop through the sorted array and print each line
  for (let j = 0; j < trainSortArray.length; j++) {
    populateTableRow(trainSortArray[j].lineNumber, trainSortArray[j].lineName, trainSortArray[j].lineInterval, trainSortArray[j].nextArrival);
  }
}


// function: update the clock in the jumbotron every minute
function updateJumboClock() {
  // use momentJS to grab current time
  let currentTime = moment().format('hh:mm');
  // use jquery to print it to the jumbotron div
  $('#jumboTimeAnchorDiv').text(currentTime);
}


// function: remove line from table & firebase on button click
const removeTrainLine = function () {
  let indexVar = $(this).attr('trainIndex'); // pull the line number from the button clicked

  // find corresponding entry on firebase and remove it
  database.ref(`/trainTable/${indexVar}`).remove(function(error) { // throw errors to console
    if (error) console.log(`Firebase delete error: ${error}`);
  });

  // alter the variable to catch the row head & use that to kill the correct row
  //   (once the table population function is up, we can just repopulate from firebase instead)
  indexVar = `[trainIndex=${indexVar}]` // (is now [trainIndex=#])
  $(indexVar).remove();
} // and connect this function to the buttons themselves
$(document).on('click', '.removeBtn', removeTrainLine);

populateTableRow(744, 'Whiterun Express', 59, '1:01');

// function: interval to call updateJumboClock & pullTrainsFromServer every minute
const updateEveryMinute = setInterval(updateJumboClock, 60000);

