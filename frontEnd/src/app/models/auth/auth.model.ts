export interface IregisterUser {
    fullname :string,
     email : string, 
     password : string, 
     username : string, 
     gender : string,
}

export interface IResponse {
    statusCode:number,
    data:[],
    message: string,
    success: boolean,
    error: string | null
}

export interface IloginRes{
    
        statusCode: number,
        data: {
            userData: {
                id: string,
                fullname: string,
                email: string,
                username: string,
                gender: string,
                profileUrl: string
            },
            token: string
        },
        message:string, 
        success:boolean,
        error: string | null
    
}

