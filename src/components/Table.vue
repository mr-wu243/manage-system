<template>
  <div id="container">
    <span class="span1">上传文件</span
    ><img
      src="./../assets/错误 (1).png"
      class="quit"
      @click="sendDataToParent"
    />
    <form @submit.prevent="onSubmit">
      <div
        ref="dropZone"
        class="drop-zone"
        @dragover.prevent
        @drop.prevent="onDrop"
      >
        <img
          src="./../assets/上传.png"
          alt=""
          v-show="visible1"
          class="img2"
        /><a v-show="visible1">点击或者拖拽上传文件</a>
        <label for="file-upload" class="ipt" id="ipt" v-show="visible1"
          >支持文件格式md、txt、pdf、jpg、png、jpeg、docx、xlsx、pptx、eml、csv、单个文档小于30M,单张图片小于5M</label
        >
        <div v-show="!visible1" class="uploaded">
          <img src="./../assets/上传.png" alt="" /><label for="file-upload"
            >点击或者拖拽上传文件</label
          >
        </div>
        <div class="content">
          <ul>
            <li
              v-for="(item1, index1) in nameSpace"
              :key="index1"
              class="boxes"
            >
              <span class="span2">{{ item1 }}</span>
              <img
                src="./../assets/正确.png"
                class="img1"
                v-show="isload[index1]"
              />
              <span v-show="isload[index1]">上传成功</span>
              <lodding v-show="!isload[index1]" class="img1" /><span
                v-show="!isload[index1]"
                >正在上传</span
              >
            </li>
          </ul>
        </div>

        <input
          type="file"
          v-once
          multiple
          @change="handleFilesChange"
          id="file-upload"
          accept=".md,.txt,.pdf,.jpg,.png,.jpeg,.docx,.xlsx,.pptx,.eml,.csv"
        />
      </div>
      <button type="submit" class="btn" @click="sendDataToParent">确定</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import { ElMessage } from "element-plus";
import { toRaw } from "vue";
import lodding from "./lodding.vue";
export default {
  components: { lodding },
  data() {
    return {
      files: [],
      visible1: Boolean,
      nameSpace: [],
      kb_id: [],
      user_id: "zufe",
      id: "",
      isload: [Boolean],
      count: 0,
      i: 0,
    };
  },
  mounted() {
    this.getKbId();
  },
  methods: {
    onDrop(e) {
      e.preventDefault();
      this.visible1 = false;
      console.log(e);
      const files = e.dataTransfer.files;
      this.uploadFiles(files);
    },
    handleFilesChange(event) {
      var _this = this;
      this.visible1 = false;
      this.files = Array.from(event.target.files);
      for (let i = 0; i < this.files.length; i++) {
        this.nameSpace.push(toRaw(this.files[i]).name);
        this.isload[this.count++] = false;
      }
      console.log(this.nameSpace);
      const formData = new FormData();
      this.files.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("user_id", this.user_id);
      formData.append("kb_id", toRaw(this.kb_id[0]));
      formData.append("mode", "soft");
      formData.append("use_local_file", false);
      axios
        .post(
          "http://172.16.151.157:8777/api/local_doc_qa/upload_files",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        )
        .then((response) => {
          if (response.data.code == 200) {
            console.log(response.data);
            if (response.data.msg[0] == "w") {
              for (let j = 0; j < response.data.data.length + 1; j++) {
                _this.isload[_this.i++] = true;
              }
            } else {
              for (let j = 0; j < response.data.data.length; j++) {
                _this.isload[_this.i++] = true;
              }
            }

            console.log("File uploaded successfully.");
            ElMessage({
              type: "success",
              message: "上传成功",
            });
            console.log(response.data);
          } else ElMessage.error("上传失败");
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
      this.visible = true;
    },
    async uploadFiles(files) {
      var _this = this;
      this.visible1 = false;
      for (const file of files) {
        try {
          this.isload[this.count++] = false;
          this.nameSpace.push(file.name);
          const formData = new FormData();
          formData.append("files", file);
          formData.append("user_id", this.user_id);
          formData.append("kb_id", toRaw(this.kb_id[0]));
          formData.append("mode", "soft");
          formData.append("use_local_file", false);

          const response = await axios.post(
            "http://172.16.151.157:8777/api/local_doc_qa/upload_files",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          if (response.data.code === 200) {
            console.log(response.data);
            if (response.data.msg[0] == "s" || response.data.msg[0] =="w") _this.isload[_this.i++] = true;
            ElMessage({
              type: "success",
              message: "上传成功",
            });
          } else {
            ElMessage.error("上传失败");
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
    sendDataToParent() {
      if (this.count != 0) {
        location.reload();
      }
      console.log("quit");
      this.$emit("child-event", false);
    },
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
        }
      });
    },
  },
};
</script>

<style scoped>
#container {
  background-color: rgb(248, 246, 231);
  position: fixed;
  left: 50%;
  top: 50%;
  margin-left: -250px;
  margin-top: -200px;
  width: 500px;
  height: 400px;
  border-radius: 10px;
}
.btn {
  color: white;
  position: absolute;
  right: 10px;
  bottom: 10px;
  border-radius: 5px;
  background-color: #0099ff;
  height: 30px;
}
input[type="file"] {
  width: 1px;
  height: 1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}
.ipt {
  margin-left: 5px;
  font-size: 10px;
  word-wrap: break-word;
  color: gray;
  line-height: 20px;
}
label {
  cursor: pointer;
}
img {
  width: 25px;
  height: 25px;
}
.drop-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: center;
  margin-left: 25px;
  margin-top: 10px;
  background-color: rgb(252, 247, 251);
  width: 450px;
  height: 300px;
  border-radius: 10px;
  cursor: pointer;
}
.drop-zone p {
  line-height: 2;
}
.drop-zone:hover {
  border-color: #0099ff;
  background-color: rgba(0, 153, 255, 0.1);
}
.span1 {
  margin-left: 10px;
  margin-top: 10px;
  font-size: 25px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.quit {
  float: right;
  margin-right: 10px;
  margin-top: 10px;
  cursor: pointer;
  max-width: 300px;
}
.uploaded {
  width: 450px;
  position: absolute;
  top: 60px;
  border-bottom: rgb(220, 220, 220) solid;
  line-height: 30px;
}
.content {
  overflow: auto;
  height: 275px;
  margin-top: 50px;
}
.boxes {
  width: 450px;
  display: flex;
  border-bottom: solid;
  border: 1px;
  margin-bottom: 10px;
}
.span2 {
  float: left;
  width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.img1 {
  margin-left: 80px;
}
ul {
  margin-block-start: 10px;
}
.content::-webkit-scrollbar {
  display: none;
}
.img2 {
  margin-top: 100px;
}
</style>
