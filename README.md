# Spotify Playlist Analyzer

This project is an application to analyze Spotify playlists and categorize it based on its audio features. 

This application is built in AngularJS.

You can access the site at:
link

## Spotify API Playlist ID

How to get a spotify playlist id:
- Navigate to share option for a playlist in Spotify(either on desktop/web/mobile)
- Select "copy link" for the playlist
Ex:

`https://open.spotify.com/playlist/37i9dQZF1DWXT8uSSn6PRy?si=eCK6uyusRK2DMTHvJiwdUg`

- copy the id the at the end of the url (after /`playlist/`)
Ex:

`37i9dQZF1DWXT8uSSn6PRy?si=eCK6uyusRK2DMTHvJiwdUg`

- enter the code into the input field and click search


## Some Details

The Spotify API is accessed using the Client Credentials Flow:

https://developer.spotify.com/documentation/general/guides/authorization-guide/

## Running the Application
To run the application:

`npm start`


## To Do:
- create a results page with the classification
- make the classification algorithm more robust
- change from client credentials to user credentials flow