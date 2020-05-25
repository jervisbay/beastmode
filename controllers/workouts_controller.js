var express = require("express");

var router = express.Router();
var connection = require("../config/connection");
var cTable = require('console.table');
const db = require("../models");

// Create all our routes and set up logic within those routes where required.
router.get("/", function(req, res) {
    res.render("index");
});

router.get("/index", function(req, res) {
    res.render("index");
});

router.get("/subscribe", function(req, res) {
    res.render("subscribe");
});

router.post("/newworkout", function(req, res) {
    var workoutParameters = req.body;
    var workoutDuration = workoutParameters.workoutDuration;
    var muscleGroupArray = workoutParameters.muscleGroup;

    const isArray = Array.isArray(muscleGroupArray);
    console.log(isArray);

    var promisesArray = [];
    var timePerExercise = 1;
    var numOfWorkouts = workoutDuration / timePerExercise;


    if (isArray === false) {
        console.log("ONLY ONE MUSCLE");
        promisesArray.push(db.Exercise.findAll({
            where: { minor_muscle: muscleGroupArray }
        }))
        Promise.all(promisesArray)
            .then(function(resultArray) {

                var totalNumberOfExercises = resultArray.length;

                var generatedWorkout = [];

                for (var i = 0; i < numOfWorkouts; i++) {
                    generatedWorkout.push(resultArray[Math.floor(Math.random() * totalNumberOfExercises)]);
                }

                var generatedWorkoutSpreadArray = [];
                generatedWorkout.forEach(nestedMuscle => generatedWorkoutSpreadArray.push(...nestedMuscle));

                var hbsObject = {
                    workouts: generatedWorkoutSpreadArray,
                    duration: workoutDuration,
                    timePerExercise: timePerExercise
                };
                console.log(hbsObject);
                res.render("newworkout", hbsObject);
            })
            .catch(e => { console.log(e) })
    } else {
        for (var i = 0; i < muscleGroupArray.length; i++) {
            promisesArray.push(db.Exercise.findAll({
                where: {
                    minor_muscle: muscleGroupArray[i]
                }
            }))
        };

        Promise.all(promisesArray)
            .then(function(resultArray) {

                spreadArray = [];
                resultArray.forEach(nestedMuscle => spreadArray.push(...nestedMuscle));
                var totalNumberOfExercises = spreadArray.length;

                var generatedWorkout = [];

                for (var i = 0; i < numOfWorkouts; i++) {
                    generatedWorkout.push(spreadArray[Math.floor(Math.random() * totalNumberOfExercises)]);
                }

                var hbsObject = {
                    workouts: generatedWorkout,
                    duration: workoutDuration,
                    timePerExercise: timePerExercise
                };

                res.render("newworkout", hbsObject);
            })
            .catch(e => { console.log(e) })

    };
})

router.get("/about", function(req, res) {
    res.render("about");
});

router.get("/workout_history", function(req, res) {
    res.render("workout_history");
});

// router.get("/newworkout", function(req, res) {
//     res.render("newworkout");
//     });

// Export routes for server.js to use.
module.exports = router;