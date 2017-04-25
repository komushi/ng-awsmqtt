/**
 * ng-awsmqtt
 *
 * @version 0.1.2
 * @author Lei Xu <komushi@gmail.com>
 * @license MIT
 */

(function (factory) {
  'use strict'
  if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory(
      typeof angular !== 'undefined' ? angular : require('angular'),
      typeof AWSMqtt !== 'undefined' ? AWSMqtt : require('aws-mqtt')
    )
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['angular', 'aws-mqtt'], factory)
  } else {
    // Browser globals
    factory(angular, AWSMqtt)
  }
}(function (angular, AWSMqtt) {
  angular
  .module('ng-awsmqtt', [])
  .service('$mqtt', [
    '$rootScope', '$q',
    function ($rootScope, $q) {

      var mqttClients = {}

      this.connect = function (name, endpoint, region, accessKeyId, secretAccessKey) {

        var dfd = $q.defer()

        mqttClients[name] = AWSMqtt.connect({
          WebSocket: window.WebSocket, 
          region: region,
          credentials: {
            accessKeyId: accessKeyId, 
            secretAccessKey: secretAccessKey,
            get: function(callback) {
              callback()
            }
          },
          endpoint: endpoint, // NOTE: get this value with `aws iot describe-endpoint`
          clientId: 'mqtt-client-' + (Math.floor((Math.random() * 100000) + 1)), // clientId to register with MQTT broker. Need to be unique per client
        });

        mqttClients[name].on('connect', function(frame) {
          dfd.notify({topic: 'connack', message: JSON.stringify(frame)})
        })

        // mqttClients[name].on('error', function(error) {
        //   dfd.reject(error)
        // })

        mqttClients[name].on('message', function(topic, message) {
          dfd.notify({topic: topic, message: message})
        })

        return dfd.promise
      }

      this.disconnect = function (name) {
        var dfd = $q.defer()

        mqttClients[name].end(true, dfd.resolve)

        return dfd.promise
      }


      this.unsubscribe = function (name, topic) {

        var dfd = $q.defer()

        if (mqttClients[name]) {
          if (mqttClients[name].connected){
            mqttClients[name].unsubscribe(topic, function (err) {
              if (err) {
                dfd.reject(err)
              } else {
                dfd.resolve({subscribedTopics: mqttClients[name]._subscribedTopics})
              }
            })
          }
        }

        return dfd.promise
      }

      this.subscribe = function (name, topic) {

        var dfd = $q.defer()

        if (mqttClients[name]) {
          if (mqttClients[name].connected){
            mqttClients[name].subscribe(topic, function (err, granted) {
              if (err) {
                dfd.reject(err)
              } else {
                dfd.resolve({granted: granted, subscribedTopics: mqttClients[name]._subscribedTopics})
              }
            })
          }
        }

        return dfd.promise
      }


      this.send = function (name, topic, body) {
        var dfd = $q.defer()
        try {
          var payloadJson = JSON.stringify(body)

          mqttClients[name].publish(topic, payloadJson)

          dfd.resolve()
          
        } catch (e) {
          dfd.reject(e)
        }
        return dfd.promise
      }

      this.isConnected = function (name) {

        if (mqttClients[name]) {
          if (mqttClients[name].connected && !mqttClients[name].disconnecting){
            return true
          }
        }

        return false
      }

    }]
  )
}))
