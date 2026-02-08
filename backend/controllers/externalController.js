const axios = require("axios");

exports.searchMovieOMDB = async (req, res) => {
  const { title } = req.query;

  if (!title) {
    return res.status(400).json({ message: "Movie title required" });
  }

  try {
    const response = await axios.get(
      `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&t=${title}`
    );

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: "External API error" });
  }
};