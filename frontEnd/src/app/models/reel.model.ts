export interface IReelResponse {
    statusCode: 200;
    data : {
        reels : Reel[],
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    },
    message : string;
    success : boolean;
    error : null | string;
}


export interface ReelResponse {
  
}


export interface User {
    id: string;
    fullname: string;
    username: string;
    profileUrl: string;
  }
  
  export interface Reel {
    id: string;
    caption: string;
    videoUrl: string;
    publicId: string;
    createdAt: string;
    user: User;
  }