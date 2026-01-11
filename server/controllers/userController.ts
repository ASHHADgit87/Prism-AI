import { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import openai from "../configs/openai.js";
import { role } from "better-auth/plugins";
import { includes } from "better-auth";
import Stripe from "stripe";
export const getUserCredits = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized User" });
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    res.json({ credits: user?.credits });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.code || error.message });
  }
};
export const createUserProject = async (req: Request, res: Response) => {
  const userId = req.userId;
  try {
    const { initial_prompt } = req.body;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized User" });
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (user && user.credits < 5) {
      return res.status(403).json({ message: "Not enough credits" });
    }
    const project = await prisma.websiteProject.create({
      data: {
        name:
          initial_prompt.length > 50
            ? initial_prompt.substring(0, 47) + "..."
            : initial_prompt,
        initial_prompt,
        userId,
      },
    });
    await prisma.user.update({
      where: { id: userId },
      data: {
        totalCreation: { increment: 1 },
      },
    });
    await prisma.conversation.create({
      data: {
        role: "user",
        content: initial_prompt,
        projectId: project.id,
      },
    });
    await prisma.user.update({
      where: { id: userId },
      data: {
        credits: { decrement: 5 },
      },
    });
    res.json({ projectId: project.id });
    const promptEnhanceResponse = await openai.chat.completions.create({
      model: "xiaomi/mimo-v2-flash:free",
      messages: [
        {
          role: "system",
          content: `You are a prompt enhancement specialist. Take the user's website request and enhance it into a **detailed, professional, and modern website prompt** that will produce high-quality, visually appealing results. 

Enhance this prompt by:
1. Adding realistic placeholder images using URLs like https://placehold.co/600x400 or https://picsum.photos/600/400.
2. Choosing a modern, professional theme with complementary colors, typography, and gradients.
3. Specifying clear sections (hero, features, about, contact, footer) with proper spacing and alignment.
4. Making it fully responsive for mobile, tablet, and desktop.
5. Including interactive elements like buttons, hover effects, and transitions.
6. Ensuring the website looks professional and visually polished.

Return ONLY the enhanced prompt in 2-3 paragraphs max. Do NOT include markdown, explanations, or code.`,
        },
        {
          role: "user",
          content: initial_prompt,
        },
      ],
    });
    const enhancedPrompt = promptEnhanceResponse.choices[0].message.content;
    await prisma.conversation.create({
      data: {
        role: "assistant",
        content: `I've Enhanced Your Prompt to: ${enhancedPrompt}`,
        projectId: project.id,
      },
    });

    await prisma.conversation.create({
      data: {
        role: "assistant",
        content: "Now Genrating Your website...",
        projectId: project.id,
      },
    });
    const codeGenerationResponse = await openai.chat.completions.create({
      model: "xiaomi/mimo-v2-flash:free",
      messages: [
        {
          role: "system",
          content: `You are an expert web developer. Create a complete, **professional, modern, and visually appealing single-page website** based on the following request: "${enhancedPrompt}"

CRITICAL REQUIREMENTS:
- Use Tailwind CSS for ALL styling.
- Include <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script> in <head>.
- Make it fully responsive with mobile, tablet, and desktop layouts using Tailwind classes (sm:, md:, lg:, xl:).
- Use realistic placeholder images: https://placehold.co/600x400 or https://picsum.photos/600/400.
- Include interactive buttons, hover effects, animations, and transitions (animate-*, transition-*).
- Use modern typography and complementary color schemes (backgrounds, gradients).
- Include hero, features, about, contact, and footer sections.
- Use Google Fonts if needed.
- Return ONLY the full HTML document (no markdown, no explanations, no comments).
`,
        },
        {
          role: "user",
          content: enhancedPrompt || "",
        },
      ],
    });
    const code = codeGenerationResponse.choices[0].message.content || "";
    const version = await prisma.version.create({
      data: {
        code: code
          .replace(/```[a-z]*\n?/gi, "")
          .replace(/```$/g, "")
          .trim(),
        description: "Initial Version",
        projectId: project.id,
      },
    });
    await prisma.conversation.create({
      data: {
        role: "assistant",
        content:
          "Website Generated Successfully. Now You Can Preview Your Website and request changes",
        projectId: project.id,
      },
    });
    await prisma.websiteProject.update({
      where: { id: project.id },
      data: {
        current_code: code
          .replace(/```[a-z]*\n?/gi, "")
          .replace(/```$/g, "")
          .trim(),
        current_version_index: version.id,
      },
    });
  } catch (error: any) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        credits: {
          increment: 5,
        },
      },
    });
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getUserProject = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized User" });
    }
    const { projectId } = req.params;
    const project = await prisma.websiteProject.findUnique({
      where: { id: projectId, userId },
      include: {
        conversation: {
          orderBy: {
            timestamp: "asc",
          },
        },
        versions: {
          orderBy: {
            timestamp: "asc",
          },
        },
      },
    });

    res.json({ project });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.code || error.message });
  }
};

export const getUserProjects = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized User" });
    }

    const projects = await prisma.websiteProject.findMany({
      where: { userId },
      orderBy: {
        updatedAt: "desc",
      },
    });

    res.json({ projects });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.code || error.message });
  }
};

export const togglePublish = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized User" });
    }

    const { projectId } = req.params;
    const project = await prisma.websiteProject.findUnique({
      where: { id: projectId, userId },
    });
    if (!project) {
      return res.status(404).json({ message: "Project Not Found" });
    }
    await prisma.websiteProject.update({
      where: { id: project.id },
      data: {
        isPublished: !project.isPublished,
      },
    });

    res.json({
      message: project.isPublished
        ? "Project Unpublished Successfully"
        : "Project Published Successfully",
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.code || error.message });
  }
};

export const PurchaseCredits = async (req: Request, res: Response) => {
  try {
    interface Plan {
      credits: number;
      amount: number;
    }
    const plans = {
      basic: { credits: 100, amount: 5 },
      pro: { credits: 400, amount: 19 },
      enterprise: { credits: 1000, amount: 49 },
    };
    const userId = req.userId;

    const { planId } = req.body as { planId: keyof typeof plans };
    const origin = req.headers.origin as string;
    const plan: Plan = plans[planId];
    if (!plan) {
      return res.status(404).json({ message: "Plan Not Found" });
    }
    const transaction = await prisma.transaction.create({
      data: {
        userId: userId!,
        planId: req.body.planId,
        amount: plan.amount,
        credits: plan.credits,
      },
    });

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/loading`,
      cancel_url: `${origin}`,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Prism AI - ${plan.credits} credits`,
            },
            unit_amount: Math.floor(transaction.amount) * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        transactionId: transaction.id,
        appId: "prism-ai",
      },
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    });
    res.json({ payment_link: session.url });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.code || error.message });
  }
};
