const express = require("express")
require("dotenv").config();
const {GoogleGenerativeAI} = require("@google/generative-ai")

const app = express();
const port = 3000;

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

app.use(express.static("src"));

app.use(express.json());

app.post("/chat", async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Mensagem não pode estar."});
    }

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash-lite",
            systemInstruction: "Você é um chatbot de farmácia, você vai indicar as mercadorias dessa farmacia de acordo com o pedido do cliente, mostrando para ele o preço dos produtos, as marcas que tem esse produto na loja. Você vai falar que vai passar para um atendende da farmácia caso o remédio necessite de retenção de receita ou que o remédio só possa ser vendido mediante prescrição médica. Use marcas genéricas de medicações por enquanto.",
        });
        
        const chat = model.startChat({
            history: [],
            generationConfig: { maxOutputTokens: 255 },
        });
        const result = await chat.sendMessage(message);
        res.json({ response: result.response.text() });
    } catch (error)  {
        console.error(error);
        res.status(500).json({error:"Erro ao processar mensagem"});
    }

});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
})