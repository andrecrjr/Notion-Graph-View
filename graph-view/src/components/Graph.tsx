'use client'
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface Node extends d3.SimulationNodeDatum {
  id: string;
  label: string;
}

interface Link {
  id: string | number;
  source: string;
  target: string;
}

export const GraphComponent: React.FC = () => {
  const [data, setData] = useState<{ nodes: Node[]; links: Link[] }>({
    nodes: [],
    links: [],
  });
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const fetchGraphData = async (blockId: string) => {
      try {
        const response = await fetch(`http://localhost:3000/mock`);
        const data = await response.json();

        const nodes: Node[] = data
          .filter((d: any) => d.type === "page")
          .map((d: any) => ({ id: d.id, label: d.label }));

        const links: Link[] = data
          .filter(
            (d: any) =>
              d.type === "node" &&
              nodes.some((node: Node) => node.id === d.source) &&
              nodes.some((node: Node) => node.id === d.target)
          )
          .map((d: any) => ({ source: d.source, target: d.target }));

        setData({ nodes, links });
      } catch (e) {
        console.error(e);
      }
    };

    fetchGraphData('9a1db0177fac4402bdb3bc881aa6d0ad');
  }, []);

  useEffect(() => {
    if (data.nodes.length === 0 || data.links.length === 0) return;

    const width = window.innerWidth;
    const height = window.innerHeight - 50;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Create a container group to apply zoom and pan transformations
    const container = svg.append("g");

    const simulation = d3.forceSimulation<Node>(data.nodes)
      .force("link", d3.forceLink<Link, Node>(data.links).id((d) => d.id).distance(data.nodes.length))
      .force("charge", d3.forceManyBody().strength(-(data.nodes.length / 3)))
      .force("center", d3.forceCenter(width / 2, height / 2));

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
      .attr("xlink:href", d => `https://notion.so/eroshi/${d.id.replaceAll("-", "")}`)
      .attr("target", "_blank")
      .append("circle")
      .attr("class", "node fill-blue-500 dark:fill-blue-300 hover:fill-blue-700 dark:hover:fill-blue-500 cursor-pointer")
      .attr("r", 5)
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
       .attr("class", "label fill-gray-400 dark:fill-white")
      .attr("text-anchor", "middle")
      .attr("dy", -15)
      .text(d => d.label);

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

    // Zoom and Pan behavior
    const zoomed = (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
      container.attr("transform", event.transform);
    };

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 5]) // Set the zoom scale extent
      .on("zoom", zoomed);

    svg.call(zoom);

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
      d.fx = null;
      d.fy = null;
    }

    return () => {
      svg.selectAll("*").remove();
    };
  }, [data]);

  return <div id="graph">
    <svg ref={svgRef}></svg>
  </div>;
};

export default GraphComponent;
