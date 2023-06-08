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

param_1 = 'not'
param_2 = 'gosh'



def search_song(artist, song_name):
    return_list = []
    results = sp.search(q=f'artist:{artist} track:{song_name}', type='track', limit=1)
    if results['tracks']['total'] > 0:
        track = results['tracks']['items'][0]
        return_list.append(track['name'])
        return_list.append(track['artists'][0]['name'])
        return_list.append(track['album']['name'])
        return_list.append(track['album']['release_date'])
        return_list.append(track['preview_url'])
        return return_list
    else:
        return 0

sand = search_song(param_1, param_2)
print(sand)