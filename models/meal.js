const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MealSchema = new Schema (
    {
      name: {type: String, required: true},
      description: {type: String},
      category: {type: Schema.Types.ObjectId, ref: 'Category'}
    }
  )

  MealSchema
  .virtual('url')
  .get(function () {
    return '/' + this.category + '/' + this._id;
  });

module.exports = mongoose.model('Meal', MealSchema);
  