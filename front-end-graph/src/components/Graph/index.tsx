"use client";
import React, { useEffect, useRef } from "react";
import { useGraph } from "../hooks/useGraph";
import { useGraphContextData } from "./GraphContext";
import LoadingPlaceholder from "./Loading";
import { useParams, useRouter } from "next/navigation";

import Sidebar from "../Sidebar";
import { useFetchGraphData } from "../hooks/useFetchGraphData";

export const GraphComponent: React.FC = () => {
  const { id: pageId } = useParams();
  const pageUID = pageId as string;
  const { setNodes } = useGraphContextData();
  const router = useRouter();
  if (!pageId) {
    router.push("/");
  }
  const svgRef = useRef<SVGSVGElement | null>(null);

  const { data: graphData, loading, error } = useFetchGraphData(pageUID);
  const mountGraph = useGraph();

  useEffect(() => {
    if (graphData) {
      mountGraph(graphData, svgRef, pageUID);
      setNodes(graphData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphData]);

  return (
    <div className="graph overflow-hidden max-w-screen">
      {loading && <LoadingPlaceholder />}
      <Sidebar />
      {/* <button
        onClick={() => !!graphData && saveNodePositions(graphData, pageUID)}
        className="border-none bg-slate-500 border-r-2 fixed px-3"
      >
        Salvar posição
      </button>
      <button
        onClick={() => clearNodePositions(pageUID)}
        className="border-none bg-red-500 border-r-2 fixed right-0 px-3"
      >
        Limpar posições
      </button> */}
      <svg ref={svgRef} className="dark:bg-black"></svg>
    </div>
  );
};

export default GraphComponent;
