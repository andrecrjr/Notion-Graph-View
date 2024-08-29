import { auth } from "@/components/Auth";
import SearchInput from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  const data = await auth()
  
  return (
    <main className="h-screen overflow-hidden">
      <h1>Graph View for Notion</h1>
      <p>A graph way to see your pages!</p>
      { !!data && <SearchInput /> }
      <section>
      <Link href="/graph/mock"><Button className="mx-auto block">Demo</Button></Link>
      </section>
    </main>
  );
}
