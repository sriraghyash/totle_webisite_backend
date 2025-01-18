const { models } = require("../models");
const { Language } = models;

console.log("Language Model:", Language);

const getLanguages = async (req, res) => {
  try {
    const languages = await Language.findAll({
      attributes: ["language_id", "language_name"],
      order: [["language_name", "ASC"]],
    });
    res.status(200).json(languages);
  } catch (error) {
    console.error("Error fetching languages:", error);
    res.status(500).json({ error: true, message: "Failed to retrieve languages." });
  }
};

const insertLanguages = async (req, res) => {
  try {
    await Language.bulkCreate(req.body);
    res.status(200).json({ message: "Languages inserted successfully." });
  } catch (error) {
    console.error("Error inserting languages:", error);
    res.status(500).json({ error: true, message: "Error inserting languages." });
  }
};

module.exports = { getLanguages, insertLanguages };
