import { auth } from "@/components/Auth";
import AuthButton from "@/components/Buttons";
import SearchInput from "@/components/SearchInput";
import { SearchByUrl } from "@/components/SearchInput/SearchByUrl";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  const data = await auth()
  
  return (
  <main className="h-screen overflow-hidden bg-gray-50 text-gray-900">
    <div className="max-w-4xl mx-auto py-14 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-center mb-4">Graph View for Notion</h1>
      <p className="text-lg text-center mb-6">A graph way to see your pages!</p>
      <section className="flex flex-col mb-4 items-center justify-center">
        {!!data ? (
          <>
            <p className="text-center mb-6">
              Hello {data.user?.name}, find your notion page in the search below!
            </p>
            <AuthButton />
            <SearchByUrl />
          </>
          )
          : (
          <AuthButton />
        )
      }
      </section>
      <section className="flex justify-center">
        <Link href="/graph/mock">
          <Button className="inline-block  bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow">
            Demo Graph example
          </Button>
        </Link>
      </section>
    </div>
  </main>
);
}
