<template>
  <Modal
    :title="`${title}apk`"
    v-model="modal"
    :styles="{ top: '20px' }"
    @on-cancel="handleCancel"
  >
    <Form
      ref="uploadApk"
      :rules="rules"
      class="between"
      :model="formData"
      :label-width="80"
    >
      <Form-item label="apk名称" prop="apk_name">
        <Input v-model="formData.apk_name" placeholder="请输入apk名称"></Input>
      </Form-item>
      <Form-item label="版本号" prop="version">
        <Input v-model="formData.version" placeholder="请输入版本号"></Input>
      </Form-item>
      <Form-item label="上传apk" style="margin-bottom: 0">
        <Upload
          ref="upload"
          :before-upload="beforeUpload"
          accept=".apk"
          :format="['apk']"
          type="drag"
          :action="$webConfig.VUE_APP_FILEsSERVER_URL"
          :on-success="handleSuccess"
        >
          <div style="padding: 30px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>点击或将apk文件拖拽到这里上传</p>
          </div>
        </Upload>
      </Form-item>
    </Form>
    <div class="file-list" v-if="!uploading">
      {{ file && file.name }}
      <Button @click="handleDelete" type="text" class="file-list-btn">
        <i class="mdi mdi-close-circle"></i>
      </Button>
    </div>
    <div slot="footer">
      <Button
        type="primary"
        @click="handleUpload"
        :disabled="!file && formData.apk_url == ''"
        >提交</Button
      >
      <Button @click="handleCancel" style="margin-left: 8px">取消</Button>
    </div>
  </Modal>
</template>

<script>
export default {
  namd: "HandleApk",
  props: {
    data: {
      type: Object,
      default: () => {},
      required: true,
    },
    visible: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  data() {
    return {
      rules: {
        apk_name: [
          {
            required: true,
            message: "请输入文件名",
            trigger: "blur",
          },
        ],
        version: [
          {
            required: true,
            message: "请输入版本号",
            trigger: "blur",
          },
        ],
      },
      formData: {
        apk_name: "",
        apk_url: "",
        version: "",
      },
      file: null,
      uploading: false,
    };
  },
  computed: {
    title() {
      return this.data.status == "add" ? "上传" : "编辑";
    },
    modal: {
      get() {
        return this.visible;
      },
      set() {
        this.$emit("update:visible", !this.visible);
      },
    },
  },
  watch: {
    visible(bool) {
      bool && this.initializeParams();
    },
  },
  methods: {
    handleDelete() {
      this.formData.apk_name = "";
      this.file = null;
    },
    queryApkList(params) {
      return new Promise((resovle, reject) => {
        this.$axios
          .post("/get", {
            "[]": {
              Apk: {
                ...params,
              },
            },
          })
          .then((res) => {
            if (res.data["[]"]) {
              resovle(true);
            } else {
              resovle(false);
            }
          });
      });
    },
    handleCancel() {
      this.$emit("update:visible", false);
    },
    queryParamsData() {
      let params = {};
      for (const k in this.formData) {
        if (this.formData[k] && this.formData[k] !== "") {
          params[k] = this.formData[k];
        }
      }
      return params;
    },
    handleSuccess(response, file, fileList) {
      const request = this.data.status == "add" ? "/post" : "/put";
      this.$axios
        .post(request, {
          Apk: {
            ...this.formData,
            apk_url: file && file.response.desc,
            id: this.data.params.id,
          },
        })
        .then((res) => {
          this.$Message.success("上传成功");
          this.$emit("on-ok");
          this.handleCancel();
        });
    },
    handleUpload() {
      this.$refs.uploadApk.validate((valid) => {
        if (valid) {
          this.queryApkList(this.queryParamsData()).then((res) => {
            if (res && this.data.status == "add") {
              this.$Message.warning("已存在相同的apk数据");
              return;
            }
            if (this.data.status == "edit" && !this.file) {
              this.handleSuccess();
              return;
            }
            this.uploading = true;

            // 【TEST】
            // ftp.put(this.file, "~/file.apk", (res) => {
            //   console.log(res)
            //   if (!res) {
            //     console.log("File transferred successfully!");
            //   }
            // });

            const newFile = new File(
              [this.file],
              `${this.file.name.split(".")[0]}_${new Date().getTime()}.apk`
            );
            this.$refs.upload.post(newFile);
          });
        }
      });
    },
    handleReset() {
      console.log("重置表单", this.$refs.uploadApk);
      this.$refs.uploadApk.resetFields();
      this.$refs.upload.clearFiles();
      this.formData.apk_url = "";
      this.uploading = false;
      this.file = null;
    },
    beforeUpload(file) {
      const fileType = file.name
        .split(".")[file.name.split(".").length - 1].toLowerCase();
      if (fileType !== "apk") {
        this.$Message.warning("仅支持上传apk文件");
        return false;
      }
      if (this.file) {
        this.$Message.warning("已存在文件");
        return false;
      }

      this.file = file;
      console.log(this.file);
      return false;
    },
    initializeParams() {
      this.handleReset();
      if (this.data.status === "edit") {
        const { apk_name, apk_url, version } = this.data.params;
        this.formData = { apk_name, apk_url, version };
      }
    },
  },
};
</script>

<style lang="scss">
.file-list {
  padding-left: 80px;
  display: flex;
  align-items: center;
  width: 100%;
  height: 20px;
  &:hover .file-list-btn {
    display: block;
  }
  .file-list-btn {
    transition: 0.3s all;
    margin-left: auto;
    display: none;
  }
  .ivu-btn {
    padding: 0;
  }
  i {
    color: #ff3300;
    font-size: 14px;
  }
}
</style>
