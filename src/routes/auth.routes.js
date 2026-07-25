const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth.controller');
const  validate  = require('../middleware/validation.middleware');
const { registerSchema, loginSchema } = require('../validators/auth.validators');
const protect = require('../middleware/auth.midleware');
const upload = require('../middleware/upload.middleware');


router.post(
    '/register', 
    validate(registerSchema), 
    auth.register
);
    
router.post(
    '/login',
    validate(loginSchema), 
    auth.login
);

router.post(
    '/logout', 
    protect, 
    auth.logout
);

router.get(
    '/me', 
    protect, 
    auth.getMe
);

router.post(
    '/upload', 
    protect, 
    upload.single('video'), 
    auth.uploadMeeting
);

module.exports = router;