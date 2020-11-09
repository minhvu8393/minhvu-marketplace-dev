const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const uploadSchema = new Schema({
    image: {
        type: Buffer,
        required: true,
    },
    thumbnail: {
        type: Buffer,
        required: true
    },
    mapId: {
        type: String,
        required: true,
    }
})

const Upload = mongoose.model('Upload', uploadSchema);

module.exports = Upload;


