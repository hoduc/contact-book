import React from 'react';
import PropTypes from 'prop-types';

const ContactForm = (props) => {
    return (
        <form onSubmit={props.submitContact}>
            <div className="form-group">
                <label htmlFor="profileUrl">Profile</label>                
                <img className="img-circle" src={props.profileUrl}/>
                <button type="button" onClick={() => props.changeProfileUrl(props)}>Randomize</button>
            </div>
            <div className="form-group">
                <label htmlFor="firstName">First Name</label>                
                <input type="text" name="firstName" className="form-control" placeholder="Your first name" value={props.firstName || ''} onChange={props.handleChangeText} required/>
            </div>
            <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input type="text" name="lastName" className="form-control" placeholder="Your last Name" value={props.lastName || ''} onChange={props.handleChangeText} required/>
            </div>
            <div className={`form-group ${props.emailError ? 'has-error' : ''}`}>
                <label htmlFor="email">Email</label>
                <input type="email" name="email" className="form-control" placeholder="Your email" value={props.email || ''} onChange={props.handleChangeText} required/>
                {props.emailError && <span>{props.emailError}</span>}
            </div>
            <div className={`form-group ${props.phoneError ? 'has-error' : ''}`}>
                <label htmlFor="phoneNumber">Phone#</label>
                <input type="tel" name="phoneNumber" className="form-control" maxLength="12" placeholder="Your phone number" value={props.phoneNumber || ''} onChange={props.handleChangeText} required/>
                {props.phoneError && <span>{props.phoneError}</span>}
            </div>
            <div className="form-group">
                <label htmlFor="status">Status</label>
                <input type="checkbox" name="status" className="form-control" checked={props.status || false} onChange={props.handleChangeText} />
            </div>
            <button onClick={() => { props.cancelSubmitContact(); }} className="btn btn-danger">Cancel</button>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    );
}

ContactForm.propTypes = {
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
    status: PropTypes.bool,
    phoneError: PropTypes.string,
    emailError: PropTypes.string,
    submitContact: PropTypes.func.isRequired,
    handleChangeText: PropTypes.func.isRequired,
    cancelSubmitContact: PropTypes.func.isRequired,
    changeProfileUrl: PropTypes.func.isRequired
}

ContactForm.defaultProps = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    status: false
}

export default ContactForm;
