import React, { Component } from 'react';
import './App.css';
import ContactList from './ContactList';
import ContactForm from './ContactForm';
import validator from 'validator';

class App extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      contact: null,
      edit: false,
      hideList: false,
      error: null,
      phoneError: null,
      emailError: null,
      errorField:[]
    };
  }

  getContacts = () => {
    fetch('api/contacts')
    .then(data => data.json())
    .then((res) => {
      if (!res.success) this.setState({ error: res.error });
      else {
        console.log('data:', res.data);
        this.setState({ data: res.data });
      }
    });
  }

  componentDidMount() {
    this.getContacts();
  }

  componentWillUnmount() {
    if (this.pollInterval) clearInterval(this.pollInterval);
    this.delayPollData = null;
  }

  onDeleteContact = (id) => {
    const contactToDeleteIndex = this.state.data.findIndex(c => c._id === id);
    const newData = [
      ...this.state.data.slice(0,contactToDeleteIndex),
      ...this.state.data.slice(contactToDeleteIndex+1)
    ];
    fetch(`api/contacts/${id}`, { method: 'DELETE' })
    .then(res => res.json())
    .then((res) => {
      if (!res.success) this.setState({ error: res.error });
      else {
        console.log('newData:', newData);
        this.setState({ data: newData });
      }
    });
  }

  onToggleContactStatus = (id) => {
    console.log('current state:', this.state.data);
    const contactToToggleStatusIndex = this.state.data.findIndex(c => c._id === id);
    const newStatus = !this.state.data[contactToToggleStatusIndex].status;
    fetch(`api/contacts/${id}`, { 
      method: 'PUT', 
      body: JSON.stringify({
        status: newStatus
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then((res) => {
      if (!res.success) this.setState({ error: res.error });
      else {
        const newData = this.state.data;
        newData[contactToToggleStatusIndex].status = newStatus;
        this.setState({newData});
      }
    });
  }

  onEditContact = (contactElement) => {    
    this.setState({ contact: contactElement, edit: true, hideList: true});
  }

  onValidate = (field, fieldValue, validateFn, serverValidateUrl) => {
    if (validateFn(fieldValue)) {
      fetch(`${serverValidateUrl}/${fieldValue}`)
      .then(data => data.json())
      .then((res) => {        
        if (res.success) this.setState({ [`${field}Error`] : `${field} is taken!!!. Sorry bud!`});
        else {
          this.setState({[`${field}Error`]: null});
        }
      });
    } else {
      this.setState({ [`${field}Error`] : `${field}'s format is not erright`});
    }
  }

  onValidateEmail = (e) => {
    const newContact = Object.assign({}, this.state.contact);
    this.onValidate('email', newContact['email'] || '', validator.isEmail, 'api/contacts/emailCheck')
  }

  onValidatePhoneNumber = (e) => {
    const newContact = Object.assign({}, this.state.contact);
    this.onValidate('email', newContact['phoneNumber'] || '', validator.isMobilePhone, 'api/contacts/phoneCheck')
  }

  

  onChangeContactProp = (e) => {
    const newContact = Object.assign({}, this.state.contact);

    // TODO : RECONCILIATE this boolean madness
    if (e.target.name === 'status') {
      newContact[e.target.name] = e.target.checked;
    } else newContact[e.target.name] = e.target.value;
    this.setState({contact : newContact});
  }

  onSubmitContact = (e) => {
    e.preventDefault();
    this.setState({phoneError: null, emailError: null});
    const {firstName, lastName, phoneNumber, email, profileUrl} = this.state.contact;
    const status = this.state.contact.status || false; // chances are user does not even click on thing
    // console.log('profileUrl:', profileUrl);
    if (this.state.edit) {
      // console.log('from edit:', this.state.contact);
      const id = this.state.contact.id;
      // console.log('id=', id);
      const contactIndex = this.state.data.findIndex(c => c._id === id);
      fetch(`api/contacts/${id}`, { 
        method: 'PUT', 
        body: JSON.stringify({
          profileUrl,
          firstName,
          lastName,
          phoneNumber,
          email,
          status
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then((res) => {
        // console.log('the res:', res);
        if (!res.success) { // potential uniqueness issue
          console.log('res:', res.error);
          var emailErrorMsg = null;
          var phoneErrorMsg = null;
          if (res.error.errors.email) {
            emailErrorMsg = 'Email Taken!!! Try a different one';
          }
          if (res.error.errors.phoneNumber) {
            phoneErrorMsg = 'Phone Taken!!! Try a different one';
          }
          console.log(emailErrorMsg, phoneErrorMsg);
          this.setState({ phoneError: phoneErrorMsg, emailError: emailErrorMsg });
        }
        else {
          const newData = this.state.data;
          newData[contactIndex].firstName = firstName;
          newData[contactIndex].lastName = lastName;
          newData[contactIndex].phoneNumber = phoneNumber;
          newData[contactIndex].email = email;
          newData[contactIndex].status = status;
          newData[contactIndex].profileUrl = profileUrl;
          this.setState({contact: null, edit: false, hideList: false, newData, phoneError: null, emailError: null});
        }
      }); 
    } else {
      console.log('entirely new', this.state.contact);
      fetch(`api/contacts`, { 
        method: 'POST', 
        body: JSON.stringify({
          firstName,
          lastName,
          phoneNumber,
          email,
          status,
          profileUrl
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then((res) => {
        if (!res.success) {
          console.log('res:', res);
          var emailErrorMsg = null;
          var phoneErrorMsg = null;
          if (res.error.errors.email) {
            emailErrorMsg = res.error.errors.email.message;
          }
          if (res.error.errors.phoneNumber) {
            phoneErrorMsg = res.error.errors.phoneNumber.message;
          }
          
          this.setState({ phoneError: phoneErrorMsg, emailError: emailErrorMsg });
        }
        else {
          console.log('hello');
          this.setState({contact: null, edit: false, hideList: false, phoneError: null, emailError: null});
          this.getContacts();
        }
      }); 
    }
  }

  onCancelSubmitContact = () => {
    this.setState({contact: null, edit: false, hideList: false, phoneError: null, emailError: null});
  }

  onNewContactProp = () => {
    console.log('on New Contact Prop:', this.state);
    this.setState({contact: null, edit: false, hideList: true})
  }

  onChangeProfileUrl = (contactProp) => {
    const newContact = this.state.edit ? Object.assign({}, this.state.contact) : Object.assign({}, contactProp);
    const randomStr = Math.random().toString(36).substring(10);
    fetch(`https://randomuser.me/api/?seed=${randomStr}&inc=picture`)
    .then(res => res.json())
    .then((res) => {
      console.log('hello:', res);
      if (res.results) {
        console.log('hi:', res.results[0].picture.large);
        newContact.profileUrl = res.results[0].picture.large;
        console.log('new COntact:', newContact);
        this.setState({contact: newContact});
      }
    })
  }

  // TO DO: Filter as user type ... 
  onSubmitSearch = () => {
    if (this.refs.search !== null) {
      const keyword = this.refs.search.value;
      fetch(`api/contacts/search/${keyword}`)
      .then(data => data.json())
      .then((res) => {
        if (!res.success) this.setState({ error: res.error });
        else {
          if (res.data.length > 0) {
            this.setState({ data: res.data });
          } else {
            console.log("No data. Keep last!!!");
          }
        }
      });
    }
  }

  onEnterKeyDown = () => {
    this.onSubmitSearch();
  }

  render() {
    return (
      <div className="App">
        <div className="container">
          <div className="header">
            <h1>
              <img src="/favicon.ico" className="header_img" alt="panel icon"/>
              Contact Book
            </h1>
          </div> 
          <br />
          {!this.state.hideList && <div>
            <input ref="search" type="text" className="list-group list-group-item" placeholder="Search" aria-label="Search" onKeyDown={() => {this.onEnterKeyDown();}} />
            <span>
              <a className="btn btn-outline-primary" onClick={() => {this.onSubmitSearch();}}>
                <span className="glyphicon glyphicon-search"></span>
              </a>
            </span>
          </div>}
          <br />
          {!this.state.hideList && <ContactList
            data={this.state.data}
            handleDelete={this.onDeleteContact}
            toggleContactStatus={this.onToggleContactStatus}
            editContact={this.onEditContact}
          />}
          {this.state.hideList && <ContactForm
            profileUrl={this.state.contact && this.state.contact.profileUrl}
            firstName={this.state.contact && this.state.contact.firstName}
            lastName={this.state.contact && this.state.contact.lastName}
            email={this.state.contact && this.state.contact.email}
            phoneNumber={this.state.contact && this.state.contact.phoneNumber}
            status={this.state.contact && this.state.contact.status}
            phoneError={this.state.phoneError}
            emailError={this.state.emailError}
            handleChangeText={this.onChangeContactProp}
            validatePhoneNumber={this.onValidateEmail}
            validateEmail={this.onValidateEmail}
            submitContact={this.onSubmitContact}
            cancelSubmitContact={this.onCancelSubmitContact}
            changeProfileUrl={this.onChangeProfileUrl}
          />}
          {!this.state.hideList && <button onClick={() => {this.onNewContactProp();}} className="btn btn-primary">
            <span className="glyphicon glyphicon-plus">
            </span>
          </button>}
        </div>
        <div>
          {/* error: {this.state.error && <p>{this.state.error}</p>} */}
        </div>
      </div>
    );
    
  }
}

export default App;
