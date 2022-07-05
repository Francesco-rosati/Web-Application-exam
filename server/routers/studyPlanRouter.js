'use strict';

const express = require('express');
const { body, validationResult } = require('express-validator');

const router = express.Router();
const db = require('../modules/dbManager').study_plan_DAO;
const studentDB = require('../modules/dbManager').student_DAO;
const coursesDB = require('../modules/dbManager').courses_DAO;

const StudyPlanService = require('../services/studyPlan_service');

const studyPlan_service = new StudyPlanService(db, studentDB, coursesDB);

//Custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({ error: 'Unauthorized' });
}

// STUDY_PLANS APIs ----------------------------------------------------------------------

// GET /api/coursesStudent
router.get('/coursesStudent',
    isLoggedIn,
    async (req, res) => {

        const result = await studyPlan_service.getCoursesStudentByStudentId(req.user.id);

        switch (result) {
            case 404:
                return res.status(404).json({ error: "404 Not Found -> Student doesn't exist in the database!" });
            case 500:
                return res.status(500).json({ error: "500 Internal Server Error -> Cannot get student's study plan from database!" });
            default:
                return res.status(200).json(result);
        }

    });

// POST /api/newCoursesStudent
router.post('/newCoursesStudent',
    [body('codes.*').isAlphanumeric().isLength({ min: 7, max: 7 }),
    body('type').isInt({ min: 0, max: 1 })],
    isLoggedIn,
    async (req, res) => {

        const errors = validationResult(req);

        if (Object.keys(req.body).length === 0) {
            return res.status(422).json({ error: "422 Empty Body" });
        }

        if (Object.keys(req.body).length !== 2 || !errors.isEmpty()) {
            return res.status(422).json({ error: "422 Data not formatted properly" });
        }

        const result = await studyPlan_service.setCourseStudent(req.body.codes, req.user.id, req.body.type);

        switch (result) {
            case "c404":
                return res.status(404).json({ error: "404 Not Found" });
            case "c422":
                return res.status(422).json({ error: "422 Unprocessable Entity" });
            case "c503":
                return res.status(503).json({ error: "503 Service Unavailable" });
            default:
                return res.status(201).json(result);
        }

    });

// DELETE /api/allCoursesStudent
router.delete('/allCoursesStudent',
    isLoggedIn,
    async (req, res) => {

        const result = await studyPlan_service.deleteAllCoursesStudent(req.user.id);

        switch (result) {
            case 404:
                return res.status(404).json({ error: "404 User Not found" });
            case 503:
                return res.status(503).json({ error: "503 Service Unavailable -> Cannot delete study plan from the database!" });
            default:
                return res.status(204).end();
        }

    });

module.exports = router;