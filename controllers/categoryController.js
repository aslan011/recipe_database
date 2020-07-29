const Category = require('../models/category');
const Meal = require('../models/meal');
const async = require('async');

// Display list of all Categories.
exports.index = function(req, res, next) {

    Category.find()
      .populate('category')
      .exec(function (err, list_categorys) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('index', { title: 'Categories', index: list_categorys });
      });
};

// Display list of all Meals in category.
exports.category_list = function(req, res, next) {
    
    async.parallel({
        category: function(callback) {
            Category.findById(req.params.id)
                .exec(callback);
        },

        category_meals: function(callback) {
            Meal.find({ 'category': req.params.id })
                .exec(callback)
        },
    }, function(err, results) {
        if (err) {return next(err)}
        else if (results.category===null) {
            const err = new Error('Category not found');
            err.status = 404;
                return next(err)
        }
        res.render('category_detail', { category: results.category, category_meals: results.category_meals})
    });
};

exports.category_create_post = function(req, res, next) {
    const category = new Category(
        { name: req.body.name }
      );
    Category.findOne({ name: req.body.name })
        .exec( function(err, found_category) {
            if (err) { return next(err); }
  
             if (found_category) {
               // Category exists, redirect to its detail page.
               res.redirect(found_category.url);
             } else {
                 category.save(function (err) {
                    if (err) {return next(err); }
                    res.redirect(category.url);
                 })
             }
        })
}