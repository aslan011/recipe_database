var express = require('express');
var router = express.Router();

const meal_controller = require('../controllers/mealController');
const category_controller = require('../controllers/categoryController');

/* GET home page. */
router.get('/', category_controller.index);

// POST create new category
router.post('/', category_controller.category_create_post)

// GET specific meal details
router.get('/:category/:id', meal_controller.meal_detail)

// POST add new meal
router.post('/:category/', meal_controller.meal_create_post)

// GET request for one Category.
router.get('/:id', category_controller.category_list);

module.exports = router;
