
// configure firebase
// var firebaseConfig = {
//     apiKey: "AIzaSyDUFBnk0g50xY6erYx5KYoQ8QmpIl--_dA",
//     authDomain: "employee-database-demo.firebaseapp.com",
//     databaseURL: "https://employee-database-demo.firebaseio.com",
//     projectId: "employee-database-demo",
//     storageBucket: "employee-database-demo.appspot.com",
//     messagingSenderId: "510051634331",
//     appId: "1:510051634331:web:e58d81952356f365"
//   };
// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);

// // Create a variable to reference the database
// const database = firebase.database();


// function: input train frequency and first arrival, calculate next arrival
const nextArrivalFromFrequency = function(trainInterval, initialTime) {
  // momentJS: find current time (for dryness probably can fold this in with the clock update)
  // subtract initialTime from current time
  // divide result by trainInterval
  // if %=0, return "HERE"
  // else floor(result)++, multiply by trainInterval, add to initialTime, return that
}

// function: add train data. TODO: make this a nameless onclick event on the submit button
const pushNewTrainToServer = function() {
  // get form input
  // push to firebase
  // call pullTrainsFromServer()
}

// function to populate table row from data. separated from data calls for readability
const populateTableRow = function(index, lineNumber, lineName, lineInterval, nextArrival){
  let rowDiv = $('<tr>'); // make a table row
  rowDiv.attr('trainIndex', index); // give it the property trainIndex with value i

  let thDiv = $('<th scope="row">') // make the first column
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
                .html(`<button class="removeBtn" trainIndex="${index}">remove</button></td>`);
  rowDiv.append(tdDiv4);
  $('#tableAnchorDiv').append(rowDiv);

}

// function: grab data from firebase
const pullTrainsFromServer = function() {
  // clear the whole table div first so we don't end up cloning it repeatedly
  $('#tableAnchorDiv').empty();

  // each train will be an object with properties {'lineName', 'trainFrequency', 'firstArrival'}
  // loop through the objects on the server
  for (let i = 0; i < number; i++){
    // get the variables
    let lineNumberVar;
    let lineNameVar;
    let lineIntervalVar;
    let nextArrivalVar;
    

  // call nextArrivalFromFrequency('trainFrequency','firstArrival'), store it as nextArrivalVar
  // make a row for this train
  populateTableRow(i, lineNumberVar, lineNameVar, lineIntervalVar, nextArrivalVar);

  }
}

// function: update the clock in the jumbotron every minute
const updateJumboClock = function() {
  // use momentJS to grab current time
  // use jquery to print it to the jumbotron div
}

// function: interval to call updateJumboClock & pullTrainsFromServer every minute

// function: remove line from table & firebase on button click
const removeTrainLine = function() {
  // we set the trainIndex attribute on the row div upon table population; it corresponds
  //   to the train's position in the firebase object.
  let indexVar = $(this).attr('trainIndex'); // first pull index from button

  // find corresponding entry on firebase and remove it

  // turn the variable into a string jQuery understands and use that to kill the correct row
  //   (once the table population function is up, we can just repopulate from firebase instead)
  indexVar = `[trainIndex=${indexVar}]`;
  $(indexVar).remove();
} // and connect this function to the buttons themselves
$(document).on('click', '.removeBtn', removeTrainLine);

populateTableRow(3, 744, 'Whiterun Express', 59, '1:01');
