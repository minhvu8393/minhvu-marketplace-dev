const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const multer = require('multer');
const sharp = require('sharp');
const Post = require('../models/post');
const Upload = require('../models/upload');
const imageSize = require('buffer-image-size');
const mongoose = require('mongoose');

fileFilter = (req, file, callback) => {
    const allowMimes = ['image/png', 'image/jpg', 'image/jpeg'];
    if (allowMimes.includes(file.mimetype)) {
        callback(null, true)
    } else {
        callback('Avatar must be a image')
    }
}
const upload = multer({fileFilter});

router.post('/api/upload', auth, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({error: 'No Image'});
        }
        console.log(req.file.filename);
        const dimensions = imageSize(req.file.buffer);
        uploadSize = Post.getUploadSize({width: dimensions.width, height: dimensions.height});
        const image = await sharp(req.file.buffer).resize(uploadSize).toBuffer();
        const thumbnail = await sharp(req.file.buffer).resize({width: 250, height: 250}).toBuffer();
        let upload = new Upload({
            image,
            thumbnail,
            mapId: req.body.mapId
        })
        await upload.save();
        res.status(201).send(upload);
    } catch (err) {
        res.status(500).send({error: err.message})
    }
})

router.delete('/api/upload/deleteall/:mapid', async (req, res) => {
    try {
        await Upload.deleteMany({mapId: req.params.mapid});
        res.send();
    } catch(err) {
        res.status(500).send({error: err.message});
    }
})

router.delete('/api/upload/delete/:id', async (req, res) => {
    try {
        await Upload.deleteOne({_id: req.params.id});
        res.send();
    } catch(err) {
        res.status(500).send({error: err.message});
    }
})

module.exports = router;