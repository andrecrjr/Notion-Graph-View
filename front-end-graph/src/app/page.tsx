import { auth } from "@/components/Auth";
import AuthButton from "@/components/Buttons";
import { Footer } from "@/components/Footer";
import { KofiDonate } from "@/components/Donate";
import { SearchByUrl } from "@/components/SearchInput/SearchByUrl";
import { Button } from "@/components/ui/button";
import { GoogleAnalytics } from "@next/third-parties/google";
import Link from "next/link";
import SearchInput from "@/components/SearchInput";

export default async function Home() {
  const data = await auth();

  return (
    <>
      <div className="md:w-8/12 flex flex-col mx-auto py-14 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center mb-4">
          Graph View Mode for Notion
        </h1>
        <p className="text-lg text-center mb-6">
          A graph way to see your pages{" "}
          <a href="https://obsidian.md/" className="underline" target="_blank">
            like-Obsidian
          </a>
          !
        </p>
        <section className="flex flex-col mb-4 items-center justify-center">
          {!!data ? (
            <>
              <SearchInput />
              <AuthButton />
            </>
          ) : (
            <>
              <p className="font-bold bg-yellow-200">
                You need to log in to our Notion Integration to continue.
              </p>
              <AuthButton />
            </>
          )}
          <KofiDonate />
        </section>
        {/* <History /> */}

        <section className="flex justify-center">
          <Link href="/graph/mock">
            <Button className="inline-block  bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow">
              Demo Graph example
            </Button>
          </Link>
        </section>
      </div>
      {process.env.NODE_ENV === "production" && (
        <GoogleAnalytics gaId="G-LX2KQTDYSV" />
      )}
      <Footer />
    </>
  );
}
