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
        const enhancedPrompt = promptEnhanceResponse.choices[0].message?.content;
        await prisma.conversation.create({
            data: {
                role: "assistant",
                content: `I have enhanced your prompt to: "${enhancedPrompt}"`,
                projectId
            }
        })
        await prisma.conversation.create({
            data: {
                role: "assistant",
                content: 'Now making changes to your website...',
                projectId
            }
        })
        const codeGenerationResponse = await openai.chat.completions.create({
            model: 'z-ai/glm-4.5-air:free',
            messages: [
                {
                    role: 'system',
                    content: `You are an expert web developer. 

    CRITICAL REQUIREMENTS:
    - Return ONLY the complete updated HTML code with the requested changes.
    - Use Tailwind CSS for ALL styling (NO custom CSS).
    - Use Tailwind utility classes for all styling changes.
    - Include all JavaScript in <script> tags before closing </body>
    - Make sure it's a complete, standalone HTML document with Tailwind CSS
    - Return the HTML Code Only, nothing else

    Apply the requested changes while maintaining the Tailwind CSS styling approach.
`
                },{
                    role: 'user',
                    content: `Here Is The Current Website Code: "${currentProject.current_code}" The User Wants this Change: "${enhancedPrompt}"`
                }
            ]
        })
        const code = codeGenerationResponse.choices[0].message?.content || '';

        const version = await prisma.version.create({
            data: {
                code: code.replace(/```[a-z]*\n?/gi, '').replace(/```$/g, '').trim(),
                description: 'Chnages Made',
                projectId
            }

        })
        await prisma.conversation.create({
            data: {
                role: "assistant",
                content: "I've made the changes to your website! You can now preview it",
                projectId
            }
        })
        await prisma.websiteProject.update({
              where:{id: projectId},
              data: {
                  current_code: code.replace(/```[a-z]*\n?/gi, '').replace(/```$/g, '').trim(),
                  current_version_index: version.id
              }
        })

        res.json({message: "Changes Made Successfully"});
    } catch (error: any) {
        await prisma.user.update({
            where:{id: userId},
            data: {
                credits: { increment: 5 }
            }
        })
        console.log(error);
        res.status(500).json({message: error.code || error.message});
    }
}
export const rollbackToVersion = async(req:Request, res:Response) =>{
    try {
        const userId = req.userId;
        if(!userId){
            return res.status(401).json({message:"Unauthorized User"});  
        }
        const {projectId, versionId} = req.params;
        const project = await prisma.websiteProject.findUnique({
            where:{id: projectId, userId},
            include: {
                versions: true
            }
        })
        if(!project){
            return res.status(404).json({message:"Project Not Found"});
        }
        const version = await project.versions.find((version) => version.id === versionId);
        
        if(!version){
            return res.status(404).json({message:"Version Not Found"});
        }
        await prisma.websiteProject.update({
            where:{id: projectId, userId},
            data: {
                current_code: version.code,
                current_version_index: version.id
            }
        }) 
        await prisma.conversation.create({
            data: {
                role: "assistant",
                content: "I've rolled back to the previous version of your website! You can now preview it",
                projectId
            }
        })
        res.json({message: "Version Rolled Back"});
        
    } catch (error: any) {
        console.log(error);
        res.status(500).json({message: error.code || error.message});
        
    }
}
export const deleteproject = async(req:Request, res:Response) =>{
    try {
        const userId = req.userId;
        const {projectId} = req.params;
        
        
        await prisma.websiteProject.delete({
            where:{id: projectId, userId}
        })
        
        
        res.json({message: "Project Deleted Successfully"});
        
    } catch (error: any) {
        console.log(error);
        res.status(500).json({message: error.code || error.message});
        
    }
}

export const getProjectPreview = async(req:Request, res:Response) =>{
    try {
        const userId = req.userId;
        const {projectId} = req.params;
        
        if(!userId){
            return res.status(401).json({message:"Unauthorized User"});  
        }
        const project = await prisma.websiteProject.findFirst({
            where:{id: projectId, userId},
            include: {
                versions: true
            }
        })
        if(!project){
            return res.status(404).json({message:"Project Not Found"});
        }
        
        
        res.json({project});
        
    } catch (error: any) {
        console.log(error);
        res.status(500).json({message: error.code || error.message});
        
    }
}

export const getPublishedProjects = async(req:Request, res:Response) =>{
    try {
        
        
        
        const projects = await prisma.websiteProject.findMany({
            where:{isPublished: true},
            include: {
                user: true
            }
        })
        
        
        
        res.json({projects});
        
    } catch (error: any) {
        console.log(error);
        res.status(500).json({message: error.code || error.message});
        
    }
}
export const getProjectById = async(req:Request, res:Response) =>{
    try {
        const {projectId} = req.params;
        
        
        const project = await prisma.websiteProject.findFirst({
            where:{id: projectId},
            
        })
        
        if(!project || project.isPublished === false || !project?.current_code){
            return res.status(404).json({message:"Project Not Found"});
        }
        
        
        
        res.json({code: project.current_code});
        
    } catch (error: any) {
        console.log(error);
        res.status(500).json({message: error.code || error.message});
        
    }
}