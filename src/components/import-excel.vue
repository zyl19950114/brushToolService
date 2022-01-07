<template>
  <Modal
    title="批量上传"
    v-model="modal"
    :styles="{ top: '20px' }"
    @on-cancel="handleCancel"
  >
    <Upload
      ref="upload"
      :before-upload="beforeUpload"
      :format="['xls', 'xlsx']"
      type="drag"
      action=""
    >
      <div style="padding: 30px 0">
        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
        <p>点击或将EXCEL文件拖拽到这里上传</p>
      </div>
    </Upload>
  </Modal>
</template>

<script>
import XLSX from "xlsx";

export default {
  name: "import-excel",
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  data() {
    return {
      file: null,
    };
  },
  computed: {
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
    file: {
      handler() {
        this.exportData();
      },
      deep: true,
    },
  },
  methods: {
    handleCancel() {
      this.$emit("update:visible", false);
    },
    exportData() {
      if (!this.file) {
        return;
      }
      const that = this;
      // 拿取文件对象
      var f = this.file;
      // 用FileReader来读取
      var reader = new FileReader();
      // 重写FileReader上的readAsBinaryString方法
      FileReader.prototype.readAsBinaryString = function (f) {
        var binary = "";
        var wb; // 读取完成的数据
        var outdata; // 你需要的数据
        var reader = new FileReader();
        reader.onload = function (e) {
          // 读取成Uint8Array，再转换为Unicode编码（Unicode占两个字节）
          var bytes = new Uint8Array(reader.result);
          var length = bytes.byteLength;
          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          wb = XLSX.read(binary, {
            type: "binary",
          });
          outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
          // 自定义方法向父组件传递数据
          that.handleImport(outdata);
        };
        reader.readAsArrayBuffer(f);
      };
      reader.readAsBinaryString(f);
    },
    beforeUpload(file) {
      const fileType = file.name
        .split(".")[file.name.split(".").length - 1].toLowerCase();
      if (fileType.indexOf("xls") == -1) {
        this.$Message.warning("仅支持上传excel文件");
        return false;
      }
      if (this.file) {
        this.$Message.warning("已存在文件");
        return false;
      }

      this.file = file;
      // this.formData.apk_name = this.file.name.split(".")[0];
      return false;
    },
    handleImport(list) {
      this.$axios
        .post("/post", {
          "Terminal[]": list,
        })
        .then((res) => {
          this.$emit("on-ok");
          this.$Message.success("导入成功");
          this.handleCancel();
          return;
        });
    },
  },
};
</script>

<style></style>
