import { auth } from "@/components/Auth";
import GraphComponent from "@/components/Graph";
import { getSession } from "next-auth/react";

export default async function Home() {
  const data = await auth()
  console.log(data)
  return (
    <main className="h-screen overflow-hidden">
      <h1 className="absolute">Graph View</h1>
      {/* <GraphComponent /> */}
    </main>
  );
}
