// PlusIcon component to render a plus icon using SVG
export default function PlusIcon(props: any) {
  return (
    // SVG element representing the plus icon
    <svg
      {...props} // Spread the props to the SVG element
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      {/* Path of the plus icon */}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}
