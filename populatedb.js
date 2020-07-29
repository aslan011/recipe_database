#! /usr/bin/env node

console.log('This script populates');

// Get arguments passed on command line
const userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
const async = require('async')
const Meal = require('./models/meal')
const Category = require('./models/category')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var meals = []
var categorys = []

function mealCreate(name, description, category, cb) {
  mealdetail = {name:name , description: description, category: category }

  var meal = new Meal(mealdetail);
       
  meal.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Meal: ' + meal);
    meals.push(meal)
    cb(null, meal)
  }  );
}

function categoryCreate(name, cb) {
  var category = new Category({ name: name });
       
  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Category: ' + category);
    categorys.push(category)
    cb(null, category);
  }   );
}

function createCategorys(cb) {
    async.series([
        function(callback) {
          categoryCreate('Curries and Stews', callback);
        },
        function(callback) {
          categoryCreate('Pies', callback);
        },
        function(callback) {
          categoryCreate('Burgers', callback);
        },
        ],
        // optional callback
        cb);
}

function createMeals(cb) {
    async.parallel([
        function(callback) {
          mealCreate('Cauli tikka masala', 'A spicy healthy choice', categorys[0],  callback);
        },
        function(callback) {
          mealCreate('Stuffed curried aubergines', 'A simple quick one',  categorys[0],  callback);
        },
        function(callback) {
          mealCreate('Cottage pie', 'Easy, family favourite',  categorys[1],  callback);
        },
        function(callback) {
          mealCreate('Sticky onion tart', 'Sweet garlic and onion tart',  categorys[1],  callback);
        },
        function(callback) {
          mealCreate('Black bean burger', 'Healthy, filling one',  categorys[2],  callback);
        },
        function(callback) {
          mealCreate('Bhaji burger', 'Twist on indian favourite',  categorys[2],  callback);
        }
        ],
        // optional callback
        cb);
}

async.series([
    createCategorys,
    createMeals,
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Meals: '+meals);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});




