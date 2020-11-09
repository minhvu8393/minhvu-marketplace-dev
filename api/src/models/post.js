const mongoose = require('mongoose');
const sharp = require('sharp');

const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        validate: function(value) {
            if (value.length > 100) {
                throw new Error('Max characters: 100')
            }
        }
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        validate: function(value) {
            validCategories = ['phone', 'laptop', 'tablet', 'gameconsole'];
            if (!validCategories.includes(value.toLowerCase())) {
                throw new Error('Valid categories: Phone, Tablet, Laptop, Game Console');
            }
        }
    },
    brand: {
        type: String,
    },
    owner: {
        type: Schema.Types.ObjectId,
        required: true
    },
    postBy: {
        type: String
    },
    images: [{
        image: {
            type: Buffer
        }
    }],
    thumbnail: {
        type: Buffer,
        required: true
    }
}, {
    timestamps: true
});

postSchema.statics.getUploadSize = function(size) {
    // landscape
    if (size.width > size.height) {
        if (size.width <= 960) {
            return size;
        }
        return {
            width: 960,
            height: Math.round(size.height * (960 / size.width))
        }
    } else { // portrail
        if (size.height <= 960) {
            return size;
        }
        return {
            height: 960,
            width: Math.round(size.width * (960 / size.height))
        }
    }

}

postSchema.statics.getThumbnailSize = function(size) {
    if (size.width > size.height) {
        if (size.width <= 480) {
            return size;
        }
        return {
            width: 480,
            height: Math.round(size.height * (480 / size.width))
        }
    } else { // portrail
        if (size.height <= 480) {
            return size;
        }
        return {
            height: 480,
            width: Math.round(size.width * (480 / size.height))
        }
    }
}

postSchema.statics.getSearchScore = function(keyword, post) {
    let score = 0;
    if (keyword.toLowerCase() === post.title.toLowerCase()) {
        return score = Infinity;
    }
    if (post.title.toLowerCase().includes(keyword.toLowerCase()) && keyword.split(' ').length > 1) {
        return score = 100;
    }
    const words = keyword.toLowerCase().split(' ');
    words.forEach((word) => {
        if (post.title.toLowerCase().includes(word)) {
            score += 1
        }
    })
    return score;
}

const Post = mongoose.model('Post', postSchema);

module.exports = Post;