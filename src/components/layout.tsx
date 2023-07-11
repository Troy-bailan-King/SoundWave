import type { PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <main className="overflow-none flex h-screen justify-start">
      <div className="flex h-full w-full flex-col  border-4 border-yellow-800 md:max-w-2xl">
        {props.children}
      </div>
    </main>
  );
};