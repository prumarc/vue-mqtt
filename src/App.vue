<template>
    <mqttcon :hostname="'192.241.209.137'" :showConn="false" :autoConnect="true" ></mqttcon>
</template>

<script>
import Mqttcon from './components/mqttcon'
export default {
    name:"all",
    components:{
        Mqttcon
    }

}
</script>
