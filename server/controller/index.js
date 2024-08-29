import dotenv from 'dotenv';

dotenv.config();

class NotionAPI {
  constructor(apiUrl, apiKey) {
    this.apiUrl = apiUrl || process.env.API_URL;
    this.apiKey = apiKey || process.env.NOTION_API_KEY;
  }

  async fetchBlockChildren(blockId, nextCursor = null) {
    try {
      const url = `${this.apiUrl}/blocks/${blockId}/children?page_size=50${nextCursor ? `&start_cursor=${nextCursor}` : ''}`;
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

  async fetchSearch(secret, query){
    try {
      let options = {
        method: 'POST',
        headers: {
          ...this.getHeaders(),
          Authorization: `${secret}`,
        },
        body: `{"query":"${query}","filter":{"value":"page","property":"object"},"sort":{"direction":"ascending","timestamp":"last_edited_time"}}`
      };
      const res = await fetch(`${this.apiUrl}/search`, options)
      const data = await res.json()
      return data;
    } catch (error) {
      console.log(error);
      throw new Error("Error to find pages in query")
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


export {NotionAPI, fetchBlockChildrenRecursively}