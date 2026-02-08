const Movie = require("../models/Movie");

exports.createMovie = async (req, res) => {
  const movie = await Movie.create({
    ...req.body,
    owner: req.user._id,
  });
  res.status(201).json(movie);
};

exports.getMovies = async (req, res) => {
  const movies = await Movie.find({ owner: req.user._id });
  res.json(movies);
};

exports.getMovieById = async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  res.json(movie);
};

exports.updateMovie = async (req, res) => {
  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(movie);
};

exports.deleteMovie = async (req, res) => {
  await Movie.findByIdAndDelete(req.params.id);
  res.json({ message: "Movie deleted" });
};