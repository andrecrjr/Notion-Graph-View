const express = require('express');
const path = require("path")
const { NotionAPI, ElementProcessor, fetchBlockChildrenRecursively } = require('./controller');
const cors = require("cors")
require('dotenv').config()


const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors())

const NOTION_API_KEY = process.env.NOTION_API_KEY
const API_URL = process.env.API_URL;

// sendFile will go here
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

// Endpoint GET para retornar os filhos de um bloco
app.get('/blocks/:blockId', async (req, res) => {
  const { blockId } = req.params;

  try {
    const notionAPI = new NotionAPI(API_URL, NOTION_API_KEY);
    const elementProcessor = new ElementProcessor();

    const elements = await fetchBlockChildrenRecursively(blockId, notionAPI, elementProcessor);
    res.json(elements);
  } catch (error) {
    console.error('Erro ao buscar filhos do bloco:', error);
    res.status(500).json({ error: 'Erro ao buscar filhos do bloco' });
  }
});

app.get("/only/:blockId", async(req, res)=>{
    const { blockId } = req.params;

  try {
    const notionAPI = new NotionAPI(API_URL, NOTION_API_KEY);
    const elements = await notionAPI.fetchBlockChildren(blockId);
    res.json(elements);
  } catch (error) {
    console.error('Erro ao buscar filhos do bloco:', error);
    res.status(500).json({ error: 'Erro ao buscar filhos do bloco' });
  }
})

// Inicializa o servidor Express
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
