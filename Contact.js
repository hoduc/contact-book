import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
const Schema = mongoose.Schema;

const ContactSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        unique: true,
        validate: (v) => {
            return /\d{3}-\d{3}-\d{4}/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`
    },
    profileUrl: {
        type:String
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    }
}, { timestamps: true });

ContactSchema.plugin(uniqueValidator);


module.exports = mongoose.model('Contact', ContactSchema);