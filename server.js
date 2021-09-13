// Sets up and defines requirements
const express = require("express");
const logger = require("morgan");
const path = require("path");
const mongoose = require("mongoose");
const Workout = require("./models");

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/workout', {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true
});

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));
// Routes for all the pages
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "./public/index.html"));
});

app.get("/exercise", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/exercise.html"));
});

app.get("/stats", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/stats.html"));
});
// Route to create new workout if new workout is selected. This allows exercises to be added.
app.post("/api/workouts", (req, res) => {
    Workout.create({})
        .then(workout => {
            console.log(workout);
            res.json(workout)
        })
        .catch(({ message }) => {
            console.log(message);
            res.json(message);
        });
});
// Obtains the previous workouts, specifically the last one to be used and displayed on tracker page.
app.get("/api/workouts", (req, res) => {
    Workout.aggregate([
        {
            $addFields: {
                totalDuration: { $sum: "$exercises.duration" },
            }
        }], (error, data) => {
            if (error) {
                res.send(error);
            } else {
                res.json(data);
            }
        });
});

// Route that obtains information regarding last 7 workouts and their respective exercises. The data of current duration and total weight is then displayed as two different graphs.
app.get("/api/workouts/range", (req, res) => {
    Workout.aggregate([
        {
            $addFields: {
                totalDuration: { $sum: "$exercises.duration" },
            }
        }]).sort({ _id: -1 }).limit(7)
        .then(lastSevenWorkouts => {
            console.log(lastSevenWorkouts);
            res.json(lastSevenWorkouts)
        })
        .catch(({ message }) => {
            console.log(message);
            res.json(message);
        });
});
// This is the route to add an exercise to an existing workout
app.put("/api/workouts/:id", (req, res) => {
    Workout.updateOne(
        {
            _id: req.params.id
        },
        {
            $push:
            {
                exercises: {
                    type: req.body.type,
                    name: req.body.name,
                    distance: req.body.distance,
                    duration: req.body.duration,
                    weight: req.body.weight,
                    sets: req.body.sets,
                    reps: req.body.reps,
                },
            }
        },
        (error, data) => {
            if (error) {
                res.send(error);
            } else {
                res.send(data);
            }
        }
    );
});
// Server set up to listen for queries from front end.
app.listen(process.env.PORT || 3000, () => {
    console.log("App running on port 3000!");
});