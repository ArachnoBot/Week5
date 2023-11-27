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
  categories: Array,
  images: Array,
})

const categorySchema = mongoose.Schema({
  name: String,
})

const imageSchema = mongoose.Schema({
  buffer: Buffer,
  mimetype: String,
  name: String,
  encoding: String,
})

const Recipe = mongoose.model("Recipe", recipeSchema)
const Category = mongoose.model("Category", categorySchema)
const Image = mongoose.model("Image", imageSchema)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render("index")
})

router.get('/recipe/:food', function(req, res, next) {
  sendRecipe(res, req.params.food)
})

router.get('/categories', function(req, res, next) {
  sendCategories(res)
});

router.post("/recipe/", function(req, res, next) {
  Recipe.create(req.body)
  res.send(req.body)
})

router.post("/images", (req, res, next) => {
  res.send("yay")
})

async function sendCategories(res) {
  const categories = await Category.find()
  res.send(categories)
}

async function sendRecipe(res, food) {
  const recipe = await Recipe.find({name: food})
  res.send(recipe)
}

module.exports = router;
