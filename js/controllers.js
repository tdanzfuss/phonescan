angular.module('starter', [])




.controller('CameraCtrl', function ($scope, $http, $timeout) {

    $scope.orderNumber = null;
    $scope.name = null;    
    $scope.ttime = null;
    $scope.loc = null;
    $scope.loc2 = null;
    $scope.txtF = null;
    $scope.utime = null;
    $scope.picData = null;
    $scope.initializeServiceProviders = function () {
        return {
            //type: '',
            //typeDisplay: '',
            locationMode: 0,
            location: {},
            providers: {},
            selectedProvider: {},
            availableLocations: {},
            gotSavedLocations: false,
            locationSpecified: false
        };
    }

    $scope.geoSuccess = function (position) {
        // $scope.loc = "Latitude: " + position.coords.latitude + "  Longitude: " + position.coords.longitude;
        $scope.loc = "POINT(" + position.coords.longitude + " " + position.coords.latitude + ")"; // Format it into POINT WKT
        $scope.$apply();
    }
    $scope.geoError = function (error) {
        $scope.loc = "unable to get location."
    }
    $scope.serviceProvider = $scope.initializeServiceProviders();

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition($scope.geoSuccess, $scope.geoError);
    } else {
        $scope.loc = "Geolocation is not supported by this browser.";
    }
    $scope.serviceProvider.locationMode = 1

    //Take photo call
    $scope.takePic = function () {
        $scope.ttime = new Date();
        $scope.nname = $scope.name;
        try {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition($scope.geoSuccess, $scope.geoError);
            } else {
                $scope.loc = "Geolocation is not supported by this browser.";
            }
        }
        catch (err) {
            $scope.loc = err.message;
        }
        //$scope.convertImageToBase64('rimg.jpg', $scope.send);
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,      // 0:Photo Library, 1=Camera, 2=Saved Photo Album
            encodingType: Camera.EncodingType.JPEG,     // 0=jpg 1=png
            saveToPhotoAlbum: false
        }
        navigator.camera.getPicture(onSuccess, onFail, options);
    }
    var onSuccess = function (FILE_URI) {
        console.log(FILE_URI);
        $scope.picData = FILE_URI;
        $scope.$apply();
        // $scope.convertImageToBase64(FILE_URI, $scope.send);
    };
    var onFail = function (e) {
        console.log("On fail " + e);
    }

    $scope.convertImageToBase64 = function (url, callback) {
        var canvas = document.createElement('CANVAS');
        var ctx = canvas.getContext('2d');
        var img = new Image;
        img.onload = function () {
            canvas.height = img.height;
            canvas.width = img.width;
            ctx.drawImage(img, 0, 0);
            $scope.dataURL = canvas.toDataURL('image/jpg');
            callback.call();
            // Clean up
            canvas = null;
        };
        // everything setup, lets go!
       img.src = url;
    }

    $scope.send = function () {
        $scope.convertImageToBase64($scope.picData, function (base64Img) {
            $scope.utime = new Date();
            $http.post('http://temp.chills.co.za/instantPOD/api/POD',
                {
                    orderNumber: $scope.orderNumber,
                    dateTaken: $scope.ttime,
                    dateSent:$scope.utime,
                    location: $scope.loc,
                    img: base64Img
                })
            .success(function (data, status, headers, config) {
                //   debugger;
            }).error(function (data, status, header, config) {
                alert(data);
                //  debugger;
            });
        });     
    }   
})


