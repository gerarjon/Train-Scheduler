// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyA1vjgYU_YNie9Rojr3v9NRB6zGHwowegI",
    authDomain: "train-scheduler-55eac.firebaseapp.com",
    databaseURL: "https://train-scheduler-55eac.firebaseio.com",
    projectId: "train-scheduler-55eac",
    storageBucket: "train-scheduler-55eac.appspot.com",
    messagingSenderId: "934922791989",
    appId: "1:934922791989:web:7a36de39e48f720887157c"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

// Add Train Button 
$("#add-train").on("click", function() {
    event.preventDefault();

    // Get User Input 
    var trainName = $("#trainName").val().trim();
    var destination = $("#destination").val().trim();
    var firstTrain = $("#firstTrain").val().trim();
    var frequency = $("#frequency").val().trim();

    // For when the text input is empty
    if (trainName === "" || destination === "" || firstTrain === "" || frequency === "") {
        // var modal = $("<div id=\"modal-submit\" class=\"modal\">");
        // var modalContent = modal.append($("<div class=\"modal-content\">"));
        // modalContent.html("<p>Please fill out all the forms</p>");
        M.toast({html: "Please fill out all the forms"})
        return false;
    }

    // Store train data in new object
    var newTrain = {
        name: trainName,
        destination: destination,
        first: firstTrain,
        frequency: frequency
    };

    // Push to Firebase
    console.log(newTrain);

    database.ref().push(newTrain);
    
    // var postId = push.getKey();
    // console.log(postId);

    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.first);
    console.log(newTrain.frequency);

    // Clear form 
    $("#trainName").val("");
    $("#destination").val("");
    $("#firstTrain").val("");
    $("#frequency").val("");

    return false;
})

// Firebase event for adding trains to the database 
database.ref().on("child_added", function(childSnapshot, prevChildKey) {
    console.log(childSnapshot.val());

    var tName = childSnapshot.val().name;
    var tDestination = childSnapshot.val().destination;
    var tFirstTrain = childSnapshot.val().first;
    var tFrequency = childSnapshot.val().frequency;
    var timeSplit = tFirstTrain.split(":");
    var trainTime = moment().hours(timeSplit[0]).minutes(timeSplit[1]);
    var maxMoment = moment().max(moment(), trainTime);
    var tMinutes;
    var tArrival;

    if (maxMoment === trainTime) {
        tArrival = trainTime.format("hh:mm A");
        tMinutes = trainTime.diff(moment(), "minutes"); 
    } else {
        // calculate minutes until arrival
        var timeDifference = moment().diff(trainTime, "minutes");
        var tRemainder = timeDifference % tFrequency;
        tMinutes = tFrequency - tRemainder;
        tArrival = moment().add(tMinutes, "m").format("hh:mm A");
    }
    console.log("tMinutes:", tMinutes);
    console.log("tArrival:", tArrival);


    // Function that displays the table
    var displayTable = () => {
        $("#table > tbody").append(`<tr><td>${tName}</td><td>${tDestination}</td><td>${tFrequency}</td><td>${tArrival}</td><td>${tMinutes}</td></tr>`)
    }
    // Add each train to the table
    displayTable();
    // Function that updates the table every minute
    // var updateTable = () => {
    //     setInterval(function() {
            
    //         console.log("updating train table at: " + moment().format("HH:mm:ss A"));
    //         displayTable();
    //     }, 1000);
    // }
    // updateTable();
});

