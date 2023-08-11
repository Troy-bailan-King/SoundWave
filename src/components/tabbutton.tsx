// Import necessary modules and functions
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import textColor from "../libs/textColor";
import tinycolor from "tinycolor2";
/* eslint-disable @next/next/no-img-element */

// Component to render a tab button
export default function TabButton({
  tabNumber,
  setOpenTab,
  display,
  song,
  color,
  children,
}: {
  tabNumber: number;
  setOpenTab: (tabNumber: number) => void;
  display: boolean;
  song: any;
  color: tinycolor.Instance;
  children: JSX.Element;
}) {
  return (
    // Button element for the tab
    <button
      className={
        "flex h-20 w-1/3 flex-row items-center justify-center p-2 " +
        // Apply different rounded styles based on tabNumber
        (tabNumber === 0 ? "rounded-tl-2xl" : tabNumber === 1 ? "rounded-tr-2xl" : "")
      }
      style={{
        // Set background color based on the provided color
        backgroundColor: color.toHexString(),
        // Set text color based on the provided color using textColor function
        color: textColor(color, [tinycolor("white")]),
      }}
      onClick={() => setOpenTab(tabNumber)}
    >
      {/* Display song image if available */}
      {song.img && (
        <img
          className="mx-5 hidden aspect-square h-3/4 rounded md:block"
          alt={song.name}
          src={song.img}
        />
      )}
      {/* Display children elements within the button */}
      {children}
    </button>
  );
}
