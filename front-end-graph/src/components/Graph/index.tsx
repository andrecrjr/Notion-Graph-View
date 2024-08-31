'use client'
import React, { useEffect, useRef, useState } from "react";

import { useParams, useRouter } from "next/navigation";
import { useFetchGraphData } from "../hooks/useFetchGraphData";
import { clearNodePositions, saveNodePositions } from "../utils/graph";
import { useGraph } from "../hooks/useGraph";

export const GraphComponent: React.FC = () => {
  const {id: pageId} = useParams()
  const pageUID = pageId as string
  const router = useRouter()

  if(!pageId){
    router.push("/")
  }
  const [data, setData] = useState<{ nodes: Node[]; links: Link[] }>({
    nodes: [],
    links: [],
  });
  const svgRef = useRef<SVGSVGElement | null>(null);

  const graphData = useFetchGraphData(pageUID);
  const mountGraph = useGraph()

  useEffect(() => {
    if (graphData) {
      setData(graphData);
    }
  }, [graphData, pageUID]);

  useEffect(() => {
      mountGraph(data, svgRef, pageUID)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);


  return (<div className="graph overflow-hidden max-w-screen">
    <button onClick={()=>saveNodePositions(data, pageUID)} className="border-none bg-slate-500 border-r-2 fixed px-3">Salvar posição</button>
    <button onClick={()=>clearNodePositions(pageUID)} className="border-none bg-red-500 border-r-2 fixed right-0 px-3">Limpar posições</button>
    <svg ref={svgRef}></svg>
  </div>);
};

export default GraphComponent;