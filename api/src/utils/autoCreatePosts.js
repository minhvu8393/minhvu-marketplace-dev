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

const generateTitle = () => {
    return randomWords({exactly: 1, wordsPerString: 4})[0]
}

const generateCategory = () => {
    const categories = ['phone', 'tablet', 'laptop', 'gameconsole'];
    return categories[Math.floor(Math.random() * 4)]
}

const generatePrice = () => {
    return Math.floor(Math.random() * 2000);
}

let arrayOfImages = []

fs.readdirSync(fileFolder).forEach(file => arrayOfImages.push(file));
let totalImages = arrayOfImages.length;

const createNewPost = function(arrayOfImages) {
    try {
        fs.readFile(`./images/${arrayOfImages[0]}`, async (err, image) => {
            let dimensions = imageSize(image);
            let uploadSize = Post.getUploadSize({width: dimensions.width, height: dimensions.height});
            resizedImg = await sharp(image).resize(uploadSize).toBuffer();
            const fields = {
                title: generateTitle(),
                category: generateCategory(),
                price: generatePrice(),
                images: [{image: resizedImg}],
                owner: id('5f8665ba57af8f19080c9863')
            }
            let post = new Post(fields);
            await post.save();
            console.log(chalk.green(`${totalImages - arrayOfImages.length + 1}/${totalImages}`))
            arrayOfImages = arrayOfImages.slice(1, arrayOfImages.length);
            if (arrayOfImages.length > 0) {
                createNewPost(arrayOfImages) //THE FUNCTION CALL ITSELF
            } else {
                console.log(chalk.green.bold('Done!'));
            }
        })
    } catch(err) {
        console.log(chalk.red(err.message))
    }
}

createNewPost(arrayOfImages);