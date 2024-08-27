import GraphComponent from "@/components/Graph";
import Image from "next/image";

export default function Home() {
  return (
    <main className="h-screen overflow-hidden">
      <h1 className="absolute">Graph View</h1>
      <GraphComponent />
    </main>
  );
}
