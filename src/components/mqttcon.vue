<template>
    <div id="app" class="vertical-center">
      <div class="container">
        <div>
          <h1>MQTT Web Client</h1>
        </div>
        <div class="row">
          <div class="col-md-8">
            <div class="panel panel-default">
              <div class="panel-heading">Server</div>
              <div class="panel-body">
                <div class="row" v-if="showConn">
                  <div class="form-inline">
                    <select class="form-control" name="" id="">
                      <option value="">ws</option>
                    </select>
                    <input v-model="hostname" class="form-control" type="text" placeholder="hostname or server ip">
                    <input v-model="port" class="form-control" type="text" placeholder="port">
                    <button class="btn btn-default" v-on:click="connect">Connect</button>
                    <button class="btn btn-danger" v-on:click="disconnect">Disconnect</button>
                  </div>
                </div>
                <br>
                <div v-if="isConnected">
                  <div class="row">
                    <div class="form-inline">
                      <input class="form-control" type="text" placeholder="topic" v-model="subs_topic">
                      <button class="btn btn-primary" v-on:click="subscribe">Subscribe</button>
                    </div>
                  </div>
                  <br>
                  <div class="row">
                    <div class="form-inline">
                      <input class="form-control" type="text" placeholder="topic" v-model="pub_topic">
                      <input class="form-control" type="text" placeholder="message" v-model="pub_message">
                      <button class="btn btn-success" v-on:click="publish">Publish</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="panel panel-default">
              <div class="panel-heading">
                <h3 class="panel-title">Messages</h3>
              </div>
              <div class="panel-body">
                <div v-for="(message, index) in messages" style="border-top:1px solid #ddd;margin-top:5px">
                  <span class="label label-default">{{message.topic}}</span> {{message.message}}
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="panel panel-default">
              <div class="panel-heading">Subcriptions</div>
              <div class="panel-body">
                <table class="table table-striped">
                  <thead><th>Topic</th><th>Action</th></thead>
                  <tr v-for="(subcription, index) in topic_subcriptions">
                    <td>{{subcription}}</td>
                    <td><button class="btn btn-danger btn-xs" v-on:click="unsubscribe($event,subcription)">Unsubscribe</button></td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
//https://medium.com/techwomenc/crea-tu-primer-componente-single-file-con-vue-js-8802381311
export default {
  name: 'mqttcon',
  props: {
      hostname: {
          type:String,
          required :false,
          default:'192.241.209.137'
        },
      showConn: {
          type:Boolean,
          required :false,
          default: true
      },
      autoConnect: {
          type:Boolean,
          required :true,
          default: true
      },
      port: {
          type:Number,
          required :false,
          default: 8083
      },
      },
  data () {
    return {
        title:'MQTT 2',
        client:null,
        messages:[],
        isConnected:false,
        subs_topic:'',
        pub_topic:'',
        pub_message:'',
        topic_subcriptions:[],
    }
  },
    mounted(){
        if(this.autoConnect && this.hostname.length > 0 && this.port > 0 ){
            //this.disconnect();
            this.connect();
        }
    },
  methods:{
    disconnect:function(){
      console.log("client is disconnecting..");
      this.client.disconnect();
      this.isConnected = false;
    },
    connect:function(){
        //this.disconnect();
        this.client = new Paho.Client(this.hostname, Number(this.port),"clientId");
        // set callback handlers
        this.client.onConnectionLost = this.onConnectionLost;
        this.client.onMessageArrived = this.onMessageArrived;

        // connect the client
        try {
            this.client.connect({
                onSuccess:this.onConnect, 
                onFailure:this.onFailure,
                cleanSession:true,
                keepAliveInterval:1000,
                timeout:10,
                reconnect:true
            });
        } catch (error) {
            console.error("No se conecta");
            this.disconnect();
        }
    },
    publish:function(){
      console.log('publishing')
      var message = new Paho.Message(this.pub_message);
      message.destinationName = this.pub_topic;
      this.client.send(message);
      this.pub_message = '';
    },
    subscribe:function(){
        let exist = this.topic_subcriptions.indexOf(this.subs_topic);
        console.log('subscribing',exist);
        if (exist == -1 ){
            this.client.subscribe(this.subs_topic);
            this.topic_subcriptions.push(this.subs_topic);
        }
    },
    unsubscribe:function(event,topic){
        this.client.unsubscribe(topic);
        this.topic_subcriptions.splice( this.topic_subcriptions.indexOf(topic), 1 );
        console.log('unsubscribing',topic,this.topic_subcriptions);
    },
    onConnect:function(response){
        console.log("onConnect");
        this.isConnected = true;
    },
    onConnected:function(){
        console.log("onConnected");
        this.isConnected = true;
    },
    onFailure:function(message){
        console.log('Connection attemp');
    },
    onConnectionLost:function(responseObject){
      if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:"+responseObject.errorMessage);
      }
        this.isConnected = false;
    },
    onMessageArrived:function(message){
      console.log(message);
      console.log("onMessageArrived:"+message.payloadString);
      this.messages.push({message:message.payloadString,topic:message.destinationName});
    }
  }
}
</script>
<style>
      .vertical-center {
        min-height: 100%;  /* Fallback for browsers do NOT support vh unit */
        min-height: 100vh; /* These two lines are counted as one :-)       */

        display: flex;
        align-items: center;
      }
    </style>