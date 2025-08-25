const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true }, 
    description:{
        type:String,
        required:true
    },
    detailedDescription:{
        type:String,
        required:true
    },
    date:{type:Date},
    createdAt:{type:Date,default:Date.now},
    location:{type:String,required:true},
    mapLink:{type:String},
    studentsEnrolled:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Student",
        }
    ],
    attendStudents:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Student",
        }
    ],
    time:{type:String},
    type:{type:String,required:true},
    createdBy:{type:mongoose.Schema.Types.ObjectId,ref:"Admin"},
});

module.exports = mongoose.model('Event', eventSchema);
