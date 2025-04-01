const db = require("../models");
const Example = db.exampleTable;

exports.getTable = async (req, res) => {
    try {
      const table = await Example.findAll();
      res.status(200).json({ data: table });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };