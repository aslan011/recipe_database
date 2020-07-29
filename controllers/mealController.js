const Meal = require('../models/meal');
const { retry } = require('async');

exports.meal_detail = function(req,res,next) {
    Meal.findById(req.params.id)
        .exec(function (err, meal_details) {
            if (err) { return next(err); }
            //Successful, so render
            res.render('meal', { meal: meal_details });
        });
}

exports.meal_create_post = function(req, res, next) {
    console.log(req.params.category)
    const meal = new Meal(
        { name: req.body.name,
          description: req.body.description,
          category: req.params.category }
      );
    Meal.findOne({ name: req.body.name })
        .exec( function(err, found_meal) {
            if (err) { return next(err); }
  
             if (found_meal) {
               // Category exists, redirect to its detail page.
               res.redirect(found_category.url);
             } else {
                 meal.save(function (err) {
                    if (err) {return next(err); }
                    res.redirect(meal.url);
                 })
             }
    })
}