'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])
.factory('spotifyApi', ['$http', function($http){
  var spotfiyApi = {};
  spotfiyApi.clientId = "a1d89dc9d68c43d095e3a6d44fbfc76a";
  spotfiyApi.clientSecret = "bd17f8a23a3c45a18bfa1b593cd0977e";
  spotfiyApi.redirectUri = 'http://www.example.com/callback';

  var encoded = btoa(spotfiyApi.clientId + ":" + spotfiyApi.clientSecret);

  spotfiyApi.doSomething = function(){
    console.log(encoded);
  }
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
        items.push($scope.tracks[i].track);
      }

      $scope.tracks = items;
      console.log(items);
    }, function errorCallback(response){
      console.log(response);
      $scope.error = response.data.error.message;
    })
  };
  
  return spotfiyApi;
}])

.controller('View1Ctrl', ['spotifyApi','$scope', function(spotfiyApi, $scope) {
  $scope.init = function(){
    console.log('encoding data');
    spotfiyApi.setAccessToken();
    
  }

  $scope.getPlaylist = async function(){

    $scope.tracks = await spotfiyApi.getPlaylist($scope.playlistid, $scope);
    console.log($scope.tracks);
  }
}]);  