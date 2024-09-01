"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Button = ({ onClick, children }: ButtonProps) => {
  return (
    <button onClick={onClick} type="submit" className="h-8 flex items-center text-white dark:bg-white dark:text-black bg-gray-800 hover:bg-gray-900 dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-800 font-medium rounded-lg text-sm px-5 py-2.5  mb-2">
      {children}
    </button>

  );
};