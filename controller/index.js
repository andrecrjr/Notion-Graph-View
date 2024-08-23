require('dotenv').config()

class NotionAPI {
    constructor(apiUrl, apiKey) {
      this.apiUrl = apiUrl || process.env.API_URL;
      this.apiKey = apiKey || process.env.NOTION_API_KEY;
    }
  
    async fetchBlockChildren(blockId, nextCursor = null) {
      const url = `${this.apiUrl}/${blockId}/children?page_size=250${nextCursor ? `&start_cursor=${nextCursor}` : ''}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });
  
      if (!response.ok) {
        throw new Error(`Erro ao acessar a API do Notion: ${response.statusText}`);
      }
  
      return response.json();
    }

  
    getHeaders() {
      return {
        'Authorization': `Bearer ${this.apiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      };
    }
  }
  
  class ElementProcessor {
    constructor() {
      this.elements = [];
      this.mainColumnId = ""
      this.notionApi = new NotionAPI()
    }
  
    async processChild(child, parentId) {
      const childId = child.id;
  
      if (child.type === 'child_page') {
        this.addPage(childId, child.child_page.title);
        this.addNode(parentId, childId);
        console.log(this.mainColumnId)
        if(this.mainColumnId){
            this.addNode(this.mainColumnId, childId)
        }
      }

      if(child.type==="column_list"){
        if(child.has_children && !!child.parent){
            this.mainColumnId = child.parent?.page_id;
        }
      }
  
      if (child.type === 'paragraph') {
        this.processParagraph(child, parentId);
      }
  
      return child.has_children ? childId : null;
    }  
  
    processParagraph(child, parentId) {
      if (!child.paragraph?.rich_text) return;
  
      child.paragraph.rich_text.forEach((textObject) => {
        if (textObject.type === 'mention' && textObject.mention?.page) {
          const mentionId = textObject.mention.page.id;
          this.addPage(mentionId, textObject.plain_text);
          this.addNode(parentId, mentionId);
        }
      });
    }
  
    addPage(id, label) {
      if (!this.elements.some(e => e.id === id && e.type === 'page')) {
        this.elements.push({ id, label, type: "page" });
      }
    }
  
    addNode(source, target) {
      if (source) {
        this.elements.push({ source, target, type: "node" });
      }
    }
  
    getElements() {
      return this.elements;
    }
  }
  
  async function fetchBlockChildrenRecursively(blockId, notionAPI, elementProcessor, parentId = null) {
    let hasMore = true;
    let nextCursor = null;
  
    while (hasMore) {
      const data = await notionAPI.fetchBlockChildren(blockId, nextCursor);
      nextCursor = data.next_cursor;
      hasMore = data.has_more;
  
      const childPromises = data.results.map(async (child) => {
        const childId = elementProcessor.processChild(child, parentId);         
        if (childId) {
           await fetchBlockChildrenRecursively(childId, notionAPI, elementProcessor, childId);
        }
      });
  
      await Promise.all(childPromises);
    }
  
    return elementProcessor.getElements();
  }


  module.exports = {NotionAPI, ElementProcessor, fetchBlockChildrenRecursively}