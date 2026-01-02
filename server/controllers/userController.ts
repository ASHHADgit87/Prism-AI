import {Request,Response} from "express";
import prisma from "../lib/prisma.js";
import openai from "../configs/openai.js";
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
                name: initial_prompt.length > 50 ? initial_prompt.substring(0, 47) + "..." : initial_prompt,
                initial_prompt,
                userId
            }
        })
        await prisma.user.update({
            where:{id: userId},
            data: {
                totalCreation: {increment: 1},
            }
        })
        await prisma.conversation.create({
            data: {
                role: "user",
                content: initial_prompt,
                projectId: project.id,
            }
        })
        await prisma.user.update({
            where:{id: userId},
            data: {
                credits: {decrement: 5},
            }
        })
        res.json({projectId: project.id});
        const promptEnhanceResponse = await openai.chat.completions.create({
            model: 'z-ai/glm-4.5-air:free',
            messages: [
                {
                    role: 'system',
                    content: `You are a prompt enhancement specialist. Take the user's website request and expand it into a detailed, comprehensive prompt that will help create the best possible website.

    Enhance this prompt by:
    1. Adding specific design details (layout, color scheme, typography)
    2. Specifying key sections and features
    3. Describing the user experience and interactions
    4. Including modern web design best practices
    5. Mentioning responsive design requirements
    6. Adding any missing but important elements

Return ONLY the enhanced prompt, nothing else. Make it detailed but concise (2-3 paragraphs max).

`
                },
                {
                    role: 'user',
                    content: initial_prompt
                }
            ]
        })
        const enhancedPrompt = promptEnhanceResponse.choices[0].message.content;
        await prisma.conversation.create({
            data: {
                role: "assistant",
                content: ``,
                projectId: project.id,
            }
        })
    } catch (error: any) {
        console.log(error);
        res.status(500).json({message: error.code || error.message});
    }
}
