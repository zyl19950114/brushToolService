<template>
  <div class="upload-terminal">
    <query-from @on-query="queryTerminalList" @on-clear="handleClear">
      <Form label-position="top" class="query-from" :model="queryParams" ref="queryForm">
        <Row :gutter="16">
          <Col span="4" class="col">
            <FormItem label="apk编号" prop="id">
              <Input v-model="queryParams.id" clearable />
            </FormItem>
          </Col>
          <Col span="4" class="col">
            <FormItem label="apk名称" prop="apk_name">
              <Input v-model="queryParams.apk_name" clearable />
            </FormItem>
          </Col>
          <Col span="4" class="col">
            <FormItem label="apk链接" prop="apk_name">
              <Input v-model="queryParams.apk_url" clearable />
            </FormItem>
          </Col>
        </Row>
      </Form>
    </query-from>
    <list-top btnText="导入终端" @on-click="handleTerminal('new')" />
    <Table :columns="columns" :data="data"></Table>
    <handle-terminal :visible.sync="visible" :data="editTerminalParams" />
  </div>
</template>

<script>
import HandleTerminal from "../import-terminal/handle-terminal.vue";
import ListTop from "../../components/list-top.vue";
import QueryFrom from "../../components/query-from.vue";
export default {
  components: {
    HandleTerminal,
    ListTop,
    QueryFrom,
  },
  data() {
    return {
      editTerminalData: null,
      visible: false,
      queryParams: {
        id: "",
        apk_name: "",
        apk_url: ""
      },
      columns: [
        {
          title: "编号",
          key: "id",
          width: 100,
        },
        {
          title: "apk名称",
          key: "apk_name",
        },
        {
          title: "apk链接",
          key: "apk_url",
          width: 200,
        },
        {
          title: "版本",
          key: "version",
        },
        {
          title: "上传时间",
          key: "create_time",
        },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
        },
      ],
      data: [],
    };
  },
  computed: {
    queryParamsData() {
      let params = {};
      for (const k in this.queryParams) {
        if (this.queryParams[k] && this.queryParams[k] !== "") {
          params[`${k}$`] = `%${this.queryParams[k]}%`;
        }
      }
      return params;
    },
    editTerminalParams() {
      return { ...this.editTerminalData };
    },
  },
  created() {
    this.queryTerminalList();
  },
  methods: {
    handleTerminal(status) {
      this.editTerminalData = {
        ...this.editTerminalData,
        status,
      };
      this.visible = true;
    },
    handleClear() {
      this.$refs.queryForm.resetFields();
      this.queryTerminalList();
    },
    queryTerminalList() {
      this.$axios
        .post("/get", {
          Terminal: {
            ...this.queryParamsData,
          },
        })
    },
  },
};
</script>
