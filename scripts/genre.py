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

def get_song_genres(song_id):
    try:
        # Get track information
        track = sp.track(song_id)
        
        # Get artists' information
        artists = track['artists']
        
        # Get the first artist's ID
        artist_id = artists[0]['id']
        
        # Get artist's genres
        artist = sp.artist(artist_id)
        genres = artist['genres']
        
        return genres
    # Handle any errors that might occur during API calls
    except Exception as e:
        print("Error:", e)
        return []

#example
song_id = '6habFhsOp2NvshLv26DqMb' #this is despacito
genres = get_song_genres(song_id)
print("Genres:", genres)


