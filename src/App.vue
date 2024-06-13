<template>
  <body>
    <Table v-if="visible == true" @child-event="handleChildEvent" />
    <Manage />
    <button type="primary" @click="haveChange">上传文件</button>
  </body>
</template>
<script>
import axios from "axios";
import Manage from "./components/Manage";
import Table from "./components/Table";
import lodding from "./components/lodding.vue";
export default {
  name: "App",
  components: {
    Manage,
    Table,
    lodding,
  },
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    haveChange: function () {
      this.visible = true;
      console.log("success to change");
    },
    handleChildEvent(message) {
      this.visible = message;
    },
  },
};
</script>

<style>
button {
  margin-top: 20px;
  position: absolute;
  right: 100px;
  color: white;
  border-radius: 5px;
  background-color: #0099ff;
  height: 30px;
  cursor: pointer;
}
body {
  background-color: #dafaf3;
}
</style>
