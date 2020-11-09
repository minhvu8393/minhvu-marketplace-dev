const fs = require('fs');
const fileFolder = './images/';
const randomWords = require('random-words');
const Post = require('../models/post');
const sharp = require('sharp');
const util = require('util');
const mongoose = require('mongoose');
const id = mongoose.Types.ObjectId;
const chalk = require('chalk');
const imageSize = require('buffer-image-size');


class AutoCreatePost {
    constructor(category, fileDir, quantity) {
        this.category = category,
        this.fileDir = fileDir,
        this.quantity = quantity
    }
    static getArrayOfImage(fileDir, quantity) {
        let arrayOfImages = []
        fs.readdirSync(fileDir).forEach(file => arrayOfImages.push(file));
        arrayOfImages = arrayOfImages.slice(1, arrayOfImages.length);
        let arrayOfString = [...arrayOfImages];
        while (arrayOfImages.length < quantity) {
            arrayOfImages.push(AutoCreatePost.randomStringInArray(arrayOfString));
        }
        return arrayOfImages;
    }
    static randomStringInArray(arrayOfString) {
        return arrayOfString[Math.floor(Math.random() * arrayOfString.length)]
    }
    generateTitle() {
        let iphoneTitles = ['6s', '11 pro max', '7 plus', 'se', 'se 2020', '8 plus', 'Xs max', 'Xs', '5s'];
        let samsungPhoneTitles = ['s9 plus', 's8', 'note 10', 'note 20', 'note 20 ultra', 'A8', 'note 5', 'note 7'];
        let xiaomiPhoneTitles = ['redmi note 5', 'mi note 10 pro', 'mi mix', 'mi mix 2', 'mi alpha', 'redmi 2'];
        let ipadTitles = ['air', 'air2', 'pro 9.7', 'pro 10.5 2017', '10.5 2020', 'mini 5', 'mini 2', '4', 'air 3'];
        let galaxyTabTitles = ['tab 2', 'tab s2', 'tab A 10.1', 'tab 4', 'tab A 10.1 2017', 'tab s4', 'tab S 12.5'];
        let status = ['likenew 99%', 'very good condition', 'stills function', 'very good', 'works well', 'works perfectly'];
        if (this.category === 'iphone') {
            return  `iphone ${AutoCreatePost.randomStringInArray(iphoneTitles)} ${AutoCreatePost.randomStringInArray(status)}`
        }
        if (this.category === 'galaxyPhone') {
            return  `Samsung galaxy ${AutoCreatePost.randomStringInArray(samsungPhoneTitles)} ${AutoCreatePost.randomStringInArray(status)}`
        }
        if (this.category === 'xiaomiPhone') {
            return `Xiaomi ${AutoCreatePost.randomStringInArray(xiaomiPhoneTitles)} ${AutoCreatePost.randomStringInArray(status)}`
        }
        if (this.category === 'ipad') {
            return `iPad ${AutoCreatePost.randomStringInArray(ipadTitles)} ${AutoCreatePost.randomStringInArray(status)}`
        }
        if (this.category === 'galaxytab') {
            return `Samsung galaxy ${AutoCreatePost.randomStringInArray(galaxyTabTitles)} ${AutoCreatePost.randomStringInArray(status)}`

        }
    }
    createNewPost() {
        let arrayOfImages = AutoCreatePost.getArrayOfImage(this.fileDir, this.quantity);
        let totalImages = arrayOfImages.length;
        let fileDir = this.fileDir;
        let today = new Date();
        let executeCreateNewPost = (arrayOfImages) => {
            fs.readFile(`${fileDir}/${arrayOfImages[0]}`, async (err, image) => {
                let dimensions = imageSize(image);
                let uploadSize = Post.getUploadSize({width: dimensions.width, height: dimensions.height});
                let resizedImg = await sharp(image).resize(uploadSize).toBuffer();
                let thumbnailSize = Post.getThumbnailSize({width: dimensions.width, height: dimensions.height});
                let thumbnail = await sharp(image).resize(thumbnailSize).toBuffer();
                const fields = {
                    title: this.generateTitle(),
                    category: 'phone',
                    price: 200,
                    images: [{image: resizedImg}],
                    owner: id('5f8665ba57af8f19080c9863'),
                    createdAt: today - Math.floor(Math.random() * 6.048e+8),
                    thumbnail
                }
                let post = new Post(fields);
                await post.save();
                console.log(chalk.green(`${totalImages - arrayOfImages.length + 1}/${totalImages}`))
                arrayOfImages = arrayOfImages.slice(1, arrayOfImages.length);
                if (arrayOfImages.length > 0) {
                    executeCreateNewPost(arrayOfImages) //THE FUNCTION CALL ITSELF
                } else {
                    console.log(chalk.green.bold('Done!'));
                }
            })
        }
        mongoose.connect('mongodb://127.0.0.1:27017/marketplace-dev', {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
        })
        .then(() => {
            console.log('Connected to database');
        })
        .catch(() => {
            console.log('Unable to connect to database');
        })
        executeCreateNewPost(arrayOfImages);
    }
}

let createPost = new AutoCreatePost('xiaomiPhone', './images/Phones/xiaomi', 100);
createPost.createNewPost();
