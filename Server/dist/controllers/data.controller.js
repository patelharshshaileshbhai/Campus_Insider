"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCollegeById = exports.getCollege = exports.saveData = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const errorHandler_1 = require("../utils/errorHandler");
const StatusCodes_1 = require("../utils/StatusCodes");
// College Data
const engineeringColleges = {
    degree: {
        gtu_affiliated_colleges: [
            { name: "L.D. College of Engineering", location: "Ahmedabad", type: "Government" },
            { name: "Vishwakarma Government Engineering College", location: "Chandkheda", type: "Government" },
            { name: "Ahmedabad Institute of Technology", location: "Ahmedabad", type: "Private" },
            { name: "Silver Oak College of Engineering and Technology", location: "Ahmedabad", type: "Private" },
            { name: "Gujarat Power Engineering and Research Institute", location: "Mehsana", type: "Private" },
            { name: "Sarvajanik College of Engineering & Technology", location: "Surat", type: "Private" },
            { name: "U.V. Patel College of Engineering", location: "Mehsana", type: "Private" },
            { name: "Birla Vishvakarma Mahavidyalaya", location: "Anand", type: "Government" },
            { name: "Government Polytechnic, Ahmedabad", location: "Ahmedabad", type: "Government" },
            { name: "Parul Polytechnic Institute", location: "Vadodara", type: "Private" },
        ],
        private_colleges: [
            { name: "Dhirubhai Ambani Institute of Information and Communication Technology", location: "Gandhinagar", type: "Private", affiliation: "Autonomous" },
            { name: "Nirma University - Institute of Technology", location: "Ahmedabad", type: "Private", affiliation: "Private University" },
            { name: "Pandit Deendayal Energy University (PDEU)", location: "Gandhinagar", type: "Private", affiliation: "Private University" },
            { name: "Ahmedabad University - School of Engineering and Applied Science", location: "Ahmedabad", type: "Private", affiliation: "Private University" },
        ],
    },
    diploma: {
        gtu_affiliated_colleges: [
            { name: "Dr. S & S.S. Ghandhy College of Engineering & Technology", location: "Surat", type: "Government" },
            { name: "Shantilal Shah Engineering College", location: "Bhavnagar", type: "Government" },
            { name: "Government Engineering College, Gandhinagar", location: "Gandhinagar", type: "Government" },
        ],
        private_colleges: [
            { name: "Noble Group of Institutions", location: "Junagadh", type: "Private", affiliation: "Autonomous" },
            { name: "Sigma Institute of Engineering", location: "Vadodara", type: "Private", affiliation: "Autonomous" },
            { name: "Swaminarayan College of Engineering and Technology", location: "Kalol", type: "Private", affiliation: "Autonomous" },
            { name: "Bhagwan Mahavir Polytechnic", location: "Surat", type: "Private", affiliation: "Autonomous" },
        ],
    },
};
// Function to save data
exports.saveData = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    for (const category in engineeringColleges) {
        // console.log(category);
        const typedCategory = category; // Type assertion
        console.log(typedCategory);
        for (const subCategory in engineeringColleges[typedCategory]) {
            //   console.log(subCategory);
            const typedSubCategory = subCategory;
            //   console.log(typedSubCategory);
            const categoryKey = `${typedCategory}_${typedSubCategory}`;
            //   console.log(categoryKey);
            for (const college of engineeringColleges[typedCategory][typedSubCategory]) {
                yield prisma_1.default.college.create({
                    data: {
                        name: college.name,
                        location: college.location,
                        type: college.type,
                        affiliation: college.affiliation || null,
                        category: categoryKey,
                    },
                });
            }
        }
        res.status(200).json(new errorHandler_1.ApiResponse(200, engineeringColleges, "Data saved successfully"));
    }
}));
// Execute function
exports.getCollege = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const colleges = yield prisma_1.default.college.findMany({ select: { id: true, name: true, location: true, type: true, affiliation: true, category: true, reviews: true } });
    res.status(200).json(new errorHandler_1.ApiResponse(200, colleges, "Colleges fetched successfully"));
}));
exports.getCollegeById = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const college = yield prisma_1.default.college.findUnique({ where: { id } });
    if (!college) {
        res.status(StatusCodes_1.StatusCode.NOT_FOUND).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.NOT_FOUND, null, "College not found"));
        return;
    }
    res.status(StatusCodes_1.StatusCode.OK).json(new errorHandler_1.ApiResponse(StatusCodes_1.StatusCode.OK, college, "College fetched successfully"));
}));
