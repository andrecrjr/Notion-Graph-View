'use client'
import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '../ui/button';

const AuthButton = () => {
  const { data: session } = useSession();

  return (
    <>
      {session ? (
        <Button onClick={() => signOut()} className='absolute top-0 right-0 mr-4' variant="ghost">
          Logout
        </Button>
      ) : (
        <Button onClick={() => signIn('notion')} className="w-fit bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg shadow">
          Login with Notion
          <img loading="lazy" className='ml-3' height="24" width="24" id="provider-logo" src="https://authjs.dev/img/providers/notion.svg"/>
        </Button>
      )}
    </>
  );
};

export default AuthButton;
