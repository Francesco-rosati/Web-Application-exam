'use strict';

const express = require('express');

const router = express.Router();
const db = require('../modules/dbManager').courses_DAO;
const studentDB = require('../modules/dbManager').student_DAO;

const CourseService = require('../services/course_service');

const course_service = new CourseService(db,studentDB);

// COURSE APIs ----------------------------------------------------------------------

// GET /api/courses
router.get('/courses', async (req, res) => {

    const result = await course_service.getCourses();

    switch (result) {
        case 500:
            return res.status(500).json({ error: "500 Internal Server Error -> Cannot get courses from database!" });
        default:
            return res.status(200).json(result);
    }

});

// INCOMPATIBILITIES APIs ----------------------------------------------------------------------

// GET /api/incompatibilities
router.get('/incompatibilities', async (req, res) => {

    const result = await course_service.getIncompatibilities();

    switch (result) {
        case 500:
            return res.status(500).json({ error: "500 Internal Server Error -> Cannot get incompatibilities from database!" });
        default:
            return res.status(200).json(result);
    }

});

module.exports = router;