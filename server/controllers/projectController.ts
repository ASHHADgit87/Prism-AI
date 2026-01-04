import { Request, Response } from "express";
import prisma from "../lib/prisma.js";

export const makeRevisions = async (req:Request, res:Response) => {
    const userId = req.userId;
    try {
        const {projectId} = req.params;
        const {message} = req.body;
        const user = await prisma.user.findUnique({
            where:{id: userId},
            
        })
        if(!userId || !user){
            return res.status(401).json({message:"Unauthorized User"});  
        }
        if(user.credits < 2){
            return res.status(403).json({message:"Not enough credits"});
        }
        if(!message || message.trim() === '') {
            return res.status(400).json({message:"Please Enter a Valid Prompt!"});
        }

        const currentProject = await prisma.websiteProject.findUnique({
            
        })
        res.json({credits: user?.credits});
    } catch (error: any) {
        console.log(error);
        res.status(500).json({message: error.code || error.message});
    }
}