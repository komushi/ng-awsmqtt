# ng-awsmqtt
## AWS Websocket MQTT client - Angular Service

## Installation

### Install via Bower:
```bash
$ bower install ng-awsmqtt
```

#### Add dependencies to your HTML file
```html
<script src="bower_components/angular/angular.min.js"></script>
<script src="bower_components/aws-mqtt-browser/lib/aws-mqtt-browser.js"></script>
<script src="bower_components/ng-awsmqtt/dist/ng-awsmqtt.min.js"></script>
```
----

## Usage
Inject it in your controller:
```js
var app =  angular.module('ngMqttExample', ['ng-awsmqtt']);

app.controller('mqttController', ['$scope', '$mqtt', function($scope, $mqtt){

    // Connect
    $scope.connect = function () {
        $mqtt.connect($scope.awsMqtt.name, $scope.awsMqtt.endpoint, $scope.awsMqtt.region, $scope.awsMqtt.accessKeyId, $scope.awsMqtt.secretAccessKey)
            .then(null, null, showResponse);
    };

    // Disconnect
    $scope.disconnect = function () {
        $mqtt.disconnect($scope.awsMqtt.name).then(
            function () {
                console.log('Disconnected');
            });        
    };
    
    // Subscribe a topic
    $scope.subscribe = function () {
        $mqtt.subscribe($scope.awsMqtt.name, $scope.awsMqtt.subdest)
            .then(function (message) {
                console.log(JSON.stringify(message));
            })
            .catch(function (err) {
                console.error(err);
            });
    };


    // Unsubscribe a topic
    $scope.unsubscribe = function () {
        $mqtt.unsubscribe($scope.awsMqtt.name, $scope.awsMqtt.subdest)
            .then(function (message) {
                console.log(JSON.stringify(message));
            })
            .catch(function (err) {
                console.error(err);
            });
    };

    // Send a message
    $scope.send = function () {
        $mqtt.send($scope.awsMqtt.name, $scope.awsMqtt.pubdest, JSON.parse($scope.awsMqtt.payload));
    };

    // notify callback function
    var showResponse = function (payload) {
        console.log(payload.topic, payload.message.toString('utf-8'));
    };

    var initialize = function () {
        $scope.awsMqtt = {}

        $scope.awsMqtt.region = 'region';
        $scope.awsMqtt.endpoint = 'endpointid.iot.region.amazonaws.com';
        $scope.awsMqtt.accessKeyId = 'AccessKeyId';
        $scope.awsMqtt.secretAccessKey = 'SecretAccessKey';
        $scope.awsMqtt.subdest = 'topic';
        $scope.awsMqtt.pubdest = 'topic';
        $scope.awsMqtt.payload = '{"name":"Tom", "type":"Type0", "sales":50}';
        $scope.awsMqtt.name = 'aws_iot_mqtt_test';
    };

    initialize();

}]);
```