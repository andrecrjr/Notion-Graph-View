import GraphComponent from "@/components/Graph";
// import Sidebar from "@/components/Sidebar";
import React from "react";

const GraphPage = () => {
  return (<div className="overflow-hidden max-w-screen">
          {/* <Sidebar /> */}
          <GraphComponent />
      </div>);
};

export default GraphPage;