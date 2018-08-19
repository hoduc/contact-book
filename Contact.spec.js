var expect = require('chai').expect;
var Contact = require('./Contact');
describe('Contact validation', () => {
    
    it('should have error when having no field', (done) => {
        var aContact = new Contact();
        aContact.validate((err) => {
            expect(err.errors.firstName).to.exist;
            expect(err.errors.lastName).to.exist;
            expect(err.errors.email).to.exist;
            expect(err.errors.phoneNumber).to.exist;
            done();
        });
    });

    it('should have error when phone number is in the wrong format', (done) => {
        var aContact = new Contact({
            firstName: 'aFirstName',
            lastName: 'aLastName',
            email: 'email@email.com',
            status: true,
            profileUrl: '',
            phoneNumber: '1234567890'
        });
        aContact.validate((err) => {
            // console.log('err:', err.errors);
            expect(err.errors.phoneNumber).to.exist;
            done();
        });
    })

})