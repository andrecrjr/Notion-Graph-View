import { useState, useEffect, useCallback } from 'react';
import dataMock from "@/components/mock.json";

import { fetchAndCacheData, processGraphData } from '../utils/graph';

export const useFetchGraphData = (pageId: string) => {
  const [data, setData] = useState<{ nodes: Node[]; links: Link[] } | null>(null);

  const fetchGraphData = useCallback(async () => {
    try {
      let data;

      if (pageId === "mock") {
        data = dataMock;
      } else {
        data = await fetchAndCacheData(pageId);
      }

      const { nodes, links } = processGraphData(data, pageId);
      setData({ nodes, links });
    } catch (error) {
      console.error('Error fetching graph data:', error);
    }
  }, [pageId]);

  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);

  return data;
};
