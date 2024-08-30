'use client'
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useParams, useRouter } from "next/navigation";
import { useFetchGraphData } from "../hooks/useFetchGraphData";
import { clearNodePositions, saveNodePositions } from "../utils/graph";

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

  useEffect(() => {
    if (graphData) {
      setData(graphData);
    }
  }, [graphData, pageUID]);

  useEffect(() => {
    if (data.nodes.length === 0 || data.links.length === 0 || svgRef.current == null) return;

    const width = window.innerWidth * 5;
    const height = window.innerHeight * 5;
    
    //@ts-ignore
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const container = svg.append("g");

    const simulation = d3.forceSimulation<Node>(data.nodes)
    .force("link", d3.forceLink<Node, Link>(data.links).id((d) => d.id).distance(data.nodes.length))
    .force("charge", d3.forceManyBody().strength(-(200)))
    .force("center", d3.forceCenter(width / 3, height / 3))
    .force("collide", d3.forceCollide(5));


    const link = container.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(data.links)
      .enter()
      .append("line")
      .attr("class", "link stroke-gray-400 dark:stroke-gray-200");

    const node = container.append("g")
      .selectAll("a")
      .data(data.nodes)
      .enter()
      .append("a")
      .attr("xlink:href", d => `https://notion.so/${d.id.replaceAll("-", "")}`)
      .attr("target", "_blank")
      .append("circle")
      .attr("class", "node fill-blue-500 dark:fill-blue-300 hover:fill-blue-700 dark:hover:fill-blue-500 cursor-pointer")
      .attr("r", 7)
      .call(
        d3.drag<SVGCircleElement, Node>()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    const labels = container.append("g")
      .attr("class", "labels")
      .selectAll("text")
      .data(data.nodes)
      .enter()
      .append("text")
       .attr("class", "label fill-gray-400 dark:fill-yellow-300")
      .attr("text-anchor", "middle")
      .attr("dy", -15)
      .text(d => d.label);
    
    const initialX = (window.innerWidth / 2) - (width / 3);
    const initialY = (window.innerHeight / 2) - (height / 3);

    container.attr("transform", `translate(${initialX},${initialY})`);

    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as unknown as Node).x!)
        .attr("y1", d => (d.source as unknown as Node).y!)
        .attr("x2", d => (d.target as unknown as Node).x!)
        .attr("y2", d => (d.target as unknown as Node).y!);

      node
        .attr("cx", d => (d as Node).x = Math.max(10, Math.min(width - 10, (d as Node).x!)))
        .attr("cy", d => (d as Node).y = Math.max(10, Math.min(height - 10, (d as Node).y!)));

      labels
        .attr("x", d => (d as Node).x!)
        .attr("y", d => (d as Node).y!);
    });

    simulation.on("end", () => {
      console.log("Simulation ended, saving node positions...");
      saveNodePositions(data, pageUID);
    });

    const zoomed = (event: d3.D3ZoomEvent<Element, unknown>) => {
      const { k, x, y } = event.transform;
      
      const newWidth = Math.max(width, Math.abs(x) * 2);
      const newHeight = Math.max(height, Math.abs(y) * 2);
      svg.attr("width", newWidth).attr("height", newHeight);

      container.attr("transform", `translate(${x},${y}) scale(${k})`);
    };

    const zoom = d3.zoom<Element, unknown>()
      .scaleExtent([0.5, 5])
      .on("zoom", zoomed);
    //@ts-ignore
    svg.call(zoom).call(zoom.transform, d3.zoomIdentity.translate(initialX, initialY));
 
    function dragstarted(event: d3.D3DragEvent<SVGCircleElement, Node, Node>, d: Node) {
      if (!event.active) simulation.alphaTarget(0.2).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: d3.D3DragEvent<SVGCircleElement, Node, Node>, d: Node) {
      d.fx = event.x;
      d.fy = event.y;
    }

     function dragended(event: d3.D3DragEvent<SVGCircleElement, Node, Node>, d: Node) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = event.x;
      d.fy = event.y;
      // Save node positions in localStorage
      saveNodePositions(data, pageUID)
    }

    return () => {
      svg.selectAll("*").remove();
    };
  }, [data]);


  return (<div className="graph overflow-hidden max-w-screen">
    <button onClick={()=>saveNodePositions(data, pageUID)} className="border-none bg-slate-500 border-r-2 fixed px-3">Salvar posição</button>
    <button onClick={()=>clearNodePositions(pageUID)} className="border-none bg-red-500 border-r-2 fixed right-0 px-3">Limpar posições</button>
    <svg ref={svgRef}></svg>
  </div>);
};

export default GraphComponent;