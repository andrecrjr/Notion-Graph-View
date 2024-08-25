require('dotenv').config()

class NotionAPI {
    constructor(apiUrl, apiKey) {
      this.apiUrl = apiUrl || process.env.API_URL;
      this.apiKey = apiKey || process.env.NOTION_API_KEY;
    }
  
    async fetchBlockChildren(blockId, nextCursor = null) {
        try {
            const url = `${this.apiUrl}/${blockId}/children?page_size=50${nextCursor ? `&start_cursor=${nextCursor}` : ''}`;
            const response = await fetch(url, {
              method: 'GET',
              headers: this.getHeaders(),
            });

            return response.json();
        } catch (error) {
            console.log(error)
            throw new Error(`Erro ao acessar a API do Notion: ${error}`);
        }
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
      this.columnListTrack = []
      this.inside_column = []
      this.notionApi = new NotionAPI()
    }
  
    processChild(child, parentId) {
      const childId = child.id;
  
      if(child.type==="column_list" && child.has_children){
        
        // pego o pai da lista coluna e salvo
          this.columnListTrack.push({
            father:child.parent?.page_id, 
            column_list: childId
          })
      }

      if(child.type==="column"){
        // pego o pai da coluna pelo pai da column_list e salvo
        const columnList = this.columnListTrack.find(item => item.column_list === child.parent?.block_id);

        if(columnList){
          this.inside_column.push({...columnList, id_column:childId})
        }
      }
  
      if (child.type === 'paragraph') {
        this.processParagraph(child, parentId);
      }

    if (child.type === 'child_page') {
        this.addPage(childId, child.child_page.title);
        this.addNode(parentId, childId);
        const insideColumn = this.inside_column.find(item=> item.id_column === parentId)
        if(insideColumn){
          console.log("é dentro",insideColumn.father)
          this.addNode(insideColumn?.father, childId)
        }
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
          return await fetchBlockChildrenRecursively(childId, notionAPI, elementProcessor, childId);
        }
      });
  
      await Promise.all(childPromises);
    }
  
    return elementProcessor.getElements();
  }


  module.exports = {NotionAPI, ElementProcessor, fetchBlockChildrenRecursively}