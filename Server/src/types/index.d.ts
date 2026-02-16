export interface UserPayload {
    id:int;
    role:string;
    regNo:string;
  
}

declare global{
    namespace Express {
        interface Request{
            user:UserPayload
        }
    }
}