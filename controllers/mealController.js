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

exports.meal_create_get = function(req, res, next) {
    res.render('meal_form');
};

exports.meal_update_get = function(req, res, next) {
    Meal.findById(req.params.meal)
        .exec(function (err, meal_details) {
            if (err) { return next(err); }
            //Successful, so render
            res.render('update_meal', { meal: meal_details });
        });
};

exports.meal_create_post = function(req, res, next) {
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
               res.redirect(found_meal.url);
             } else {
                 meal.save(function (err) {
                    if (err) {return next(err); }
                    res.redirect('/' + req.params.category);
                 })
             }
    })
}

exports.meal_update_post = function(req, res, next) {
    Meal.findByIdAndUpdate(
        { _id: req.params.meal },
            { 
                description: req.body.description,
                name: req.body.name 
            },
        function(err, result) {
          if (err) {
            res.send(err);
          } else {
            res.redirect('/');
          }
        }
      );
}

exports.meal_delete_post= function(req, res, next) {
    Meal.findByIdAndRemove(req.params.meal,
        function(err, result) {
          if (err) {
            res.send(err);
          } else {
            res.redirect('/');
          }
        }
      );
}