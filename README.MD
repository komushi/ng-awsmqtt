# ng-awsmqtt
## AWS IoT MQTT client - Angular Service

----

## 1. Installation
### Install via Bower:
```bash
$ bower install ng-awsmqtt
```

## 2. Usages
### 2-1. Add dependencies to your HTML file
```html
<script src="bower_components/angular/angular.min.js"></script>
<script src="bower_components/aws-mqtt-browser/lib/aws-mqtt-browser.js"></script>
<script src="bower_components/ng-awsmqtt/dist/ng-awsmqtt.min.js"></script>
```

### 2-2. Declate ng-awsmqtt as a dependency in your application
```
var app =  angular.module('your-app', ['ng-awsmqtt']);
```

### 2-3. Inject in your controller
```
app.controller('your-controller', ['$scope', '$mqtt', function($scope, $mqtt){
    ...
}
```

### 2-3. Available Methods
#### 2-3-1. Connect to an endpoint
```
$mqtt.connect('my-connection-to-endpoint1', 
    'abcdmyend123.iot.ap-northeast-1.amazonaws.com', 
    'ap-northeast-1', 
    'AKIAI5C4SY1111111', 
    'fdgdfgte45345redsjxcgx7ctg3h45')
    .then(null, null, function(payload){
        // handle the connection response
        console.log(payload.topic, payload.message.toString('utf-8'));
    });
```

#### 2-3-2. Disconnect from an endpoint
```
$mqtt.disconnect('my-connection-to-endpoint1',).then(
    function () {
        console.log('Disconnected');
    });   
```

#### 2-3-3. Subscribe to a topic
```
$mqtt.subscribe('my-connection-to-endpoint1', 'iotbutton/001')
    .then(function (message) {
        // when receive a message
        console.log(JSON.stringify(message));
    })
    .catch(function (err) {
        // error handling
        console.error(err);
    });
```

#### 2-3-4. Unsubscribe from a topic
```
$mqtt.unsubscribe($scope.awsMqtt.name, $scope.awsMqtt.subdest)
    .then(function (message) {
        // unsubscribe result
        console.log(JSON.stringify(message));
    })
    .catch(function (err) {
        // error handling
        console.error(err);
    });
```

#### 2-3-5. Send message to a topic
```
$mqtt.send('my-connection-to-endpoint1', 
    'iotbutton/002', 
    'my-payload-text');
```

----

## Example
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
        $mqtt.subscribe($scope.awsMqtt.name, $scope.awsMqtt.topic)
            .then(function (message) {
                console.log(JSON.stringify(message));
            })
            .catch(function (err) {
                console.error(err);
            });
    };


    // Unsubscribe a topic
    $scope.unsubscribe = function () {
        $mqtt.unsubscribe($scope.awsMqtt.name, $scope.awsMqtt.topic)
            .then(function (message) {
                console.log(JSON.stringify(message));
            })
            .catch(function (err) {
                console.error(err);
            });
    };

    // Send a message
    $scope.send = function () {

        // use JSON.parse($scope.awsMqtt.payload) to send JSON string
      $mqtt.send($scope.awsMqtt.name, $scope.awsMqtt.topic, $scope.awsMqtt.payload);
    };

    // notify callback function
    var showResponse = function (payload) {
        console.log(payload.topic, payload.message.toString('utf-8'));

        $scope.rows.push({topic : payload.topic, message : payload.message.toString('utf-8') });
    };

    var initialize = function () {
        $scope.awsMqtt = {}

        $scope.awsMqtt.region = 'ap-northeast-1';
        $scope.awsMqtt.endpoint = 'yourendpoint.iot.ap-northeast-1.amazonaws.com';
        $scope.awsMqtt.accessKeyId = 'yourkeyid';
        $scope.awsMqtt.secretAccessKey = 'yoursecret';
        $scope.awsMqtt.topic = 'iotbutton/001';
        $scope.awsMqtt.payload = '{"name":"Tom", "type":"Type0", "sales":50}';
        $scope.awsMqtt.name = 'aws_iot_mqtt_test';

        $scope.rows = [];
    };

    initialize();

}]);
```

## TODO
* Cognito Identity Pool - Unauthorized