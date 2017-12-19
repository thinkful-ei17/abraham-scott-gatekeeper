'use strict';

const express = require('express');
// you'll need to use `queryString` in your `gateKeeper` middleware function
const queryString = require('query-string');
const morgan = require('morgan');


const app = express();

app.use(morgan('common'));

const USERS = [
  {
    id: 1,
    firstName: 'Joe',
    lastName: 'Schmoe',
    userName: 'joeschmoe@business.com',
    position: 'Sr. Engineer',
    isAdmin: true,
    // NEVER EVER EVER store passwords in plain text in real life. NEVER!!!!!!!!!!!
    password: 'password'
  },
  {
    id: 2,
    firstName: 'Sally',
    lastName: 'Student',
    userName: 'sallystudent@business.com',
    position: 'Jr. Engineer',
    isAdmin: true,
    // NEVER EVER EVER store passwords in plain text in real life. NEVER!!!!!!!!!!!
    password: 'password'
  },
  {
    id: 3,
    firstName: 'Lila',
    lastName: 'LeMonde',
    userName: 'lila@business.com',
    position: 'Growth Hacker',
    isAdmin: false,
    // NEVER EVER EVER store passwords in plain text in real life. NEVER!!!!!!!!!!!
    password: 'password'
  },
  {
    id: 4,
    firstName: 'Freddy',
    lastName: 'Fun',
    userName: 'freddy@business.com',
    position: 'Community Manager',
    isAdmin: false,
    // NEVER EVER EVER store passwords in plain text in real life. NEVER!!!!!!!!!!!
    password: 'password'
  }
];


// write a `gateKeeper` middleware function that:
//  1. looks for a 'x-username-and-password' request header
//  2. parses values sent for `user` and `pass` from 'x-username-and-password'
//  3. looks for a user object matching the sent username and password values
//  4. if matching user found, add the user object to the request object
//     (aka, `req.user = matchedUser`)
//This function should get the string value sent for the request header 'x-username-and-password'. You can use the req.get('x-username-and-password') to retrieve the header value.
/* Use queryString(already imported at the top of server.js) to parse the values for user and pass from the request header.Specifically, use the queryString.parse method, which is designed for parsing URL query params.For instance, queryString.parse('catName=george&dogName=georgette') would produce { catName: 'george', dogName: 'georgette' }.
// Check the user credentials against the USERS, array.You'll probably want to use the .find array method for this.
// If a matching user is found, set req.user to that user.Otherwise, req.user should be either null or undefined.Note that you should never explicitly set a value to undefined, but depending on your implementation, req.user might end up being undefined.
// The easiest way to test your app as you work on it is to use Postman.Make a GET request to base - url -for-your - app / api / users / me.You'll need to set a request header in the headers tab, with a key x-username-and-password and a value like user=joeschmoe@business.com&pass=password. */

function gateKeeper(req, res, next) {
  console.log('gateKeeper ran');
  const userString = (req.headers['x-username-and-password']); 
  console.log(queryString.parse(userString)); 
  const { user, pass } = queryString.parse(userString);
  console.log(user, pass);
  next();
}

app.use(gateKeeper);
// Add the middleware to your app!

// this endpoint returns a json object representing the user making the request,
// IF they supply valid user credentials. This endpoint assumes that `gateKeeper` 
// adds the user object to the request if valid credentials were supplied.
app.get('/api/users/me', (req, res) => {
  // send an error message if no or wrong credentials sent
  if (req.user === undefined) {
    return res.status(403).json({ message: 'Must supply valid user credentials' });
  }
  // we're only returning a subset of the properties
  // from the user object. Notably, we're *not*
  // sending `password` or `isAdmin`.
  const { firstName, lastName, id, userName, position } = req.user;
  return res.json({ firstName, lastName, id, userName, position });
});

// app.listen(process.env.PORT, () => {
//   console.log(`Your app is listening on port ${process.env.PORT}`);
// });

app.listen(process.env.PORT || 8080, () => console.log(
  `Your app is listening on port ${process.env.PORT || 8080}`));
