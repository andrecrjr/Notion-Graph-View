import GraphComponent from "@/components/Graph";
import Image from "next/image";

export default function Home() {
  return (
    <main className="h-screen">
      Graph View
      <GraphComponent />
    </main>
  );
}
