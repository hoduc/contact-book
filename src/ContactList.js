import React  from 'react';
import PropTypes from 'prop-types';
import Contact from './Contact';

const ContactList = (props) => {
    const contactElem = props.data.map( contact => (
        <Contact
            profileUrl={contact.profileUrl}
            firstName={contact.firstName}
            lastName={contact.lastName}
            email={contact.email}
            phoneNumber={contact.phoneNumber}
            id={contact._id}
            key={contact._id}
            status={contact.status} 
            handleDelete={props.handleDelete}
            toggleContactStatus={props.toggleContactStatus}
            editContact={props.editContact}
        >
            {contact.text}
        </Contact>
    ));

    return (
        <div>
            <ul className="list-group" id="contact-list">
                { contactElem }
            </ul>
        </div>

    );
};

ContactList.propTypes = {
    data: PropTypes.arrayOf( PropTypes.shape({
        profileUrl: PropTypes.string,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        id: PropTypes.string,
        email: PropTypes.string,
        phoneNumber: PropTypes.string,
        status: PropTypes.bool
    })),
    handleDelete: PropTypes.func.isRequired,
    toggleContactStatus: PropTypes.func.isRequired,
    editContact: PropTypes.func.isRequired
};

ContactList.defaultProps = {
    data: [],
};

export default ContactList;