<template>
  <div id="app" >
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /*margin-top: 60px;*/
  width: 100%;
  height: 100%;
  position: absolute;
  top:0;
  bottom:0;
  left:0;
  right:0;
  background:#f6f7f9;
  /*border:1px solid red;*/
}
</style>
