import Vue from 'vue'

new Vue({
  el: '#app',
  data:{
    title:'MQTT 2',
    client:null,
    messages:[],
  },
  methods:{
    connect:function(){
      var localtion = {
        hostname:'64.227.50.39',
        port:8083
      };
      this.client = new Paho.Client(location.hostname, Number(location.port), "clientId");

      // set callback handlers
      this.client.onConnectionLost = this.onConnectionLost;
      this.client.onMessageArrived = this.onMessageArrived;

      // connect the client
      this.client.connect({
        onSuccess:this.onConnect, 
        onFailure:this.onFailure,
        cleanSession:true,
        keepAliveInterval:120,
        timeout:10,
        reconnect:true,
      });
      
    },
    subscribe:function(){
      var topic = 'test';
      this.client.subscribe();
    },
    onConnect:function(response){
      console.log("onConnect");
      this.client.subscribe("World");
      message = new Paho.Client.Message("Hello");
      message.destinationName = "World";
      this.client.send(message);
    },
    onFailure:function(message){
      console.log('Connection attemp');
    },
    onConnectionLost:function(responseObject){
      if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:"+responseObject.errorMessage);
      }
    },
    onMessageArrived:function(message){
      console.log("onMessageArrived:"+message.payloadString);
    }
  }
})
