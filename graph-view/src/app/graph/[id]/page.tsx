import GraphComponent from "@/components/Graph";
import React from "react";

type Props = {};

const GraphPage = (props: Props) => {
  return (<div className="overflow-hidden max-w-screen">
          <h1 className="absolute">Graph View</h1>
          <GraphComponent />
      </div>);
};

export default GraphPage;