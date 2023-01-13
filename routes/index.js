var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  const data = [
    {
      name: "Abdan Zam Zam Ramadhan",
      age: 25,
    },
    {
      name: "Lidia Kencana",
      age: 30,
    },
    {
      name: "Abdes Puspita Kencana",
      age: 20,
    },
  ];
  res.render("index", { title: "Express", data });
});

module.exports = router;
