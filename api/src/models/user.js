const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Post = require('./post');
const axios = require('axios');

const Schema = mongoose.Schema;
const userSchema = new Schema({
    fbid: {
        type: String,
    },
    name: {
        type: String,
        trim: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
        validate: function(value) {
            if (value.length < 8) {
                throw new Error('Password must contains at least 8 character')
            }
        }
    },
    email: {
        type: String,
        required: true,
        validate: function(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email address')
            }
        },
        unique: true
    },
    phone: {
        type: String,
        required: true,
        validate: function(value) {
            let pattern = new RegExp('^[0-9]*$');
            if (!pattern.test(value)) {
                throw new Error('Phone number can contain number digits only');
            }
        }
    },
    address: {
        type: String,
    },
    avatar: {
        type: Buffer,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.set('toObject', {virtuals: true})

userSchema.methods.toJSON = function() {
    let obj = this.toObject();
    delete obj.password;
    delete obj.tokens;
    return obj
}

userSchema.methods.addToken = function() {
    let token = jwt.sign({_id: this._id}, process.env.SECRET_KEY);
    this.tokens.push({token});
    return token;
}

userSchema.statics.getFacebookToken = async (code) => {
    try {
        const { data } = await axios({
            url: 'https://graph.facebook.com/v4.0/oauth/access_token',
            method: 'get',
            params: {
                client_id: process.env.FB_APP_ID,
                client_secret: process.env.FB_APP_KEY,
                redirect_uri: 'https://localhost:8080/facebookauth',
                code
            },
        })
        return data;
    } catch(err) {
        return {error: err.message}
    }
}

userSchema.statics.getFacebookData = async (access_token) => {
    try {
        let { data } = await axios({
            url: 'https://graph.facebook.com/me',
            method: 'get',
            params: {
                fields: 'id, email, first_name, last_name',
                access_token
            }
        })
        return data;
    } catch(err) {
        return {error: err.message}
    }
}

userSchema.virtual('posts', {
    ref: "Post",
    localField: '_id',
    foreignField: 'owner'
})

userSchema.pre('save', async function() {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
})

userSchema.pre('remove', async function(){
    await Post.deleteMany({owner: this._id})
});

const User = mongoose.model('User', userSchema);

module.exports = User;
