const express = require('express');

const router = express.Router();
const { postCategory } = require('../Controller/Category_controller');


router.post('/postcategory',postCategory);

module.exports = router