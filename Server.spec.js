import Contact from './Contact';
import server from './Server';
import mockingoose from 'mockingoose';
import request from 'supertest';

describe('CRUD', () => {
    var sampleData = [{
        firstName: 'aFirst',
        lastName: 'aLast',
        email: 'fn@example.com',
        phoneNumber: '123-456-7890',
        status: true,
        profileUrl: 'aurl'
    }];
    it('Get contact by id', () => {
        const aContact = {
            _id: '507f191e810c19729de860ea',
            firstName: 'aFirst',
            lastName: 'aLast',
            email: 'fn@example.com',
            phoneNumber: '123-456-7890',
            status: true,
            profileUrl: 'aurl'
        }
        
        mockingoose.Contact.toReturn(aContact, 'findOne'); // findById is findOne
        
        request(server).get(`/api/contacts/${aContact._id}`).then(res => {
              expect(JSON.parse(JSON.stringify(res.data))).toMatchObject(aContact);
        });
    });

    it('it should create a new contact', () => {
        const aContact = {
            firstName: 'aFirst',
            lastName: 'aLast',
            email: 'fn@example.com',
            phoneNumber: '123-456-7890',
            status: true,
            profileUrl: 'aurl'
        }
        mockingoose.Contact.toReturn(aContact, 'findOne'); // findById is findOne
        mockingoose.Contact.toReturn({success: true}, 'save');
        request(server).post('/api/contacts').send(aContact).expect(200);
    })
})


