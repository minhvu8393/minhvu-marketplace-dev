const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const multer = require('multer');
const sharp = require('sharp');
const auth = require('../middlewares/auth');
const axios = require('axios');

fileFilter = (req, file, callback) => {
    const allowMimes = ['image/png', 'image/jpg', 'image/jpeg'];
    if (allowMimes.includes(file.mimetype)) {
        callback(null, true)
    } else {
        callback('Avatar must be a image')
    }
}
const upload = multer({fileFilter});

router.post('/api/user', upload.single('avatar'), async(req, res) => {
    try {
        let user = new User({
            name: req.body.name,
            password: req.body.password,
            email: req.body.email,
            phone: req.body.phone,
            fbid: req.body.fbid
        });
        console.log('REQUEST FILE', req.file);
        if (req.file) {
            user.avatar = await sharp(req.file.buffer).png().resize({width: 250, height: 250}).toBuffer();
        }
        await user.save();
        let token = user.addToken();
        await user.save();
        res.cookie('token', token, {httpOnly: true});
        res.status(201).send(user);
    } catch(err) {
        res.status(500).send({error: err.message})
    }
})

router.post('/api/user/login', async(req, res) => {
    try {
        let user = await User.findOne({email: req.body.email});
        if (!user) {
            return res.status(400).send({error: 'Invalid login'});
        }
        passWordIsCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!passWordIsCorrect) {
            return res.status(400).send({error: 'Invalid login'});
        }
        token = user.addToken();
        await user.save();
        res.cookie('token', token, {httpOnly: true});
        res.send({token, user});
    } catch(err) {
        res.status(500).send({error: err.message});
    }
})

router.get('/api/user/login/facebook', async(req, res) => {
    try {
        const code = req.query.code;
        let data = await User.getFacebookToken(code);
        if (!data.access_token) {
            return res.status(400).send()
        }
        let { access_token } = data;
        let userData = await User.getFacebookData(access_token);
        if (!userData.id) {
            return res.status(400).send();
        }
        let user = await User.findOne({fbid: userData.id});
        if (!user) {
            return res.status(300).send(userData);
        }
        token = user.addToken();
        await user.save();
        res.cookie('token', token, {httpOnly: true})
        res.send(user);
    } catch(err) {
        res.status(500).send({error: err.message})
    }
})

router.post('/api/user/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        })
        await req.user.save();
        res.send();
    } catch(err) {
        res.status(500).send({error: err.message});
    }
})

router.patch('/api/user', auth, upload.single('avatar'), async(req, res) => {
    const requestFields = Object.keys(req.body);
    const validUpdateFields = ['password', 'name', 'phone', 'avatar'];
    const updateIsValid = requestFields.every((field) => {
        return validUpdateFields.includes(field)
    })
    if (!updateIsValid) {
        return res.status(400).send({error: 'Invalid update'});
    }
    try {
        if (req.file) {
            req.user.avatar = await sharp(req.file.buffer).resize({width: 250, height: 250}).toBuffer();
        }
        requestFields.forEach((field) => {
            req.user[field] = req.body[field];
        })
        await req.user.save();
        res.send(req.user);
    } catch(err) {
        res.status(500).send({error: err.message});
    }
})

router.get('/api/user', auth, async(req, res) => {
    try {
        res.send(req.user);
    } catch(err) {
        res.status(500).send({error: err.message});
    }
})

router.get('/api/user/:id', async(req, res) => {
    try {
        let user = await User.findById(req.params.id)
        await user.populate('posts').execPopulate();
        user.posts = user.posts.map((post) => {
            post = post.toObject();
            delete post.images;
            return post
        })
        res.send(user);
    } catch(err) {
        res.status(500).send({error: err.message});
    }
})

router.get('/api/mypost', auth, async (req, res) => {
    try {
        await req.user.populate('posts').execPopulate();
        let posts = [...req.user.posts];
        posts = posts.map((post) => {
            post = post.toObject();
            delete post.images;
            return post;
        })
        res.send(posts);
    } catch(err) {
        res.status(500).send({error: err.message});
    }
})

router.delete('/api/user', auth, async(req, res) => {
    try {
        await req.user.remove();
        res.send();
    } catch(err) {
        res.status(500).send({error: err.message});
    }
})

module.exports = router;