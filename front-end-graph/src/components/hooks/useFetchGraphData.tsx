import { useState, useEffect, useCallback } from 'react';
import dataMock from "@/components/mock.json";
import { fetchAndCacheData, processGraphData } from '../utils/graph';
import { useSession } from 'next-auth/react';

export const useFetchGraphData = (pageId: string) => {
  const { data: authData } = useSession();
  
  const [data, setData] = useState<{ nodes: Node[]; links: Link[] } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const processGraphDataMemoized = useCallback(
    (data: any) => processGraphData(data, pageId),
    [pageId]
  );

  const fetchGraphData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let fetchedData;

      if (pageId === "mock") {
        fetchedData = dataMock;
        //@ts-expect-error
      } else if (authData?.user?.tokens.access_token) {
        //@ts-expect-error
        fetchedData = await fetchAndCacheData(pageId, authData.user.tokens.access_token);
      }

      if (fetchedData) {
        const processedGraphData = processGraphDataMemoized(fetchedData);
        setData(processedGraphData);

      } else {
        setError('No data returned from API.');
      }
    } catch (error) {
      //@ts-expect-error
      setError('Error fetching graph data: ' + error.message);
      console.error('Error fetching graph data:', error);
    } finally {
      setLoading(false);
    }
  }, [pageId, authData, processGraphDataMemoized]);

  useEffect(() => {
    if (authData && !data) {
      fetchGraphData();
    }
  }, [authData, data, fetchGraphData]);

  return { data, loading, error };
};
