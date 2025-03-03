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

