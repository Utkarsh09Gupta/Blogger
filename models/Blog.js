const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const domPurify = require('dompurify');
const {JSDOM} = require('jsdom');
const htmlPurify= domPurify(new JSDOM().window);

const stripHtml = require('string-strip-html');

mongoose.plugin(slug);

// Lets create a new schema
const blogSchema = new mongoose.Schema({
    //mongoose.Schema is used to create a new schema
    title: {
        type: String,
        required: true,
    },
    author:{
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    }
});

blogSchema.pre('validate', function (next) {
    // check if there is a description.
    if(this.description){
            
        this.description = htmlPurify.sanitize(this.description);
        this.snippet = stripHtml(this.description.substring(0, 200)).result;
  }

    next();
})

module.exports = mongoose.model('Blog', blogSchema);