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
        res.status(500).json({message: error.code || error.message});
    }
}
export const createUserProject = async (req:Request, res:Response) => {
    const userId = req.userId;
    try {
        const {initial_prompt} = req.body;
        if(!userId){
            return res.status(401).json({message:"Unauthorized User"});  
        }
        const user = await prisma.user.findUnique({
            where:{id: userId},
            
        })
        if(user && user.credits < 5){
            return res.status(403).json({message:"Not enough credits"});
        }
        const project = await prisma.websiteProject.create({
            data: {
                name: initial_prompt,
                initial_prompt,
                userId
            }
        })
        await prisma.user.update({
            where:{id: userId},
            data: {
                credits: user?.credits - 5
            }
        })
        res.json({credits: user?.credits});
    } catch (error: any) {
        console.log(error);
        res.status(500).json({message: error.code || error.message});
    }
}
