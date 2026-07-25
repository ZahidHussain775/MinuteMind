const express = require('express');
const router = require('express').Router();
const proctect = require('../middleware/auth.midleware');
const upload = require('../middleware/upload.middleware');
const meetingController = require('../controllers/meeting.controller');


router.post(
    '/upload', 
    proctect, 
    upload.single('audio'), 
    meetingController.uploadMeeting
);

router.get(
    '/', 
    proctect, 
    meetingController.getMeetings
);

router.get(
    '/:id', 
    proctect, 
    meetingController.getMeetingById
);
router.delete(
    '/:id', 
    proctect, 
    meetingController.deleteMeeting
);

module.exports = router;

