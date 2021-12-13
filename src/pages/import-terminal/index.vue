<template>
  <div class="upload-terminal">
    <query-from @on-query="queryTerminalList(queryParamsData)" @on-clear="handleClear">
      <Form label-position="top" class="query-from" :model="queryParams" ref="queryForm">
        <Row :gutter="16">
          <Col span="4" class="col">
            <FormItem label="终端编号" prop="id">
              <Input v-model="queryParams.id" clearable />
            </FormItem>
          </Col>
          <Col span="4" class="col">
            <FormItem label="终端imei" prop="imei">
              <Input v-model="queryParams.imei" clearable />
            </FormItem>
          </Col>
        </Row>
      </Form>
    </query-from>
    <list-top
      pageShow
      btnText="导入终端"
      :total="total"
      @on-click="handleTerminal('add')"
      @on-page="handlePage"
    >
      <Button
        class="bulk-import-btn"
        type="primary"
        shape="circle"
        @click="excelVisible = true"
        >批量导入</Button
      >
    </list-top>

    <Table :context="self" :columns="columns" :data="data" stripe></Table>
    <handle-terminal
      @on-ok="queryTerminalList({})"
      :visible.sync="terminalVisible"
      :data="editTerminalParams"
    />
    <import-excel @on-ok="queryTerminalList({})" :visible.sync="excelVisible" />
  </div>
</template>

<script>
import HandleTerminal from "./handle-terminal.vue";
import ListTop from "../../components/list-top.vue";
import QueryFrom from "../../components/query-from.vue";
import ImportExcel from "../../components/import-excel.vue";

export default {
  components: {
    HandleTerminal,
    ImportExcel,
    ListTop,
    QueryFrom,
  },
  data() {
    return {
      self: this,
      editTerminalData: null,
      terminalVisible: false,
      excelVisible: false,
      pageParams: {
        page: 0,
        count: 10,
      },
      queryParams: {
        id: "",
        imei: "",
      },
      columns: [
        {
          title: "编号",
          key: "id",
          width: 100,
        },
        {
          title: "终端imei",
          key: "imei",
        },
        {
          title: "状态",
          key: "apk_id",
          render: (h, params) => {
            const binded = params.row.apk_id ? true : false;
            return this.status(h, binded);
          },
        },
        {
          title: "备注",
          key: "remark",
        },
        {
          title: "操作",
          key: "action",
          fixed: "right",
          width: 160,
          render: (h, params) => {
            return h("div", [
              h("span", {
                class: "mdi mdi-pencil-outline",
                style: {
                  fontSize: "12px",
                  color: "#559DF9",
                  cursor: "pointer",
                },
                domProps: {
                  innerHTML: "编辑",
                },
                on: {
                  click: () => {
                    this.handleEdit(params.row); // 点击操作事件
                  },
                },
              }),
              h("span", {
                class: "mdi mdi-delete-outline",
                style: {
                  fontSize: "12px",
                  color: "#ff3300",
                  cursor: "pointer",
                  marginLeft: "12px",
                },
                domProps: {
                  innerHTML: "删除",
                },
                on: {
                  click: () => {
                    this.handleDelete(params.row); // 点击操作事件
                  },
                },
              }),
            ]);
          },
        },
      ],
      data: [],
      total: 0,
    };
  },
  computed: {
    status() {
      return function (h, status) {
        console.log(h, status);
        const style = {
          fontSize: "12px",
          color: "#fff",
          padding: "3px 6px",
          display: "inline-block",
          borderRadius: "4px",
          background: status ? "#3399ff" : "#9ea7b4",
          cursor: "pointer",
        };
        const domProps = {
          innerHTML: status ? "已绑定" : "未绑定",
        };
        return h("span", {
          style,
          domProps,
        });
      };
    },
    queryParamsData() {
      let params = {};
      for (const k in this.queryParams) {
        if (this.queryParams[k] && this.queryParams[k] !== "") {
          params[k] = this.queryParams[k];
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
    // this.init
  },
  methods: {
    handleEdit(params) {
      this.editTerminalData = params;
      this.handleTerminal("edit");
    },
    handleDelete(params) {
      this.confirmDialog("确定删除该终端？", true, () => {
        this.$axios
          .post("/delete", {
            Terminal: {
              id: params.id,
            },
          })
          .then((res) => {
            this.$Modal.remove();
            this.queryTerminalList({});
          });
      });
    },
    handleTerminal(status) {
      this.editTerminalData = {
        params: {
          ...this.editTerminalData,
        },
        status,
      };
      this.terminalVisible = true;
    },
    handleClear() {
      this.pageParams.page = 0;
      this.$refs.queryForm.resetFields();
      this.queryTerminalList();
    },
    handlePage(page) {
      this.pageParams.page = page - 1;
      this.queryTerminalList({});
    },
    queryTerminalList(params) {
      this.$axios
        .post("/get", {
          "[]": {
            Terminal: {
              ...params,
            },
            query: 2,
            ...this.pageParams,
          },
          "total@": "/[]/total",
        })
        .then((res) => {
          this.total = res.data.total;
          this.data = res.data["[]"].reduce((crr, next) => {
            crr.push(next.Terminal);
            return crr;
          }, []);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.bulk-import-btn {
  margin-left: 10px;
}
</style>
