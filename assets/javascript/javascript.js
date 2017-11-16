var config = {
  apiKey: "AIzaSyDcxYoc_H28Y7yQAGNS1NEueEV_QAcPXW8",
  authDomain: "traintimes-417e7.firebaseapp.com",
  databaseURL: "https://traintimes-417e7.firebaseio.com",
  projectId: "traintimes-417e7",
  storageBucket: "",
  messagingSenderId: "704515675627"
};

firebase.initializeApp(config);

var database = firebase.database();

//on click handler for adding a train
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var firstTrainTime = $("#firstTrain-input").val().trim();
  var frequency = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: trainName,
    destination: destination,
    firstTime: firstTrainTime,
    frequency: frequency
  };

  // Uploads train data
  database.ref().push(newTrain);

  // Logs everything to console from local object
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.firstTime);
  console.log(newTrain.frequency);
  console.log("test" + moment(newTrain.firstTime).format("HH:mm"));
  // Alert
  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#firstTrain-input").val("");
  $("#frequency-input").val("");
});

//Firebase event for adding trains to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var trainTime = childSnapshot.val().firstTime;
  var trainFrequency = childSnapshot.val().frequency;

  // Train Info
  console.log(trainName);
  console.log(trainDestination);
  console.log(trainTime);
  console.log(trainFrequency);

  var firstTimeConverted = moment(trainTime, "HH:mm").subtract(1, "months");
  console.log(firstTimeConverted);

  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % trainFrequency;
  console.log(tRemainder);

  // Minute Until Train
  var tMinutesTillTrain = trainFrequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));


  // Check to see if train has arrived once. Display correct next train based off of that.
  var hasArrived = false;
  if (moment().isBefore(moment(trainTime, "HH:mm"))) { //if 'now' is before 'first train arrival time', returns true or false
    console.log("has arrived is " + hasArrived);
    //If now is before the first train, append the first train time as its arrival time
    $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" +
      trainFrequency + "</td><td>" + trainTime + "</td><td>" + tMinutesTillTrain + "</td></tr>");

  }
  else { // if now is after the first train arrival


    // Add each train's data into the table
    $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" +
      trainFrequency + "</td><td>" + moment(nextTrain).format("HH:mm") + "</td><td>" + tMinutesTillTrain + "</td></tr>");

  }
});
