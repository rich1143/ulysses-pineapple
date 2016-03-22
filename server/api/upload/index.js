'use strict';

var express = require('express');
var controller = require('./upload.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/', auth.hasRole('organizer'), controller.index);
router.get('/:id', auth.hasRole('organizer'), controller.show);
router.post('/', auth.hasRole('organizer'), controller.create);
router.put('/:id', auth.hasRole('organizer'), controller.update);
router.patch('/:id', auth.hasRole('organizer'), controller.update);
router.delete('/:id', auth.hasRole('organizer'), controller.destroy);

module.exports = router;
