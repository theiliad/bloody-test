var variables = [];
var variableNames = ["Sodium", "Potassium", "Chloride", "Carbon Dioxide", "Calcium", "Protein", "Albumin", "Globulin", "A/G Ratio", "Bilirubin", "Alkaline", "AST", "ALT", "Creatine"];

var PROGRESS_STEPS = ["Downloading the Image",
                      "Extracting your results data",
                      "Analyzing the Data"];

angular.module('dangerZone')
        .config(function($mdThemingProvider) {
          $mdThemingProvider.theme('default')
            .primaryPalette('red')
            .accentPalette('indigo');
        })

        .controller("dangerZoneCtrl", function($rootScope, $scope, $mdSidenav, $mdToast, $state, $http) {
            $scope.PROGRESS_STEPS = PROGRESS_STEPS;
            console.log(PROGRESS_STEPS);
            
            $scope.analyze = function(url) {
                $scope.getBase64FromImageUrl(url);
                
                $scope.progress = true;
                $scope.progressIndex = 0;
            }
            
            $scope.getBase64FromImageUrl = function(url) {
                var img = new Image();

                img.setAttribute('crossOrigin', 'anonymous');

                img.onload = function () {
                    $scope.progressIndex = 1;
                    
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
                        $scope.progressIndex = 2;
                        
                        // this callback will be called asynchronously
                        // when the response is available
                        console.log(data.responses[0].textAnnotations[0].description.split('\n'));
                        
                        $scope.getVariables(data.responses[0].textAnnotations[0].description.split('\n'));
                      })
                        .error(function(data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                      });
                };

                img.src = url;
            }
            
            $scope.getVariables = function(data) {
                for (var i = 0; i < data.length; i++) {
                    for (var k = 0; k < variableNames.length; k++) {
                        var variableToCheckFor = variableNames[k];
                        
                        if (variableNames[k] != "ALT" && variableNames[k] != "AST") {
                            variableToCheckFor = variableNames[k].toLowerCase();
                            
                            if (data[i].toLowerCase().indexOf(variableToCheckFor) != -1) {
                                for (var j = i; j < data.length; j++) {
                                    if (!isNaN(data[j])) {
                                        variables[variableNames[k]] = data[j];

                                        break;
                                    }
                                }
                            }
                        } else {
                            if (data[i].indexOf(variableToCheckFor) != -1) {
                                for (var j = i; j < data.length; j++) {
                                    if (!isNaN(data[j])) {
                                        variables[variableNames[k]] = data[j];

                                        break;
                                    }
                                }
                            }
                        }
                        
                        
                    }
                }
                
                console.log(variables);
            }
        });