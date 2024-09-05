/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback } from "react";
import { saveNodePositions } from "../utils/graph";
import * as d3 from "d3";
import { useGraphContextData } from "../Graph/GraphContext";

export const useGraph = () => {
  const { setNodes } = useGraphContextData();
  const LOCAL_SETTINGS = {
    MAX_GRAPH_WIDTH: 5000,
    MAX_GRAPH_HEIGHT: 5000,
    RESPONSE_BREAKPOINT: 600,
    WINDOW_WIDTH: window.innerWidth,
    WINDOW_HEIGHT: window.innerHeight,
    GRAPH_BALL_SIZE: { sm: 10, lg: 15 },
    GRAPH_BALL_LABEL_MARGIN: { sm: -35, lg: -45 },
  };

  const mountGraph = useCallback(
    (
      data: { nodes: Node[]; links: Link[] },
      svgRef: React.MutableRefObject<SVGSVGElement | null>,
      pageUID: string,
    ) => {
      const svg = d3 //@ts-ignore
        .select(svgRef.current)
        .attr("width", LOCAL_SETTINGS.MAX_GRAPH_WIDTH)
        .attr("height", LOCAL_SETTINGS.MAX_GRAPH_HEIGHT);

      const container = svg.append("g");

      const simulation = d3
        .forceSimulation<Node>(data.nodes)
        .force(
          "link",
          d3
            .forceLink<Node, Link>(data.links)
            .id((d) => d.id)
            .distance(data.nodes.length / 2),
        )
        .force("charge", d3.forceManyBody().strength(-data.nodes.length))
        .force(
          "center",
          d3.forceCenter(
            LOCAL_SETTINGS.MAX_GRAPH_WIDTH / 3,
            LOCAL_SETTINGS.MAX_GRAPH_HEIGHT / 3,
          ),
        )
        .force("collide", d3.forceCollide(70));

      const link = container
        .append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(data.links)
        .enter()
        .append("line")
        .attr("class", "link stroke-gray-400 dark:stroke-gray-200");

      const node = container
        .append("g")
        .selectAll("a")
        .data(data.nodes)
        .enter()
        .append("a")
        .attr(
          "xlink:href",
          (d) => `https://notion.so/${d.id.replaceAll("-", "")}`,
        )
        .attr("target", "_blank")
        .append("circle")
        .attr(
          "class",
          "node fill-blue-600 dark:fill-blue-300 hover:fill-blue-700 dark:hover:fill-blue-500 cursor-pointer",
        )
        .attr(
          "r",

          LOCAL_SETTINGS.GRAPH_BALL_SIZE[
            LOCAL_SETTINGS.WINDOW_WIDTH > LOCAL_SETTINGS.RESPONSE_BREAKPOINT
              ? "sm"
              : "lg"
          ],
        )
        .call(
          d3
            .drag<SVGCircleElement, Node>()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended),
        );

      const labels = container
        .append("g")
        .attr("class", "labels")
        .selectAll("text")
        .data(data.nodes)
        .enter()
        .append("text")
        .attr("class", "label fill-gray-600 dark:fill-yellow-300")
        .attr("text-anchor", "middle")
        .attr(
          "dy",
          LOCAL_SETTINGS.GRAPH_BALL_SIZE[
            LOCAL_SETTINGS.WINDOW_WIDTH > LOCAL_SETTINGS.RESPONSE_BREAKPOINT
              ? "sm"
              : "lg"
          ] +
            LOCAL_SETTINGS.GRAPH_BALL_LABEL_MARGIN[
              LOCAL_SETTINGS.WINDOW_WIDTH > LOCAL_SETTINGS.RESPONSE_BREAKPOINT
                ? "sm"
                : "lg"
            ],
        )
        .text((d) => d.label);

      const initialX =
        LOCAL_SETTINGS.WINDOW_WIDTH / 2 - LOCAL_SETTINGS.MAX_GRAPH_WIDTH / 3;
      const initialY =
        LOCAL_SETTINGS.WINDOW_HEIGHT / 2 - LOCAL_SETTINGS.MAX_GRAPH_HEIGHT / 3;

      container.attr("transform", `translate(${initialX},${initialY})`);

      simulation.on("tick", () => {
        link
          .attr("x1", (d) => (d.source as unknown as Node).x!)
          .attr("y1", (d) => (d.source as unknown as Node).y!)
          .attr("x2", (d) => (d.target as unknown as Node).x!)
          .attr("y2", (d) => (d.target as unknown as Node).y!);

        node
          .attr(
            "cx",
            (d) =>
              ((d as Node).x = Math.max(
                10,
                Math.min(LOCAL_SETTINGS.MAX_GRAPH_WIDTH - 10, (d as Node).x!),
              )),
          )
          .attr(
            "cy",
            (d) =>
              ((d as Node).y = Math.max(
                10,
                Math.min(LOCAL_SETTINGS.MAX_GRAPH_HEIGHT - 10, (d as Node).y!),
              )),
          );

        labels
          .attr("x", (d) => (d as Node).x!)
          .attr("y", (d) => (d as Node).y!);
      });

      simulation.on("end", () => {
        console.log("Simulation ended, saving node positions...");
        // saveNodePositions(data, pageUID);
      });

      const zoomed = (event: d3.D3ZoomEvent<Element, unknown>) => {
        const { k, x, y } = event.transform;

        const newWidth = Math.max(
          LOCAL_SETTINGS.MAX_GRAPH_WIDTH,
          Math.abs(x) * 2,
        );
        const newHeight = Math.max(
          LOCAL_SETTINGS.MAX_GRAPH_HEIGHT,
          Math.abs(y) * 2,
        );
        svg.attr("width", newWidth).attr("height", newHeight);

        container.attr("transform", `translate(${x},${y}) scale(${k})`);
      };

      const zoom = d3
        .zoom<Element, unknown>()
        .scaleExtent([0.5, 5])
        .on("zoom", zoomed);
      //@ts-ignore
      svg //@ts-ignore
        .call(zoom) //@ts-ignore
        .call(zoom.transform, d3.zoomIdentity.translate(initialX, initialY));

      function dragstarted(
        event: d3.D3DragEvent<SVGCircleElement, Node, Node>,
        d: Node,
      ) {
        if (!event.active) simulation.alphaTarget(0).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(
        event: d3.D3DragEvent<SVGCircleElement, Node, Node>,
        d: Node,
      ) {
        d.fx = event.x;
        d.fy = event.y;
        simulation.alpha(0.1).restart();
      }

      function dragended(
        event: d3.D3DragEvent<SVGCircleElement, Node, Node>,
        d: Node,
      ) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = event.x;
        d.fy = event.y;
        // Save node positions in localStorage
        // saveNodePositions(data, pageUID)
        setNodes(data);
      }

      return () => {
        svg.selectAll("*").remove();
      };
    },
    [],
  );

  return mountGraph;
};
