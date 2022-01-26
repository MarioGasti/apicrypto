const express = require('express');
const router = express.Router();

const req = require('./CMC/req');

router.get('/', req.test);
// router.post('/post', req.helloWorldPost);

module.exports = router;