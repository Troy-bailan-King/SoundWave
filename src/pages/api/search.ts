/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getSearch } from '../../libs/spotify';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';


// An async function handling the API request
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Asynchronously retrieve the access token using a function called "getToken"
  const token = await getToken({ req });
  
  // Extract the query parameters from the request
  const { query } = req;

  // Check if a query parameter 'q' exists and a valid token is obtained
  if (query.q && token) {
    // Extract the 'q' parameter value as a string
    const q = query.q as string;
    
    // Extract the access token from the obtained token object
    const accessToken = token.accessToken as string;
    
    // Call an API function named "getSearch" with the access token and query 'q'
    const response = await getSearch(accessToken, q);
    
    // Parse the JSON response and extract the 'tracks' object
    const { tracks } = await response.json();
    
    // Respond with a success status code (200) and the 'items' property of the 'tracks'
    return res.status(200).json(tracks.items);
  }
  
  // In case the conditions are not met, the function execution will reach here.
  // It is important to handle potential cases where conditions aren't met.
};

export default handler;