'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])
.factory('spotifyApi', ['$http', function($http){

  //factory service to handle spotify api calls

  var spotfiyApi = {};
  spotfiyApi.clientId = "a1d89dc9d68c43d095e3a6d44fbfc76a";
  spotfiyApi.clientSecret = "bd17f8a23a3c45a18bfa1b593cd0977e";
  spotfiyApi.redirectUri = 'http://www.example.com/callback';

  var encoded = btoa(spotfiyApi.clientId + ":" + spotfiyApi.clientSecret);

  spotfiyApi.setAccessToken = function(){
    $http({
      method: 'POST',
      url: 'https://accounts.spotify.com/api/token',
      data: 'grant_type=client_credentials',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': ' Basic ' + encoded
      }
    }).then(function successCallback(response){
      spotfiyApi.token = response.data.access_token;
      console.log(spotfiyApi.token);
    }, function errorCallback(response){
      console.log(response);
    });
  };

  spotfiyApi.getPlaylist = function(playListid, $scope){
    $http({
      method: 'GET',
      url: 'https://api.spotify.com/v1/playlists/' + playListid,
      headers: {
        'Authorization': 'Bearer ' + spotfiyApi.token
      }
    }).then( function successCallback(response){
      console.log(response.data.tracks);
      
      $scope.tracks = response.data.tracks.items;
      var items = [];
      for(let i = 0; i < $scope.tracks.length; i++){
        $scope.tracks[i].track.num = i;
        //rewrite the artists object to only include the primary artist for now
        $scope.tracks[i].track.artists = $scope.tracks[i].track.artists[0].name;
        items.push($scope.tracks[i].track);
      }

      $scope.tracks = items;
      console.log(items);
    }, function errorCallback(response){
      console.log(response);
      $scope.error = response.data.error.message;
    })
  };
  

  spotfiyApi.audioFeatures = function(tracks, $scope){
    $http({
      method: 'GET',
      url: 'https://api.spotify.com/v1/audio-features',
      params: {
        'ids': tracks
      },
      headers: {
        'Authorization' : 'Bearer ' + spotfiyApi.token
      }
    }).then( function successCallback(response){

      
      function classify(stats){
        let result = '';
        if(stats.dance > 0.5 && stats.energy > 0.5 && stats.inst <= 0.5 && tempo > 120){
          result = 'club';
        }
        else if(stats.dance <= 0.5 && stats.energy <= 0.5 && stats.inst > 0.5 && stats.tempo < 100){
          result = 'study';
        }
        else{
          result = 'gym';
        }
        return result;
      }


      let sumInst = 0;
      let sumDance = 0;
      let sumEnergy = 0;
      let sumTempo = 0;

      let trackStats = response.data.audio_features;

      for(let i = 0; i < trackStats.length; i++){
        sumInst += trackStats.instrumentalness;
        sumDance += trackStats.danceability;
        sumEnergy += trackStats.energy;
        sumTempo += trackStats.tempo;
      }
      let stats = {
        'inst' : sumInst/trackStats.length,
        'dance' : sumDance/trackStats.length,
        'energy' : sumEnergy/trackStats.length,
        'tempo' : sumTempo/trackStats.length
      };

      //throwing error for setting category
      let results = classify(stats);
      console.log(results);
      $scope.category = results;
    }, function errorCallback(response){
      console.log(response);
    })
  }
  return spotfiyApi;
}])

.controller('View1Ctrl', ['spotifyApi','$scope', function(spotfiyApi, $scope) {

  //get access token on page initialization
  $scope.init = function(){

    console.log('encoding data');
    spotfiyApi.setAccessToken();
    
  }

  $scope.getPlaylist = function(){

    $scope.tracks = spotfiyApi.getPlaylist($scope.playlistid, $scope);
    console.log($scope.tracks);

  }


  $scope.analyze = function(){
    //pass in the list of ids as a comma seperated string
    let tracks = '';
    for(let i = 0; i < $scope.tracks.length; i++){
      //if at the end of the array, dont add a comma
      if(i == $scope.tracks.length - 1){
        tracks = tracks.concat($scope.tracks[i].id);
      }
      else{
        tracks = tracks.concat($scope.tracks[i].id, ',');
      }

    }

    spotfiyApi.audioFeatures(tracks, $scope);
  }
}]);  