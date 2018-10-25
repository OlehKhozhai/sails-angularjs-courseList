angular.module('app', [])
  .controller('myCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.inputStyle = false;
    $scope.messages = [];

    $scope.connecting = (function () {
      $http
        .get('http://@localhost:1337/test')
        .then(function (dataDb) {
          if (dataDb.status === 200)
            $scope.messages = dataDb.data;
        });
      io.socket.post('/on-connect');
    }());

    $scope.change = function (bool, idCourse) {
      io.socket.put('/update', {
        done: bool,
        id: idCourse
      });
    };
   
    $scope.changeInput = function(){

      $http.get('http://@localhost:1337/test?where={"name":"' + $scope.input + '"}')
      .then(function (response) {
        if(response.data.length >=1){
          console.log('url exists');
        }
       
      });
    };


    // $scope.changeInput = function(){

    //   $http.get('http://@localhost:1337/test?where={"name":{"contains":"' + channelName + '"}}')
    //   .then(function (dataDb) {
    //     dataDb.data.forEach(element => {
    //        if($scope.input == element.name){
    //         console.log('DB answer');
    //         $scope.inputStyle = true; 
    //        }
    //     });
       
    //   });
    // };

    $scope.send = function (courseName) {
      // $http
      //   .get('http://@localhost:1337/test')
      //   .then(function (dataDb) {
      //     if (dataDb.status === 200)
      //       $scope.messages = dataDb.data;
      //   });
      
      if (courseName != '') { io.socket.post('/send', { name: courseName, done: false })};
      if (!courseName) console.log('Please enter something ');
    };



    $scope.delete = function (message) {
      io.socket.delete('/delete-msg', message)
    };

    io.socket.on('newCourse', function (dataBroad) {
      $scope.messages.push(dataBroad);
      $scope.$digest();
    });

    io.socket.on('updateDone', function (bool) {
      let i = $scope.messages.findIndex(obj => obj.id === bool.id);
      $scope.messages[i].done = bool.done;
      $scope.$digest();
    });

    io.socket.on('delete', function (removeMsg) {
      let i = $scope.messages.findIndex(obj => obj.id === removeMsg.id);
      $scope.messages.splice(i, 1);
      $scope.$digest();
    });
  }]);
