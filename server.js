// Sets up and defines requirements
const express = require("express");
// const mongojs = require("mongojs");
const logger = require("morgan");
const path = require("path");
const mongoose = require("mongoose");
const Workout = require("./models");

mongoose.connect(process.env.MONGODB_URI ||'mongodb://localhost/workout', {
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

// const databaseUrl = "workout";
// const collections = ["workouts"];

// const Workout = mongojs(databaseUrl, collections);

// Workout.on("error", error => {
//   console.log("Database Error:", error);
// });

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "./public/index.html"));
});

app.get("/exercise", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/exercise.html"));
  });

app.get("/stats", (req, res) => {
res.sendFile(path.join(__dirname + "/public/stats.html"));
});

app.post("/api/workouts", (req, res) => {
  console.log("this is line 47" + req.body);
//   const wk = new Workout();
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

app.get("/api/workouts", (req, res) => {
  Workout.aggregate([
      {
    $addFields:{
        totalDuration: { $sum: "$exercises.duration"},
    }
  }], (error, data) => {
    if (error) {
      res.send(error);
    } else {
      res.json(data);
    }
  });
});


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

app.put("/api/workouts/:id", (req, res) => {
  Workout.updateOne(
    {
      _id: req.params.id
    },
    {
      $push: 
          {
      exercises:{
        type: req.body.type,
        name: req.body.name,
        distance: req.body.distance,
        duration: req.body.duration,
        weight: req.body.weight,
        sets: req.body.sets,
        reps: req.body.reps,
        },
    }},
    (error, data) => {
      if (error) {
        res.send(error);
      } else {
        res.send(data);
      }
    }
  );
});

app.listen(process.env.PORT || 3000, () => {
  console.log("App running on port 3000!");
});