'use strict';

const passport = require('passport');  //Authentication middleware
const LocalStrategy = require('passport-local').Strategy;   //Username and password for login

const studentDao = require('./modules/dbManager').student_DAO;

/*** Set up Passport ***/

passport.use(new LocalStrategy(
    function(username, password, done) {
  
      studentDao.getStudent(username, password).then((user) => {
        if (!user){
          return done(null, false, { message: 'Incorrect username and / or password.' });
        }
          
        return done(null, user);
      })
    }
  ));
  
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    studentDao.getStudentById(id)
      .then(user => {
        done(null, user);
      }).catch(err => {
        done(err, null);
      });
  });

module.exports = passport;