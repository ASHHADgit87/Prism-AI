import {Request,Response} from "express";
import prisma from "../lib/prisma.js";
export const getUserCredits = async (req:Request, res:Response) => {
    try {
        const userId = req.userId;
        if(!userId){
            return res.status(401).json({message:"Unauthorized User"});  
        }
        const user = await prisma.user.findUnique({
            where:{id: userId},
            
        })
        res.json({credits: user?.credits});
    } catch (error: any) {
        console.log(error);
        res.status(401).json({message: error.code || error.message});
    }
}