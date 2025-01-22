// import { useEffect, useState } from "react";

interface Props {
  message: string;
  type: string;
}

export const MessageToast = ({ message, type }: Props) => {

  // const [isVisible, setIsVisible] = useState(true);

  // // useEffect(() => {
  // //   const timer = setTimeout(() => {
  // //     setIsVisible(false);
  // //   }, 1000); // Show for 1 second (1000 milliseconds)

  // //   return () => clearTimeout(timer); // Clean up the timer
  // // }, []);

  // if (!isVisible) return null;

  if (type === "error") {
    return (
      <div
        className="flex items-center p-4 mb-4 mt-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
        role="alert"
      >
        <svg
          className="flex-shrink-0 inline w-4 h-4 me-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
        <span className="sr-only">Error</span>
        <div>
          <span className="font-medium">{message}</span> Ha ocurrido un error
        </div>
      </div>
    );
  } else if (type === "loading") {
    return (
      <div
      className="flex items-center p-4 mb-4 mt-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-red-400"
        role="alert"
      >
    
        <svg
          className="flex-shrink-0 inline w-4 h-4 me-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
        <span className="sr-only">Loading</span>
        <div>
          <span className="font-medium">Info alert!</span> Cargando...
        </div>
      </div>
    );
  }

  return null;
};
