import mongoose ,{Schema , Document, Types} from "mongoose";

export interface IToken extends Document{
    token: string;
    user: Types.ObjectId;
    createdAt: string;
    
}


const tokenSchema : Schema = new Schema({
    token:{
        type: String,
        required: true

    },
    user:{
        type:Types.ObjectId,
        ref:'user'
    },
    expiresAt:{
        type:Date,
        default: Date.now(),
        expires:'10m' //expirea en un dia
    }
    
})

const token= mongoose.model<IToken>('token', tokenSchema)
export default token