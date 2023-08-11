/* eslint-disable @typescript-eslint/no-unsafe-call */
// Disable eslint rule for unsafe calls
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// Disable eslint rule for unsafe assignments

// Import necessary modules and functions
import { NextApiRequest, NextApiResponse } from "next"; // Importing types for Next.js API
import unstable_getServerSession from "next-auth"; // Importing function to get server session data
import { authOptions as nextAuthOptions } from "./auth/[...nextauth]"; // Importing authentication options

// Define the restricted endpoint handler function
const restricted = async (req: NextApiRequest, res: NextApiResponse) => {
  // Retrieve session data using unstable_getServerSession
  const session = await unstable_getServerSession(req, res, nextAuthOptions);

  // Check if session data is available
  if (session) {
    // Send protected content if the user is signed in
    res.send({
      content:
        "This is protected content. You can access this content because you are signed in.",
    });
  } else {
    // Send an error message if the user is not signed in
    res.send({
      error: "You must be signed in to view the protected content on this page.",
    });
  }
};

// Export the restricted endpoint handler function as the default export
export default restricted;
