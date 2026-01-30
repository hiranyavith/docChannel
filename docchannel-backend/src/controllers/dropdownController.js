const db = require("../config/db");

exports.getDropDownItem = async (req, res) => {
  const { type } = req.params;

  let sql = "";

  switch (type) {
    case "provinces":
      sql = "SELECT province_id as id,province_name as name FROM province";
      break;
    case "district":
      sql = "SELECT district_id as id,district_name as name FROM district";
      break;
    case "cities":
      sql = "SELECT city_id as id,city_name as name FROM city";
      break;
    case "genders":
      sql = "SELECT gender_id as id,gender_type as name FROM gender";
      break;
    case "bloodgrp":
      sql = "SELECT blood_grp_id as id,boold_grp-type as name FROM blood_grp";
      break;
    case "specialization":
      sql = "SELECT specialization_id as id,speciality_type as name FROM specialization";
      break;
    default:
      return res.status(400).json({
        message: "Invalid dropdown type",
      });
  }
  const [rows] = await db.execute(sql);
  res.json(rows);
};
