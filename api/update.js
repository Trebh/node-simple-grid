'use strict';

var mongoose = require('mongoose');
var config = require('../config/config');

mongoose.connect(config.MONGODB_URL);