const Review = require("../models/Review");

exports.createReview = async (req, res) => {
  const review = await Review.create({
    movie: req.body.movie,
    owner: req.user._id,
    rating: req.body.rating,
    title: req.body.title,
    text: req.body.text,
  });

  res.status(201).json(review);
};

exports.getReviews = async (req, res) => {
  const filter = { owner: req.user._id };
  if (req.query.movie) {
    filter.movie = req.query.movie;
  }
  const reviews = await Review.find(filter).sort({ createdAt: -1 });
  res.json(reviews);
};

exports.getReviewById = async (req, res) => {
  const review = await Review.findOne({
    _id: req.params.id,
    owner: req.user._id,
  });

  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  res.json(review);
};

exports.updateReview = async (req, res) => {
  const review = await Review.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id },
    {
      movie: req.body.movie,
      rating: req.body.rating,
      title: req.body.title,
      text: req.body.text,
    },
    { new: true }
  );

  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  res.json(review);
};

exports.deleteReview = async (req, res) => {
  const review = await Review.findOneAndDelete({
    _id: req.params.id,
    owner: req.user._id,
  });

  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  res.json({ message: "Review deleted" });
};
