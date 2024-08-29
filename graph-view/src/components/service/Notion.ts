export const fetchAllNotionPages = async (accessToken:string, search="") => {
  const baseUrl = 'https://api.notion.com/v1/search';
  let hasMore = true;
  let nextCursor = null;
  let allPages = [];

    const requestOptions:any = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`, // Use o seu token de acesso real aqui
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify({
        query: search,
        page_size: 100, // Você pode ajustar o tamanho da página conforme necessário
        filter: {
          property: 'object',
          value: 'page'
        }
      })
    };

    try {
      const response = await fetch(baseUrl, requestOptions);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch pages from Notion:', error);
  }

};