import express from 'express';
import path from 'path';
import { NotionAPI, fetchBlockChildrenRecursively } from './controller/index.js';
import cors from 'cors';
import ElementProcessor from './controller/ElementProcessor/index.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import mock from "../mock.json" with {type: "json"};

dotenv.config();

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.resolve(path.dirname(__filename), ".."); // get the name of the directory

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
    res.status(404).json({ error: 'Erro ao buscar filhos do bloco' });
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
    res.status(404).json({ error: 'Erro ao buscar filhos do bloco' });
  }
})

app.get("/mock", (req, res)=>{
  res.json(mock)
})

// Inicializa o servidor Express
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
