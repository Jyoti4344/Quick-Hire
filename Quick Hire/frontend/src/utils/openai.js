import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { message, messages } = req.body;

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: "You are an AI interviewer conducting a job interview. Ask relevant questions about the candidate's experience and skills." 
        },
        ...messages,
        { role: "user", content: message }
      ],
    });

    res.status(200).json({ 
      message: completion.data.choices[0].message.content 
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      message: "An error occurred while processing your request." 
    });
  }
}

