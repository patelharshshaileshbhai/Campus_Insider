import prisma from "../config/prisma";
import { ApiResponse, asyncHandler } from "../utils/errorHandler";
import express,{ Request, Response } from "express";
import { StatusCode } from "../utils/StatusCodes";




// Define types
interface College {
  name: string;
  location: string;
  type: string;
  affiliation?: string;
}

interface EngineeringColleges {
  degree: {
    gtu_affiliated_colleges: College[];
    private_colleges: College[];
  };
  diploma: {
    gtu_affiliated_colleges: College[];
    private_colleges: College[];
  };
}

// College Data
const engineeringColleges: EngineeringColleges = {
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
export const saveData=asyncHandler(async(req:Request,res:Response)=>{
    for (const category in engineeringColleges) {
        // console.log(category);
        const typedCategory = category as keyof EngineeringColleges; // Type assertion
        console.log(typedCategory);
    
        for (const subCategory in engineeringColleges[typedCategory]) {
        //   console.log(subCategory);
          const typedSubCategory = subCategory as keyof EngineeringColleges[keyof EngineeringColleges];
        //   console.log(typedSubCategory);
          const categoryKey = `${typedCategory}_${typedSubCategory}`;
        //   console.log(categoryKey);
    
          for (const college of engineeringColleges[typedCategory][typedSubCategory]) {
            await prisma.college.create({
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
      
     res.status(200).json(new ApiResponse(200,engineeringColleges,"Data saved successfully"))
    } 
    
   
})

// Execute function

export const getCollege=asyncHandler(async(req:Request,res:Response)=>{
    const colleges=await prisma.college.findMany({})
    res.status(200).json(new ApiResponse(200,colleges,"Colleges fetched successfully"))
})


export const getCollegeById: express.RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const college = await prisma.college.findUnique({ where: { id } });
  if (!college) {
      res.status(StatusCode.NOT_FOUND).json(new ApiResponse(StatusCode.NOT_FOUND, null, "College not found"));
      return;
  }
  res.status(StatusCode.OK).json(new ApiResponse(StatusCode.OK, college, "College fetched successfully"));
});
