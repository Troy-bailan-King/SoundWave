/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// Disable eslint rule for unsafe assignments

// Import necessary functions and modules
import { getSearchById, createPlaylist } from '../../libs/spotify'; // Importing functions from 'libs/spotify'
import { NextApiRequest, NextApiResponse } from 'next'; // Importing types for Next.js API
import { getToken } from 'next-auth/jwt'; // Importing function to retrieve authentication token

// Define the handler function for the API route
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Get authentication token from the request
  const token = await getToken({ req });

  // Get the query parameters from the request
  const { query } = req;

  // Check if 'ids', 'name', and token are provided in the query parameters
  if (query.ids && query.name && token) {
    // Extract 'ids', 'name', and 'description' parameters from query
    const ids = query.ids as string;
    const name = query.name as string;
    const desc = query.description as string;
    
    // Extract access token from the authentication token
    const accessToken = token.accessToken as string;

    // Call the createPlaylist function to create a playlist on Spotify
    const response = await createPlaylist(accessToken, name, desc, ids);

    // Return the response from playlist creation as JSON response with a success status
    return res.status(200).json(response);
  }

  // If required parameters are missing, return an error response
  return res.status(400).json({ error: "No id provided" });
};

// Export the handler function as the default export
export default handler;