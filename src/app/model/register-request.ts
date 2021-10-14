export class RegisterRequest{
    username: string 
    email: string
    password: string 
    userType: string
    gender: string
    avatarType: string

    constructor(password: string, username:string, userType:string, email:string, gender:string, avatarType:string){
        this.password = password;
        this.username = username;
        this.userType = userType;
        this.email = email;
        this.gender = gender;
        this.avatarType = avatarType;
    }
}