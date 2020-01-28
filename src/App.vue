<template>
<div id="app">
    <mqttcon 
    :hostname="'192.241.209.137'" 
    :showConn="true" 
    :autoConnect="true" ></mqttcon>
</div>
</template>

<script>
import Mqttcon from './components/mqttcon'
export default {
    name:"app",
    components:{
        Mqttcon
    }
}
</script>

