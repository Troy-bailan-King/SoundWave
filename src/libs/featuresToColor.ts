/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// Disable eslint rule for unsafe member access

// Import the 'tinycolor2' library to manipulate colors
import tinycolor from 'tinycolor2';

// Define a function to map audio features to colors
export default function featuresToColors(features: any) {
  // Check if features are provided and if 'danceability' feature exists
  if (!features || !features.danceability) {
    // Return a default color ('slategray') if features are missing
    return tinycolor('slategray');
  }

  // Map audio features to RGB color values using 'tinycolor'
  return tinycolor({
    r: features.danceability * 255, // Map 'danceability' to red channel
    g: features.valence * 255,      // Map 'valence' to green channel
    b: features.energy * 255        // Map 'energy' to blue channel
  });
}