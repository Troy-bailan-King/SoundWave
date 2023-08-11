import type { PropsWithChildren } from "react";

// Define the PageLayout component that accepts props with children
export const PageLayout = (props: PropsWithChildren) => {
  return (
    // Main container element for the page layout
    <main className="overflow-none flex h-screen justify-start">
     
      <div className="flex h-full w-full flex-col border-4 border-yellow-800 md:max-w-2xl">
        
        {props.children}
      </div>
    </main>
  );
};