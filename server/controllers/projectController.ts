import { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import openai from "../configs/openai.js";

export const makeRevisions = async (req: Request, res: Response) => {
  const userId = req.userId;
  try {
    const { projectId } = req.params;
    const { message } = req.body;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!userId || !user) {
      return res.status(401).json({ message: "Unauthorized User" });
    }
    if (user.credits < 5) {
      return res.status(403).json({ message: "Not enough credits" });
    }
    if (!message || message.trim() === "") {
      return res.status(400).json({ message: "Please Enter a Valid Prompt!" });
    }

    const currentProject = await prisma.websiteProject.findUnique({
      where: { id: projectId, userId },
      include: {
        versions: true,
      },
    });
    if (!currentProject) {
      return res.status(404).json({ message: "Project Not Found" });
    }
    await prisma.conversation.create({
      data: {
        role: "user",
        content: message,
        projectId,
      },
    });
    await prisma.user.update({
      where: { id: userId },
      data: {
        credits: { decrement: 5 },
      },
    });
    const promptEnhanceResponse = await openai.chat.completions.create({
      model: "xiaomi/mimo-v2-flash:free",
      messages: [
        {
          role: "system",
          content: `You are a prompt enhancement specialist. The user wants to make changes to their website. Rewrite their request into a **clear, actionable, professional instruction** for a web developer.

Enhance this by:
1. Specifying which elements to change (text, images, sections, colors, layout).
2. Adding design guidance (colors, spacing, font sizes, hover effects).
3. Ensuring the website remains modern and professional.
4. Using concise, technical, actionable language.

Return ONLY the enhanced request in 1-2 sentences. Do NOT include markdown, explanations, or extra text.`,
        },
        {
          role: "user",
          content: `User's Request: "${message}"`,
        },
      ],
    });
    const enhancedPrompt = promptEnhanceResponse.choices[0].message?.content;
    await prisma.conversation.create({
      data: {
        role: "assistant",
        content: `I have enhanced your prompt to: "${enhancedPrompt}"`,
        projectId,
      },
    });
    await prisma.conversation.create({
      data: {
        role: "assistant",
        content: "Now making changes to your website...",
        projectId,
      },
    });
    const codeGenerationResponse = await openai.chat.completions.create({
      model: "xiaomi/mimo-v2-flash:free",
      messages: [
        {
          role: "system",
          content: `You are an expert web developer. Apply the user's requested changes to create a **professional, modern, visually appealing website**.

CRITICAL REQUIREMENTS:
- Update the existing HTML code "${currentProject.current_code}" according to the enhanced prompt "${enhancedPrompt}".
- Use Tailwind CSS only, including animations and responsive design.
- Use realistic placeholder images (https://placehold.co/600x400 or https://picsum.photos/600/400).
- Maintain sections like hero, features, about, contact, and footer.
- Ensure professional colors, typography, spacing, hover effects, transitions, and gradients.
- Return ONLY the complete updated HTML document; do NOT include markdown, explanations, or comments.`,
        },
        {
          role: "user",
          content: `Here Is The Current Website Code: "${currentProject.current_code}" The User Wants this Change: "${enhancedPrompt}"`,
        },
      ],
    });
    const code = codeGenerationResponse.choices[0].message?.content || "";

    if (!code) {
      await prisma.conversation.create({
        data: {
          role: "assistant",
          content: "I was unable to generate the code. Please try again later.",
          projectId,
        },
      });
      await prisma.user.update({
        where: { id: userId },
        data: {
          credits: { increment: 5 },
        },
      });
      return;
    }

    const version = await prisma.version.create({
      data: {
        code: code
          .replace(/```[a-z]*\n?/gi, "")
          .replace(/```$/g, "")
          .trim(),
        description: "Chnages Made",
        projectId,
      },
    });
    await prisma.conversation.create({
      data: {
        role: "assistant",
        content:
          "I've made the changes to your website! You can now preview it",
        projectId,
      },
    });
    await prisma.websiteProject.update({
      where: { id: projectId },
      data: {
        current_code: code
          .replace(/```[a-z]*\n?/gi, "")
          .replace(/```$/g, "")
          .trim(),
        current_version_index: version.id,
      },
    });

    res.json({ message: "Changes Made Successfully" });
  } catch (error: any) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        credits: { increment: 5 },
      },
    });
    console.log(error);
    res.status(500).json({ message: error.code || error.message });
  }
};
export const rollbackToVersion = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized User" });
    }
    const { projectId, versionId } = req.params;
    const project = await prisma.websiteProject.findUnique({
      where: { id: projectId, userId },
      include: {
        versions: true,
      },
    });
    if (!project) {
      return res.status(404).json({ message: "Project Not Found" });
    }
    const version = await project.versions.find(
      (version) => version.id === versionId
    );

    if (!version) {
      return res.status(404).json({ message: "Version Not Found" });
    }
    await prisma.websiteProject.update({
      where: { id: projectId, userId },
      data: {
        current_code: version.code,
        current_version_index: version.id,
      },
    });
    await prisma.conversation.create({
      data: {
        role: "assistant",
        content:
          "I've rolled back to the previous version of your website! You can now preview it",
        projectId,
      },
    });
    res.json({ message: "Version Rolled Back" });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.code || error.message });
  }
};
export const deleteproject = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { projectId } = req.params;

    await prisma.websiteProject.delete({
      where: { id: projectId, userId },
    });

    res.json({ message: "Project Deleted Successfully" });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.code || error.message });
  }
};

export const getProjectPreview = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { projectId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized User" });
    }
    const project = await prisma.websiteProject.findFirst({
      where: { id: projectId, userId },
      include: {
        versions: true,
      },
    });
    if (!project) {
      return res.status(404).json({ message: "Project Not Found" });
    }

    res.json({ project });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.code || error.message });
  }
};

export const getPublishedProjects = async (req: Request, res: Response) => {
  try {
    const projects = await prisma.websiteProject.findMany({
      where: { isPublished: true },
      include: {
        user: true,
      },
    });

    res.json({ projects });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.code || error.message });
  }
};
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;

    const project = await prisma.websiteProject.findFirst({
      where: { id: projectId },
    });

    if (!project || project.isPublished === false || !project?.current_code) {
      return res.status(404).json({ message: "Project Not Found" });
    }

    res.json({ code: project.current_code });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.code || error.message });
  }
};
export const saveProjectCode = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { projectId } = req.params;

    const { code } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized User" });
    }
    if (!code) {
      return res.status(400).json({ message: "Code is required" });
    }
    const project = await prisma.websiteProject.findUnique({
      where: { id: projectId, userId },
    });

    if (!project) {
      return res.status(404).json({ message: "Project Not Found" });
    }
    await prisma.websiteProject.update({
      where: { id: project.id },
      data: {
        current_code: code,
        current_version_index: "",
      },
    });

    res.json({ message: "Project And Code Saved Successfully" });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.code || error.message });
  }
};
