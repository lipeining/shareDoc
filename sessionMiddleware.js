var session = require('express-session');
var sessionParser = session({
    secret: 'wow_doc',
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 6000000
    } //100 min
  });
module.exports = {sessionParser};  