"use server";
import { revalidatePath } from "next/cache";

import User from "../database/models/user.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";


export async function createUser(user:CreateUserParams) {
    try{
        await connectToDatabase();
        const newUser=await User.create(user);
        return JSON.parse(JSON.stringify(newUser));

    }catch(error){
        handleError(error);

    }
    
}
// READ
export async function getUserById(userId:string) {
    try{
        await connectToDatabase();
        const user=await User.findOne({clerkId:userId});
        if(!user){
            throw new Error("User Not Found");
        }
        return JSON.parse(JSON.stringify(user));

    }catch(error){
        handleError(error);
    }
    
}
// UPDATE
export async function updateUser(clerkId:string,user:UpdateUserParams) {
    try{

        await connectToDatabase();
        const updateUser=await User.findByIdAndUpdate({clerkId},user,{new: true});
        if(!updateUser)throw new Error("User Not Found");
        return JSON.parse(JSON.stringify(updateUser));

    }catch(error){
        handleError(error);
    }
    

    

}
// DELETE
export async function deleteUser(clerkId:string) {
    try{
        await connectToDatabase();
        //find user to delete
        const userTodelete=await User.findOne({clerkId});
        if(!userTodelete)throw new Error("User Not Found");
        const deleteUser=await User.findByIdAndDelete(userTodelete._id);
        revalidatePath("/");
        return deleteUser?JSON.parse(JSON.stringify(deleteUser)):null;
    }catch(error){
        handleError(error);
    }
    
}
// USE CREDITS
export async function updateCredits(userId:string,creditFee:number) {
    try{
        await connectToDatabase();
        const updatedUserCredits=await User.findOneAndUpdate(
            {_id:userId},
            {$inc:{creditBalance:creditFee}},
            {new:true}
            );
            if(!updatedUserCredits)throw new Error("User credits update failed");
            return JSON.parse(JSON.stringify(updateCredits));

    }catch(error){
        handleError(error);
    }
    
}