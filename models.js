// Sets up models to be used in the database. Set up using mongoose to connect to mongoDB
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
  day: {
    type: Date,
    default: Date.now(),
    required: "date needed"
  },
  exercises: [
    {
      type: {
        type: String,
        trim: true,
        required: "resistance or cardio"
      },

      name: {
        type: String,
        trim: true,
        required: "Name of exercise required"
      },

      duration: {
        type: Number,
        required: true
      },

      weight: {
        type: Number,
      },

      reps: {
        type: Number,
      },

      sets: {
        type: Number,
      },

      distance: {
        type: Number,
      },
    }
  ]

});

const Workout = mongoose.model("Workout", exerciseSchema);

module.exports = Workout;