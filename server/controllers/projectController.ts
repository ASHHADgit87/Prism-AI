import { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import openai from "../configs/openai.js";

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
        if(user.credits < 5){
            return res.status(403).json({message:"Not enough credits"});
        }
        if(!message || message.trim() === '') {
            return res.status(400).json({message:"Please Enter a Valid Prompt!"});
        }

        const currentProject = await prisma.websiteProject.findUnique({
            where:{id: projectId, userId},
            include: {
                versions: true
            }
        })
        if(!currentProject){
            return res.status(404).json({message:"Project Not Found"});
        }
        await prisma.conversation.create({
            data: {
                role: "user",
                content: message,
                projectId
            }
        })
        await prisma.user.update({
            where:{id: userId},
            data: {
                credits: { decrement: 5 }
            }
        })
        const promptEnhanceResponse = await openai.chat.completions.create({
            model: 'z-ai/glm-4.5-air:free',
            messages: [
                {
                    role: 'system',
                    content: `You are a prompt enhancement specialist. The user wants to make changes to their website. Enhance their request to be more specific and actionable for a web developer.

    Enhance this by:
    1. Being specific about what elements to change
    2. Mentioning design details (colors, spacing, sizes)
    3. Clarifying the desired outcome
    4. Using clear technical terms

Return ONLY the enhanced request, nothing else. Keep it concise (1-2 sentences).
`
                },{
                    role: 'user',
                    content: `User's Request: "${message}"`
                }
            ]
        })
        res.json({credits: user?.credits});
    } catch (error: any) {
        console.log(error);
        res.status(500).json({message: error.code || error.message});
    }
}