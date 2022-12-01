// blog routes
const express = require('express');
const Blog = require('../models/Blog');
const router = express.Router();
const multer = require('multer');


const storage = multer.diskStorage({
    // to locate destination of a file which is being uploaded
    destination: function(res, file, callback){
        callback(null,'./public/uploads/images');
    },

    // add back the extension to the file name
    filename: function(res, file, callback){
        callback(null, Date.now() + file.originalname);
    },

})

// upload parameters for multer for uploading images
const upload = multer({
    // multer will only accept files with these extensions
    storage: storage,
    limits:{
        fileSize: 1024* 1024* 3,
    },
})



router.get('/new', (req, res)=>{
    res.render('new');
})



//  view route 
router.get('/:slug', async (req, res)=>{
    let blog = await Blog.findOne({ slug: req.params.slug });
    
    if(blog){
        res.render('show', {blog:blog});
    } else{
        res.redirect('/');
    }
})
// Routes that handles new posts 
router.post('/', upload.single('image'), async(req, res)=>{

    let blog = new Blog({
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,


    });

    try{
        blog = await blog.save();
        // await means that the code will wait for the promise to be resolved
        res.redirect(`blogs/${blog.slug}`);
        // redirect to the show page
        
    }catch(err){
        console.log(err);
    }
});
// route that will handle edit view
router.get('/edit/:id', async(req, res) => {

    let blog = await Blog.findById(req.params.id);
    // findById() => this method finds and returns the first document that matches the query criteria.
    res.render('edit',{blog:blog});
    // render the edit view 
});


// route that will handle update
router.put('/:id', async(req, res)=>{
    // put() => this method is used to update a document in the collection.
    req.blog = await Blog.findById(req.params.id);

    let blog = req.blog;                    

    blog.title = req.body.title;
    blog.author = req.body.author;
    blog.description = req.body.description;
    try{
        blog = await blog.save();
        //now redirect to the view route
        res.redirect(`/blogs/${blog.slug}`);
    }catch(err){
        console.log(err);
        res.redirect(`/blogs/edit/${blog.id}`, {blog:blog});
        // redirect to the edit route
    }
})

// route that will handle delete
router.delete('/:id', async(req, res)=>{
    await Blog.findByIdAndDelete(req.params.id);
    res.redirect('/');
})


module.exports = router;