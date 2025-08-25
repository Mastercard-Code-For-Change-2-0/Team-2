import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, error: "Message is required" });
    }

    const today = new Date().toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    // --- Start of Prompt Engineering ---
    const ProblemStatement = `
      Katalyst's annual enrollment initiative empowers high-potential young women from low-income
      communities to pursue and excel in STEM (Science, Technology, Engineering, and Mathematics) careers.
      While Katalyst's current methods of gathering data—such as manual forms and generic event links—are
      adequate for capturing initial interest of students, they fall short in tracking the effectiveness
      of specific events and conversion of leads. This limitation makes it difficult for the organization
      to evaluate event performance, monitor the journey of potential candidates, and consistently provide
      accurate, up-to-date information to key stakeholders.
    `;

    const systemPrompt = `
      You are an expert technical consultant and project advisor specializing in developing digital solutions
      for Non-Governmental Organizations (NGOs), particularly those focused on education and STEM empowerment.
      Your name is 'Priya'. You are technically proficient, solution-oriented, and experienced in building
      scalable web applications for social impact organizations.

      ## Your Current Task
      You are advising on the following technical challenge:
      ---
      ORGANIZATION: A real world NGO named Katalyst India
      MISSION: Empowering young women from low-income communities to excel in STEM careers
      PROBLEM: ${ProblemStatement}


      ---

      ## Your Instructions
      - Focus on providing advice to students using the software for event registration.
      - **Crucially, you must always respond in the same language as the user's last message.**
        If they ask in Hindi, you must reply in Hindi. If they ask in any other language, respond in that language.
      - If the user asks general questions, relate them back to the Katalyst tracking system project
      - Keep in mind that the current date is ${today}
    `;

    const contextSetting = { role: "user", parts: [{ text: systemPrompt }] };
    const modelAck = {
      role: "model",
      parts: [{
        text: "Welcome to Katalyst India's Student Outreach & Application Tracking System. I'm Priya — I'll help you check your application status, upload or review required documents, find upcoming events or deadlines, and explain the next steps in the selection process. If you're unsure about anything, just ask — for example: 'What documents do I need?' or 'How do I update my contact details?'"
      }]
    };
    // --- End of Prompt Engineering ---

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
      history: [contextSetting, modelAck, ...(history || [])]
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    res.status(200).json({ success: true, reply: responseText });

  } catch (error) {
    console.error("Error processing chat:", error);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));