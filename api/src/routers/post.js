const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const auth = require('../middlewares/auth');
const Post = require('../models/post');
const User = require('../models/user');
const imageSize = require('buffer-image-size');
const Upload = require('../models/upload');
const mongoose = require('mongoose');

const fileFilter = function(req, file, callback) {
    const allowMimes = ['image/png', 'image/jpg', 'image/jpeg'];
    if (allowMimes.includes(file.mimetype)) {
        callback(null, true)
    } else {
        callback('File must be a image');
    }
}
const upload = multer({
    fileFilter
})

router.post('/api/post', auth, upload.array('images'), async (req, res) => {
    try {
        let { title, description, price, category } = req.body
        console.log (title, description, price, category);
        let post = new Post({
            title,
            description,
            price: Number(price),
            category
        })
        post.owner = req.user._id;
        post.postBy = req.user.name;

        
        // WILL NOT RUN
        if (req.files) { // NOT USE NOW
            let resizedImages = [];
            const sharpResizeImages = async function(arrayOfImages) {
                let dimensions = imageSize(arrayOfImages[0].buffer);
                let uploadSize = Post.getUploadSize({width: dimensions.width, height: dimensions.height});
                resizedImg = await sharp(arrayOfImages[0].buffer).resize(uploadSize).toBuffer();
                resizedImages.push(resizedImg);
                arrayOfImages = arrayOfImages.slice(1, arrayOfImages.length);
                if (arrayOfImages.length > 0) {
                    sharpResizeImages(arrayOfImages);
                } else {
                    resizedImages.forEach((img) => {
                        post.images.push({image: img})
                    })
                    let thumbnail = post.images[0].image
                    console.log('TYPE OF THUMBNAIL: ', typeof thumbnail)
                    let thumbnailDimensions = imageSize(thumbnail);
                    let thumbnailUploadSize = Post.getThumbnailSize({width: thumbnailDimensions.width, height: thumbnailDimensions.height});
                    thumbnailImage = await sharp(thumbnail).resize(thumbnailUploadSize).toBuffer();
                    
                    post.thumbnail = thumbnailImage;
                    try {
                        await post.save();
                        res.status(201).send(post);
                    } catch(err) {
                        res.status(500).send({error: err.message});
                    }
                }
            }
            sharpResizeImages(req.files); // NOT USE NOW
        }

        ////////////////////


        let uploads = await Upload.find({mapId: req.body.mapId})
        uploads.forEach((upload) => {
            post.images.push({image: Buffer.from(upload.image.buffer)})
        })
        let dimensions = imageSize(Buffer.from(post.images[0].image.buffer));
        let thumbnailSize = Post.getThumbnailSize({width: dimensions.width, height: dimensions.height});
        post.thumbnail = await sharp(Buffer.from(post.images[0].image.buffer)).resize(thumbnailSize).toBuffer();
        await post.save();
        await Upload.deleteMany({owner: req.body.mapId})
        res.status(201).send(post);
    } catch(err) {
        res.status(500).send({error: err.message});
    }
})

router.patch('/api/post/:id', auth, async (req, res) => {
    allowUpdateFields = ['title', 'description', 'price'];
    requestFields = Object.keys(req.body);
    updateIsValid = requestFields.every((field) => {
        return allowUpdateFields.includes(field);
    })
    if (!updateIsValid) {
        return res.status(400).send({error: 'Invalid Update'});
    }
    try {
        let post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).send({error: 'Not found'});
        }
        if (post.owner.toString() !== req.user._id.toString()) {
            return res.status(400).send({error: 'Not have permission'})
        }
        requestFields.forEach((field) => {
            post[field] = req.body[field]
        })
        await post.save();
        res.send(post);
    } catch(err) {
        res.status(500).send({error: err.message});
    }
})

router.get('/api/post/:id', async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).send({error: 'Not found'});
        }
        let user = await User.findById(post.owner);
        return res.send({post, user});
    } catch(err) {
        res.status(500).send({error: err.message});
    }
}),

// Get posts with query string

router.get('/api/posts', async (req, res) => {
    let query = {}
    if (req.query.category) {
        query = {
            ...query,
            category: req.query.category.trim()
        }
    }
    if (req.query.startprice) {
        query = {
            ...query,
            price: {...query.price, $gte: Number(req.query.startprice)}
        }
    }
    if (req.query.endprice) {
        query = {
            ...query,
            price: {...query.price, $lte: Number(req.query.endprice)}
        }
    }
    if (req.query.recent) {
        query = {
            ...query,
            createdAt: {$gte: new Date().getTime() - Number(req.query.recent) * 86400000}
        }
    }
    console.log(query);
    if (req.query.search) {
        let posts = await Post.find({...query}).exec()
        posts.forEach((post) => {
            post.score = Post.getSearchScore(req.query.search, post)
        })
        posts = posts.filter((post) => {
            return post.score > 0;
        })
        posts.sort(function(a, b) {
            if (a.score > b.score) {
                return -1
            } else {
                return 1
            }
        })
        if (req.query.skip > posts.length) {
            return res.send({posts: []});
        } else {
            posts = posts.slice(Number(req.query.skip), Number(req.query.skip) + 20);
            posts = posts.map((post) => {
                post = post.toObject();
                delete post.images;
                return post
            })
            return res.send({posts});
        }

    }
    try {
        posts = await Post.find({...query})
        .sort({createdAt: -1})
        .limit(Number(req.query.limit))
        .skip(Number(req.query.skip))
        .exec()
        posts = posts.map((post) => {
            post = post.toObject();
            delete post.images;
            return post
        })
        count = await Post.countDocuments({...query})
        res.send({posts, count});
    } catch(err) {
        res.status(500).send({error: err.message});
    }
})

router.delete('/api/post/:id', auth, async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).send({error: 'Not found'});
        }
        if (post.owner.toString() !== req.user._id.toString()) {
            return res.status(400).send({error: 'Not have permission'})
        }
        await post.remove();
        res.send();
    } catch(err) {
        res.status(500).send({error: err.message});
    }
})

router.get('/api/dev/post', async (req, res) => {
    try {
        let allPosts = await Post.find({})    
        let arrayOfPosts = []   
        allPosts.forEach((post) => {
            arrayOfPosts.push({post, score: Post.getSearchScore('est', post)})
        })
        arrayOfPosts.sort(function(a, b) {
            if (a.score > b.score) {
                return -1
            } else {
                return 1
            }
        })
        arrayOfPosts = arrayOfPosts.filter((post) => {
            return post.score > 0;
        })
        res.send(arrayOfPosts);
    } catch(err) {
        res.status(500).send({error: err.message})
    }
})

router.get('/api/dev/getimages', async (req, res) => {
    try {
        let upload = await Upload.find({owner: '5f9a7f660688e2166e73c9f6'});
        console.log(upload);
        res.send()
    } catch (err) {
        res.status(500).send({error: err.message})
    }
})

module.exports = router;