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

      if (!response.ok) {
        throw new Error(`Failed to fetch children for block ${blockId}: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error accessing the Notion API:', error);
      throw new Error(`Error accessing the Notion API: ${error.message}`);
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
    this.columnListTrack = [];
    this.insideColumn = [];
    this.toggleList = [];
    this.notionApi = new NotionAPI();
  }

  processChild(child, parentId) {
    const childId = child.id;

    switch (child.type) {
      case 'column_list':
        this.trackColumnList(child);
        break;

      case 'column':
        this.trackColumn(child);
        break;

      case 'toggle':
        this.trackToggle(child);
        break;

      case 'paragraph':
        this.processParagraph(child, parentId);
        break;

      case 'child_page':
        this.processChildPage(child, parentId);
        break;

      default:
        break;
    }

    return child.has_children ? childId : null;
  }

  trackColumnList(child) {
    if (child.has_children) {
      this.columnListTrack.push({
        father: child.parent[child.parent.type],
        columnList: child.id,
      });
    }
  }

  trackColumn(child) {
    const columnList = this.columnListTrack.find(item => item.columnList === child.parent?.block_id);
    if (columnList) {
      this.insideColumn.push({ ...columnList, idColumn: child.id });
    }
  }

  trackToggle(child) {
    this.toggleList.push({
      father: child.parent[child.parent.type],
      idToggle: child.id,
    });
  }

  processParagraph(child, parentId) {
    if (!child.paragraph?.rich_text) return;

    child.paragraph.rich_text.forEach(textObject => {
      if (textObject.type === 'mention' && textObject.mention?.page) {
        const mentionId = textObject.mention.page.id;
        this.addPage(mentionId, textObject.plain_text);
        this.addNode(parentId, mentionId);
      }
    });
  }

  processChildPage(child, parentId) {
    const childId = child.id;
    this.addPage(childId, child.child_page.title);
    this.addNode(parentId, childId);

    const insideColumn = this.insideColumn.find(item => item.idColumn === parentId);
    const insideToggle = this.toggleList.find(item => item.idToggle === parentId);

    if (insideColumn) {
      this.addNode(insideColumn.father, childId);
    }

    if (insideToggle) {
      this.addNode(insideToggle.father, childId);
    }
  }

  addPage(id, label) {
    if (!this.elements.some(e => e.id === id && e.type === 'page')) {
      this.elements.push({ id, label, type: 'page' });
    }
  }

  addNode(source, target) {
    if (source) {
      this.elements.push({ source, target, type: 'node' });
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