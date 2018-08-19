import React from 'react';
import PropTypes from 'prop-types';


const Contact = (props) =>  {
    return (
        <li className={`list-group-item ${props.status ? '' : 'disabled'}`}>
            <div className="col-xs-12 col-sm-3 text-center">
                <img src={props.profileUrl} alt="a profile" className="profile_img img-circle" />
            </div>
            <div className="col-xs-12 col-sm-9">
                <div>
                    <span className="name">
                    {props.firstName} {props.lastName}
                    </span>
                </div>
                <div>
                    <span className="glyphicon glyphicon-envelope text-muted info" data-toggle="tooltip" title={props.email}></span>
                    {props.status && <span className="visible">
                        <span className="text-muted">{props.email}</span>
                    </span>}
                </div>
                <div>
                    <span className="glyphicon glyphicon-earphone text-muted info" data-toggle="tooltip" title={props.phoneNumber}></span>
                    {props.status && <span className="visible">
                        <span className="text-muted">{props.phoneNumber}</span>
                    </span>}
                </div>
                <div>
                    {props.status && <button onClick={() => { props.editContact(props); }} className="btn btn-primary">
                        <span className="glyphicon glyphicon-pencil text-muted info" data-toggle="tooltip" title="Edit this contact">
                        </span>
                    </button>}
                    <button onClick={() => { props.toggleContactStatus(props.id); }} className={`btn ${props.status ? 'btn-danger': 'btn-sucess'}`}><span className=  {`glyphicon ${props.status ? 'glyphicon glyphicon-remove text-muted info': 'glyphicon-ok text-muted info'}`} data-toggle="tooltip" title={`${props.status ? 'De-active': 'Activate'}`}></span>
                    </button>
                    <button onClick={() => { props.handleDelete(props.id); }} className="btn btn-danger">
                        <span className="glyphicon glyphicon-trash text-muted info" data-toggle="tooltip" title="Delete this contact">
                        </span>
                    </button>
                </div>
            </div>
            <div className="clearfix"></div>
        </li>
    );
}

Contact.propTypes = {
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phoneNumber: PropTypes.string.isRequired,
    status: PropTypes.bool.isRequired,
    handleDelete: PropTypes.func.isRequired,
    toggleContactStatus: PropTypes.func.isRequired,
    editContact: PropTypes.func.isRequired
}

export default Contact;