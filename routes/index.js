var express = require('express');
var router = express.Router();
const app = express()

const mongoose = require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/testdb")

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const recipeSchema = mongoose.Schema({
  name: String,
  instructions: Array,
  ingredients: Array,
})

const Recipe = mongoose.model("Recipe", recipeSchema)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render("index")
});

router.get('/recipe/:food', function(req, res, next) {
  sendRecipe(res, req.params.food)
});

router.post("/recipe/", function(req, res, next) {
  Recipe.create(req.body)
  res.send(req.body)
})

router.post("/images", (req, res, next) => {
  res.send("yay")
})

async function sendRecipe(res, food) {
  const recipe = await Recipe.find({name: food})
  console.log(recipe)
  res.send(recipe)
}

module.exports = router;
