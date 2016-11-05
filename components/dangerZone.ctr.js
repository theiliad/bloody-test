angular.module('dangerZone')
        .config(function($mdThemingProvider) {
          $mdThemingProvider.theme('default')
            .primaryPalette('deep-orange')
            .accentPalette('indigo');
        })

        .controller("dangerZoneCtrl", function($rootScope, $scope, $mdSidenav, $mdToast, $state, $http) {
            $scope.analyze = function(url) {
                $scope.getBase64FromImageUrl(url);
            }
            
            $scope.getBase64FromImageUrl = function(url) {
                var img = new Image();

                img.setAttribute('crossOrigin', 'anonymous');

                img.onload = function () {
                    $scope.imageLoaded = true;
                    
                    var canvas = document.createElement("canvas");
                    canvas.width =this.width;
                    canvas.height =this.height;

                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(this, 0, 0);

                    var dataURL = canvas.toDataURL("image/jpg");
                    dataURL = dataURL.replace("data:image/png;base64,", "");

//                    console.log(dataURL);
                    
                    var parameter = JSON.stringify({
                                 "requests": [
                                  {
                                   "features": [
                                    {
                                     "type": "TEXT_DETECTION"
                                    }
                                   ],
                                   "image": {
                                     "content": dataURL
                                   }
                                  }
                                 ]
                                });
                    $http.post('https://vision.googleapis.com/v1/images:annotate?key= AIzaSyBMSx7JI7HlEnGLKUJ0goYuJhbJq1kWHYg', parameter).
                    success(function(data, status, headers, config) {
                        // this callback will be called asynchronously
                        // when the response is available
                        console.log(data.responses[0].textAnnotations[0].description);
                      }).
                      error(function(data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                      });
                };

                img.src = url;
            }
        });