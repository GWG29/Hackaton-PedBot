const express = require("express")
require("dotenv").config();
const {GoogleGenerativeAI} = require("@google/generative-ai")

const app = express();
const port = 3000;

const genAI = new GoogleGenerativeAI(proccess.env.GOOGLE_GEMNI_API_KEY);

app.use(express.static("public"));

app.use(express.json());

app.post("/chat", async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Mensagem não pode estar."});
    }

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
        });
        
        const chat = model.startChat({
            history: [],
            generationConfig: { maxOutputToknes: 255},
        });
        const result = await chat.sendMessage(message);
        res.json({ response: result.response.text() });
    } catch (error)  {
        console.error(error);
        res.status(500).json({error:"Erro ao processar mensagem"});
    }

});

app.listen(port, () => {
    console.log('Servidor rodando em http://localhost:${port}');
})