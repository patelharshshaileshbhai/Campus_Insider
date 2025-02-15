"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_controller_1 = require("../controllers/data.controller");
const router = (0, express_1.Router)();
router.post('/create', data_controller_1.saveData);
router.get('/get', data_controller_1.getCollege);
router.get('/get/:id', data_controller_1.getCollegeById);
exports.default = router;
