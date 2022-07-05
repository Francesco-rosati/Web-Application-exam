'use strict';

const express = require('express');

const router = express.Router();
const passport = require('../passport');

// STUDENT APIs ----------------------------------------------------------------------

// POST /studentSessions
router.post('/studentSessions', function (req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if (err)
            return next(err);
        if (!user) {
            return res.status(401).json(info);
        }
        req.login(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.json(req.user);
        });
    })(req, res, next);
});

// GET /sessions/currentStudent
router.get('/sessions/currentStudent', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json(req.user);
    }
    else
        res.status(401).json({ error: '401 Unauthorized' });;
});

// DELETE /sessions/currentStudent
router.delete('/sessions/currentStudent', (req, res) => {
    req.logout(() => { res.end(); });
});

module.exports = router;