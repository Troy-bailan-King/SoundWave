import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import os
import sys
import json
import webbrowser
import spotipy.util as util
from json.decoder import JSONDecodeError
import config



#---------------
# Get client_id and client_secret from the config file
client_id = config.SPOTIPY_CLIENT_ID
client_secret = config.SPOTIPY_CLIENT_SECRET

# Create a Spotify client credentials manager using the provided client_id and client_secret
client_credentials_manager = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
# Create a Spotify instance using the client credentials manager
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

# Function to get the Spotify song ID based on the song name
def get_song_id(song_name):
    try:
        # Search for the song
        results = sp.search(q=song_name, type='track', limit=1)
        
        # Get the first track's ID
        tracks = results['tracks']['items']
        if tracks:
            song_id = tracks[0]['id']
            return song_id
        else:
            print("Song not found.")
            return None
        
    except Exception as e:
        print("Error:", e)
        return None

# Example usage
song_name = 'Despacito'
song_id = get_song_id(song_name)
if song_id:
    print("Song ID:", song_id)