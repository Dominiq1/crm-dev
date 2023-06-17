const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema({
    title:{
        type: String,
    },
    dateCreated:{
        type: String,
    }

  
})

module.exports = mongoose.model('Tag', TagSchema);