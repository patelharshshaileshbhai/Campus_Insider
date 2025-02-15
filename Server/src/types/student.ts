// src/types/student.ts
export interface Student {
    fullname: string;
    email: string;
    password: string;
    collegeId: string;
    enrollment: string;
    gender: "male" | "female" | "other";
}

