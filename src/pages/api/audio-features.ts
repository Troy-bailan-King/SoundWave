/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// Disable eslint rule for unsafe assignments

// Import necessary functions and modules
import { getAudioFeatures } from '../../libs/spotify'; // Importing function to get audio features from Spotify API
import { NextApiRequest, NextApiResponse } from 'next'; // Importing types for Next.js API
import { getToken } from 'next-auth/jwt'; // Importing function to retrieve authentication token

// Define the handler function for the API route
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Get authentication token from the request
  const token = await getToken({ req });

  // Get the query parameters from the request
  const { query } = req;

  // Check if query contains 'ids' parameter and token is available
  if (query.ids && token) {
    // Extract 'ids' parameter from query
    const ids = query.ids;

    // Extract access token from the authentication token
    const accessToken = token.accessToken as string;

    // Call the getAudioFeatures function to fetch audio features from Spotify
    const response = await getAudioFeatures(accessToken, ids as string);

    // Parse the JSON response and extract 'audio_features'
    const { audio_features } = await response.json();

    // Return the audio features as JSON response with a success status
    return res.status(200).json(audio_features);
  }

  // If 'ids' parameter is not provided or token is missing, return an error response
  return res.status(400).json({ error: "No ids provided" });
};

// Export the handler function as the default export
export default handler;