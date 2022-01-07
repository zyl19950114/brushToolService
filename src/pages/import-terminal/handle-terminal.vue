<template>
  <Modal :title="`${title}终端`" v-model="modal" :styles="{ top: '60px' }">
    <Form
      :rules="rules"
      ref="HandleTerminal"
      class="between"
      :model="formData"
      :label-width="80"
      @on-cancel="handleReset"
    >
      <Form-item label="终端IMEI" prop="imei">
        <Input type="number" v-model="formData.imei" placeholder="请输入IMEI"></Input>
      </Form-item>
      <Form-item label="绑定apk" prop="apk_id">
        <Select v-model="formData.apk_id" filterable>
          <Option v-for="item in apkList" :value="item.id" :key="item.id">
            {{ item.apk_name }} <span>版本：{{ item.version }}</span>
          </Option>
        </Select>
      </Form-item>
      <Form-item label="备注" prop="remark">
        <Input
          type="textarea"
          :rows="4"
          v-model="formData.remark"
          placeholder="请输入备注"
        ></Input>
      </Form-item>
    </Form>
    <div slot="footer">
      <Button type="primary" @click="handleOk()">提交</Button>
      <Button @click="handleCancel" style="margin-left: 8px">取消</Button>
    </div>
  </Modal>
</template>

<script>
export default {
  name: "HandleTerminal",
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
        imei: [
          {
            required: true,
            message: "imei不能为空",
            trigger: "blur",
          },
          { min: 15, max: 15, message: "imei码应为15位", trigger: "blur" },
        ],
        remark: [
          {
            required: false,
          },
        ],
        apk_id: [
          {
            required: true,
            message: "请绑定apk",
          },
        ],
      },
      apkList: [],
      formData: {
        imei: "",
        remark: "",
        apk_id: "",
      },
    };
  },
  computed: {
    user() {
      return JSON.parse(sessionStorage.getItem("userData")).username;
    },
    formatFormData() {
      let data = {};
      for (const k in this.formData) {
        if (this.formData[k] && this.formData[k] !== "") {
          data[k] = this.formData[k];
        }
      }
      return data;
    },
    title() {
      return this.data.status == "add" ? "导入" : "编辑";
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
    queryApkList() {
      this.$axios
        .post("/get", {
          "[]": {
            Apk: {},
          },
        })
        .then((res) => {
          this.total = res.data.total;
          this.apkList = res.data["[]"].reduce((crr, next) => {
            crr.push(next.Apk);
            return crr;
          }, []);
          console.log("apkList", this.apkList);
        });
    },
    handleOk() {
      this.$refs.HandleTerminal.validate((valid) => {
        if (valid) {
          const request = this.data.status == "add" ? "/post" : "/put";
          this.$axios
            .post(request, {
              Terminal: {
                ...this.formatFormData,
                // username: this.user,
                id: this.data.params.id,
              },
            })
            .then((res) => {
              if (res.status === 200) this.$emit("on-ok", res);
              this.$Message.success("导入成功");
              this.handleCancel();
            });
        }
      });
    },
    handleCancel() {
      this.$emit("update:visible", false);
    },
    handleReset() {
      console.log("重置表单");
      this.$refs.HandleTerminal.resetFields();
    },
    initializeParams() {
      this.handleReset();
      this.queryApkList();
      if (this.data.status === "edit") {
        const { imei, remark, apk_id } = this.data.params;
        this.formData = { imei, remark, apk_id };
      }
    },
  },
};
</script>
<style lang="scss">
.ivu-select-item {
  width: 100%;
  display: flex;
  justify-content: space-between;
  & span {
    color: #999;
    font-size: 12px;
    min-width: 80px;
  }
}
</style>
