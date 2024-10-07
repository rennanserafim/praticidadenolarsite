const express = require("express");
const fs = require("fs");
const cors = require("cors"); // Adicione esta linha
const app = express();
const PORT = 3000;

// Middleware para permitir requisições JSON e CORS
app.use(cors()); // Adicione esta linha
app.use(express.json());
app.use(express.static("public")); // Serve arquivos estáticos da pasta public

// Rota para obter os participantes
app.get("/participants", (req, res) => {
  fs.readFile("participants.json", "utf8", (err, data) => {
    if (err) {
      console.error("Erro ao ler o arquivo:", err);
      return res.status(500).json({ error: "Erro ao ler os participantes." });
    }
    const participants = JSON.parse(data);
    res.json(participants);
  });
});

// Rota para adicionar um participante
app.post("/participants", (req, res) => {
  const { name, whatsapp } = req.body;

  fs.readFile("participants.json", "utf8", (err, data) => {
    if (err) {
      console.error("Erro ao ler o arquivo:", err);
      return res.status(500).json({ error: "Erro ao ler os participantes." });
    }
    const participants = JSON.parse(data);
    const newParticipant = {
      id: participants.length + 1,
      name,
      whatsapp,
    };
    participants.push(newParticipant);

    fs.writeFile(
      "participants.json",
      JSON.stringify(participants, null, 2),
      (err) => {
        if (err) {
          console.error("Erro ao salvar o participante:", err);
          return res
            .status(500)
            .json({ error: "Erro ao salvar o participante." });
        }
        res.status(201).json(newParticipant);
      }
    );
  });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
