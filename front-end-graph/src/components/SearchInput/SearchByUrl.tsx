"use client";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export const SearchByUrl = () => {
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
      router.push(`/graph/${notionId}`);
    } else {
      alert(
        "Não achamos sua página do Notion, tente a url de compartilhamento.",
      );
    }
  };

  return (
    <div className="mx-auto md:w-10/12 p-4">
      <form className="w-full relative flex">
        <Input
          type="text"
          placeholder="Notion URL Example: https://www.notion.so/exemplo/Example-46f8v9j8j644d54f4ff9dfd"
          value={inputValue}
          onChange={handleInputChange}
          pattern="https:\/\/www\.notion\.so\/[A-Za-z0-9-]+-[a-f0-9]{32}"
          title="URL do Notion com ID da página: https://www.notion.so/exemplo/Example-46f8v9j8j644d54f4ff9dfd"
          required
          className="w-full mx-auto pr-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow duration-200 ease-in-out bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
        />
        <Button
          className="ml-4 w-2/12 grow pl-4 bg-green-700 hover:bg-green-400"
          onClick={clickGoValidation}
        >
          Graph It!
        </Button>
      </form>
    </div>
  );
};
