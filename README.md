## [DEMO](http://murmuring-plateau-74881.herokuapp.com)

## Techs : React, ExpressJS, MongoDB. 

> To run on local:

> git clone git@github.com:hoduc/contact-book.git

> cd contact-book

> yarn && yarn start

> open new terminal from current directory

> cd Client && yarn && yarn start

> When both terminal finished, go to localhost:3000/

# Minimum Viable Product ( MVP ). With pictures

## List contacts ( Default view )

![list](https://raw.githubusercontent.com/hoduc/contact-book/master/demo/list.gif)

## Add a contact

![add](https://raw.githubusercontent.com/hoduc/contact-book/master/demo/add.gif)

## Edit a contact

![edit](https://raw.githubusercontent.com/hoduc/contact-book/master/demo/edit.gif)

## Delete a contact

![delete](https://raw.githubusercontent.com/hoduc/contact-book/master/demo/delete.gif)

## Inactivate a contact

![toggle](https://raw.githubusercontent.com/hoduc/contact-book/master/demo/toggle.gif)

## Validation

![validation](https://raw.githubusercontent.com/hoduc/contact-book/master/demo/validation.gif)

## Design paper (pen and sketch)

![list_contact](https://raw.githubusercontent.com/hoduc/contact-book/master/demo/design.jpg)


# Folder structure
```
README.md
  Server.js           --> Route request/CRUD
  Contact.js          --> Model
  Client/
    public/           --> static web files
    src/
      App.js          --> Main Component
      Contact.js      --> ListItem
      ContactList.js  --> List
      ContactForm.js  --> Edit List Item/ Create new one

(other files are omitted for brevity)
```

# API documentation

> *end points are preprended with /api/, i.e, /api/contacts

| End points | Methds | Params/ body | Description                  |
| --------- | ------ | ------------ | -----------------------------|
| `/contacts` | GET    |              | Get all the current contacts |
| `/contacts` | POST   | request body format {firstname: string, lastName: string, phoneNumber: string, email: string, status: boolean, profileUrl: string} | Create a new contact given passed in fields[Form]|
| `/contacts/:contactId` | PUT/DELETE | *params*: contact id, request body format {firstname: string, lastName: string, phoneNumber: string, email: string, status: boolean, profileUrl: string} | Update an existing contact's fields [Form/list item edit]/ Delete existing contact |


# Design decision/ Rationale

**`React`**: Just out of curiosity, I want to to try something new instead of the familiar Angular. Did not take long to craft a quick project.

**`MongoDB`**: For a project of this scale(small), MongoDB is actually quite a niche: noSQL database stored data in JSON, a format that Javascript handles/supports very well. It is very loosely structurized, suitable for continuous development,i.e, adding one more field won't break the schema.etc. Also trying it out for the first time.
( Note: I used **Mongoose** as a soft ORM layer to the DB )

**`ExpressJS`**: Server routing. Fast and to the point, easy to setup and test. Did not take many times to learn.

**`Bootstrap`**: Yeah, the number one solution to responsive web design. Scale well to different screen size.

*Small feature*: randomly polling random user profile picture(if user choose to) using third party [RANDOM USER GENERATOR](https://randomuser.me/).

> Time line: Design (`0.5 day`), Code (`1 day`), Deploy(`0.5 day`), Documentation( `0.25 day`)

# Future improvement ( provided times)


- [x] **- Text search** : Add a searchable by all indexable fields with weight so that user could quickly look up a certain contact. MongoDB natively supports full text search I belive. Was not able to make it work.

- [ ] **- Sort list and pagination** : Add the ability to sort the list by certain criteria( predefined +/- custom ). How would one deal with millions data( background polling ? only pull viewable area data )

- [] **- Import/Export to vcards** : To easily import/export data to multiple platforms. 

- [ ] **- Mobile gesture** : 3D touch ? Force touch.

- [ ] **- Animation/Transition/Themes** : between views.

- [ ] **- More descriptive validation message**

- [ ] **- Customizable theme options**

- [ ] **- Revamp UI**

**- TBD, ... **
