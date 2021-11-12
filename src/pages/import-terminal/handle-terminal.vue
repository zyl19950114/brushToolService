<template>
  <Modal :title="`${title}终端`" v-model="modal" :styles="{ top: '20px' }">
    <Form
      :rules="rules"
      ref="HandleTerminal"
      class="between"
      :model="formData"
      :label-width="80"
      @on-cancel="handleReset"
    >
      <Form-item label="终端imei" prop="imei">
        <Input v-model="formData.imei" placeholder="请输入imei"></Input>
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
      <Button type="primary" @click="handleOk('HandleTerminal')">提交</Button>
      <Button @click="handleCancel" style="margin-left: 8px">取消</Button>
    </div>
  </Modal>
</template>

<script>
import { formatDateTime } from "../../utils/base";

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
      },
      formData: {
        imei: "",
        remark: "",
      },
    };
  },
  computed: {
    title() {
      return this.data.status == "new" ? "导入" : "编辑";
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
    handleOk() {
      this.$refs.HandleTerminal.validate((valid) => {
        if (valid) {
          const request = this.data.status == "add" ? "/post" : "/put";
          this.$axios
            .post(request, {
              Terminal: {
                ...this.formData,
                create_time: formatDateTime(new Date()),
                id: this.data.params.id
              },
            })
            .then((res) => {
              console.log(res);
              if (res.status === 200) this.$emit("on-ok", res);
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
      if (this.data.status === "edit") {
        const { imei, remark } = this.data.params;
        console.log({ imei, remark });
        this.formData = { imei, remark };
      }
    },
  },
};
</script>
