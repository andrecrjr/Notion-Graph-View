'use client'
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect } from "react";
import { fetchAllNotionPages } from "./service/Notion";

type Props = {};

export const UserSession = (props: Props) => {
    const {data} = useSession()
    // const fetch = useCallback(async(item:any)=>{
    //     const client = await fetchAllNotionPages(item?.user.tokens, "Development")
    //     console.log(client)
    // }, [])
    // useEffect(()=>{
    //     fetch(data)
    // },[])
  return <div>UserSession</div>;
};
