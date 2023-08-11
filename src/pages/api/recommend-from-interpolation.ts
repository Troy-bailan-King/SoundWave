/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// Disable eslint rule for unsafe member access
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// Disable eslint rule for unsafe assignments

// Import necessary functions and modules
import { getRecommendation } from '../../libs/spotify'; // Importing function to get music recommendations from Spotify API
import { NextApiRequest, NextApiResponse } from 'next'; // Importing types for Next.js API
import { getToken } from 'next-auth/jwt'; // Importing function to retrieve authentication token

// Define the handler function for the API route
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Get authentication token from the request
  const token = await getToken({ req });

  // Get the query parameters from the request
  const { query } = req;

  // Check if 'interpolation' parameter and token are provided in the query parameters
  if (query.interpolation && token) {
    // Extract 'interpolation' parameter from query
    const { interpolation } = query;

    // Determine the limit of recommendations to retrieve
    let limit: number;
    if (query.limit) {
      limit = Number(query.limit);
    } else {
      limit = 1;
    }

    // Parse the 'interpolation' parameter as an object
    const interpolationObj = JSON.parse(interpolation as string);

    // Extract access token from the authentication token
    const accessToken = token.accessToken as string;

    // Call the getRecommendation function to get music recommendations from Spotify
    const response = await getRecommendation(accessToken, interpolationObj, limit);

    // Parse the JSON response and extract 'tracks'
    const json = await response.json();
    const tracks = json.tracks;

    // Return recommended tracks as JSON response with a success status
    return res.status(200).json(tracks);
  }

  // If required parameters are missing, return an empty response
};

// Export the handler function as the default export
export default handler;