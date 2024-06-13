<template>
  <div id="app1">
    <table>
      <tr>
        <th
          v-for="(item, index) in tableHeader"
          :key="index"
          :class="{ 'left-rounded': index === 0, 'right-rounded': index === 5 }"
        >
          {{ item }}
        </th>
      </tr>
      <tr v-for="(item, index) in fileList" :key="index">
        <td :class="{ 'buttom-left': index == len - 1 }">
          {{ item.id }}
        </td>
        <td>{{ item.file_name }}</td>
        <td>
          <div v-if="item.status == 'red'" id="box">
            <img src="./../assets/错误.png" id="false" /><text>解析失败</text>
          </div>
          <div v-else id="box">
            <img src="./../assets/正确.png" id="right" />
            <text>解析成功</text>
          </div>
        </td>
        <td>{{ item.msg }}</td>
        <td>{{ item.timestamp }}</td>
        <td
          :class="{ 'buttom-right': index == fileList.length - 1 }"
          style="text-align: center"
        >
          <span @click="deleteFile(index)" style="cursor: pointer; color: red"
            >删除</span
          >
        </td>
      </tr>
    </table>
    <div class="nothing" v-if="fileList[0] == null"><span>暂无数据</span></div>
  </div>
</template>

<script>
import axios from "axios";
import { ElMessage } from "element-plus";
import { toRaw } from "vue";
export default {
  components: {},
  data() {
    return {
      tableHeader: [
        "文档ID",
        "文档名称",
        "文档状态",
        "备注",
        "创建日期",
        "操作",
      ],
      len: 0,
      fileList: [],
      kb_id: [],
      user_id: "zufe",
    };
  },
  mounted() {
    this.getKbId();
  },
  methods: {
    getKbId: function () {
      var _this = this;
      axios({
        method: "POST",
        url: "http://172.16.151.157:8777/api/local_doc_qa/list_knowledge_base",
        data: {
          user_id: _this.user_id,
        },
      }).then((res) => {
        if (res.data.code === 200) {
          for (let i = 0; i < res.data.data.length; i++) {
            _this.kb_id.push(res.data.data[i].kb_id);
          }
          console.log(_this.kb_id)
          _this.getList();
        }
      });
    },
    handleChildEvent(message) {
      this.visible = message;
    },
    deleteFile: function (index) {
      var _this = this;
      axios({
        method: "POST",
        url: "http://172.16.151.157:8777/api/local_doc_qa/delete_files",
        data: {
          user_id: _this.user_id,
          kb_id: toRaw(_this.kb_id[0]),
          file_ids: [_this.fileList[index].file_id],
        },
      }).then((res) => {
        if (res.data.code === 200) {
          ElMessage({
            type: "success",
            message: "删除成功",
          });
          _this.getList();
        } else {
          ElMessage.error("删除失败");
        }
      });
    },
    getList: function () {
      console.log("lodding");
      var _this = this;
      axios({
        method: "POST",
        url: "http://172.16.151.157:8777/api/local_doc_qa/list_files",
        data: {
          user_id: _this.user_id,
          kb_id: toRaw(_this.kb_id[0]),
        },
      }).then((res) => {
        console.log("success");
        if (res.data.code === 200) {
          _this.fileList = res.data.data.details;
          for (let i = 0; i < res.data.data.details.length; i++) {
            _this.fileList[i].timestamp =
              _this.fileList[i].timestamp.slice(0, 4) +
              "-" +
              _this.fileList[i].timestamp.slice(4, 6) +
              "-" +
              _this.fileList[i].timestamp.slice(6, 8) +
              " " +
              _this.fileList[i].timestamp.slice(8, 10) +
              ":" +
              _this.fileList[i].timestamp.slice(10, 12);
            if (_this.fileList[i].msg === "上传成功") {
              _this.fileList[i].msg = "";
            }
            _this.fileList[i].id = 10000 + i;
          }
          _this.len = _this.fileList.length;
        }
      });
    },
  },
};
</script>

<style>
.btn {
  width: 100px;
  float: right;
  margin-right: 7.5%;
}
#box {
  display: flex;
  font-size: 10px;
  align-items: center;
}
text {
  float: right;
}
#right {
  float: left;
  width: 30px;
  height: 30px;
  margin-left: 20%;
}
#false {
  float: left;
  width: 18px;
  height: 18px;
  margin-left: 24%;
  margin-right: 5px;
}
table {
  margin-right: auto;
  margin-left: auto;
  width: 90%;
  border-collapse: separate;
  border-radius: 20px;
  background-color: #f3f6fd;
}
th {
  height: 40px;
  min-width: 150px;
  border-radius: inherit;
  background-color: bisque;
}
td {
  text-align: center;
  border-radius: inherit;
  background-color: azure;
}
.right-rounded {
  border-top-right-radius: 20px;
}
.left-rounded {
  border-top-left-radius: 20px;
}
.buttom-left {
  border-bottom-left-radius: 20px;
}
.buttom-right {
  border-bottom-right-radius: 20px;
}
.nothing {
  align-items: center;
  text-align: center;
  background-color: azure;
  height: 50px;
  width: 90%;
  margin-right: auto;
  margin-left: auto;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  justify-content: center;
  line-height: 50px;
}
</style>
