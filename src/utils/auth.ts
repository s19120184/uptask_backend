import bcrypt from "bcrypt";

export const hashPassword =async (password:string)=>{
     //hashear password
     const salt= await bcrypt.genSalt(10)
     return await bcrypt.hash(password, salt)
}

export const checkPassword = async (password:string,  storedhash:string)=>{
     return await bcrypt.compare(password, storedhash)

}