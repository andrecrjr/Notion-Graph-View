"use client";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

type Props = {};

export const SearchByUrl = (props: Props) => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setInputValue(e.target.value);
  };

  const clickGoValidation = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const regex = /[a-f0-9]{32}$/;
    const match = inputValue.match(regex);

    if (match) {
      const notionId = match[0];
      console.log("ID da página do Notion:", notionId);
      router.push(`/graph/${notionId}`);
    } else {
      alert(
        "Não achamos sua página do Notion, tente a url de compartilhamento.",
      );
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <form className="relative flex">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search by your Notion pages..."
          value={inputValue}
          onChange={handleInputChange}
          pattern="https:\/\/www\.notion\.so\/[A-Za-z0-9-]+-[a-f0-9]{32}"
          title="URL do Notion.so com ID da página"
          required
          className="pl-8 pr-4 py-2 w-full rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow duration-200 ease-in-out bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
        />
        <Button
          className="ml-4 pl-4 bg-green-700 hover:bg-green-400"
          onClick={clickGoValidation}
        >
          Graph
        </Button>
      </form>
    </div>
  );
};
