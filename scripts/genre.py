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
    
    except Exception as e:
        print("Error:", e)
        return []

#example
song_id = '6habFhsOp2NvshLv26DqMb' #this is despacito
genres = get_song_genres(song_id)
print("Genres:", genres)


