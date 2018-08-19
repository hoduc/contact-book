import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Contact from './Contact';

const app = express();
const router = express.Router();
const result = dotenv.config({ path: __dirname + '/dev.env'});
if (result.error) {
    throw result.error;
}
var dbUri = process.env.DB_PROTOCOL + '://' + process.env.DB_USER + ':' + process.env.DB_PASSWORD + '@' + process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB;
console.log('dbUri:', dbUri);
const API_PORT = process.env.API_PORT || 3000;
mongoose.connect(dbUri);
mongoose.connection.on('error', console.error.bind(console, 'There was an error connecting to MongoDB'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

router.get('/hello', (req,res) => {
    res.json({ message: 'Hello world' });
});

router.get('/contacts', (req, res) => {
    Contact.find((err, contacts) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: contacts });
    });
});

router.get('/contacts/:contactId', (req,res) => {
    const { contactId } = req.params;
    if (!contactId) {
        return res.json({ success: false, error: 'No contactId given!!!'});
    }
    Contact.findById(contactId, (error, contact) => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true, data: contact });
    });
});

router.put('/contacts/:contactId', (req,res) => {
    const { contactId } = req.params;
    if (!contactId) {
        return res.json({ success: false, error: 'No contactId given!!!'});
    }
    
    const {email, phoneNumber} = req.body;
    if (!email && !phoneNumber) {
        return Contact.findOneAndUpdate({_id: contactId}, req.body, (err, contact) => {
            if (err) return res.json({ success: false, error: err });
            return res.json({ success: true });
        });
    }
    console.log('contactId:', contactId)
    const error = {};
    Contact.find({email: email}, (err, contacts) => {
        if (!err && contacts.length > 0 && contacts[0]._id != contactId) {
            error.errors = {
                email: {
                    message: 'email taken!!!'
                }
            }
        }
    }).then(Contact.find({phoneNumber: phoneNumber}, (err, contacts) => {
        console.log('contacts:', contacts)
        if (!err && contacts.length > 0 && contacts[0]._id != contactId) {
            if (error.errors) {
                error.errors.phoneNumber = {
                    message: 'phone taken!!!'
                }

            }else {
                error.errors = {
                    phoneNumber: {
                        message: 'phone taken!!!'
                    }
                }
            }
        }
    })).then(() => {
        console.log('final error:', error);
        
        if (error.errors) {
            console.log('hello return this:', JSON.stringify({success: false, error: error}));
            return res.json({success: false, error: error});
        }
        Contact.findOneAndUpdate({_id: contactId}, req.body, (err, contact) => {
            if (err) return res.json({ success: false, error: err });
            return res.json({ success: true });
        });
    });
    // console.log('req.params:', req.params);
    // console.log('req.body:', req.body);
    // Contact.findOneAndUpdate({_id: contactId}, req.body, (err, contact) => {
    //     if (err) return res.json({ success: false, error: err });
    //     return res.json({ success: true });
    // });
});


router.post('/contacts', (req, res) => {
    const contact = new Contact();
    console.log('req.body:', req.body);
    const {firstName, lastName, email, phoneNumber, status, profileUrl} = req.body;
    if (!firstName) return res.json({ success: false, error: 'You must provide firstName'});
    if (!lastName) return res.json({ success: false, error: 'You must provide lastName'});
    if (!email) return res.json({ success: false, error: 'You must provide email'});
    if (!phoneNumber) return res.json({ success: false, error: 'You must provide phoneNumber'});
    // TODO: validate on the front end of the data first
    // Should validate on back end as well ?
    contact.firstName = firstName;
    contact.lastName = lastName;
    contact.email = email; // email must be unique
    contact.phoneNumber = phoneNumber; //phone number must be unique
    contact.profileUrl = profileUrl;
    contact.status = status;
    contact.save( err => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });
    });
})

router.delete('/contacts/:contactId', (req,res) => {
    const { contactId } = req.params;
    if (!contactId) {
        return res.json({ success: false, error: 'No contactId given!!!'});
    }
    Contact.remove({ _id : contactId }, (error, contact) => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true, data: contact });
    });
});

/** EXPERIMENTAL FULL TEXT SEARCH. NOT WORK YET */
router.get('/contacts/search/:query', (req,res) => {
    var query = req.params;
    if (!query) {
        return res.json({ success: false, error: 'No query given!!!' });
    }
    Contact.find(
           { $text: { $search: "a" }},
           { score: { $meta: "textScore" }},
           )
           .exec((error, contacts) => {
                if (error) return res.json({ success: false, error });
                return res.json({ success: true, data: contacts });
           })
})

app.use('/api', router);
var server = app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));

module.exports = server