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

client_id = config.SPOTIPY_CLIENT_ID
client_secret = config.SPOTIPY_CLIENT_SECRET


client_credentials_manager = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

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