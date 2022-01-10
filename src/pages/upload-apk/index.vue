<template>
  <div class="upload-terminal">
    <query-from @on-query="queryApkList(queryParamsData)" @on-clear="handleClear">
      <Form label-position="top" class="query-from" :model="queryParams" ref="queryForm">
        <Row :gutter="16">
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
          <Col span="4" class="col">
            <FormItem label="apk版本" prop="version">
              <Input v-model="queryParams.version" clearable />
            </FormItem>
          </Col>
        </Row>
      </Form>
    </query-from>
    <list-top
      pageShow
      btnText="上传apk"
      :total="total"
      @on-click="handleApk('add')"
      @on-page="handlePage"
      @on-page-size="handlePageSize"
    >
      <Button
        @click="handleDeleteApks"
        :disabled="selected.length === 0"
        style="margin-left: 10px"
        type="error"
        shape="circle"
      >
        <i class="mdi mdi-delete-outline" /> 批量删除
      </Button>
    </list-top>
    <Table
      @on-selection-change="onSelectionChange"
      height="620"
      :columns="columns"
      :data="data"
      stripe
    />
    <handle-apk @on-ok="queryApkList({})" :visible.sync="visible" :data="editApkParams" />
  </div>
</template>

<script>
import HandleApk from "./handle-apk.vue";
import ListTop from "../../components/list-top.vue";
import QueryFrom from "../../components/query-from.vue";
export default {
  components: {
    HandleApk,
    ListTop,
    QueryFrom,
  },
  data() {
    return {
      selected: [],
      editApkData: null,
      visible: false,
      pageParams: {
        page: 0,
        count: 10,
      },
      queryParams: {
        apk_name: "",
        apk_url: "",
        version: "",
      },
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center",
        },
        {
          title: "apk名称",
          key: "apk_name",
          sortable: true,
        },
        {
          title: "apk链接",
          key: "apk_url",
        },
        {
          title: "版本",
          key: "version",
          width: 140,
          sortable: true,
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
                    this.handleDelete(params.row.id); // 点击操作事件
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
    queryParamsData() {
      let params = {};
      for (const k in this.queryParams) {
        if (this.queryParams[k] && this.queryParams[k] !== "") {
          params[`${k}$`] = `%${this.queryParams[k]}%`;
        }
      }
      return params;
    },
    editApkParams() {
      return { ...this.editApkData };
    },
  },
  created() {
    this.queryApkList({});
    // this.init
  },
  methods: {
    async handleDeleteApks() {
      const ids = await this.selected.reduce((crr, next) => {
        crr.push(next.id);
        return crr;
      }, []);
      this.handleDelete(...ids);
    },
    onSelectionChange(value) {
      this.selected = value;
    },
    onCurrentChange(currentRow) {
      console.log(currentRow);
    },
    handleEdit(params) {
      this.editApkData = params;
      this.handleApk("edit");
    },
    handleDelete(...arg) {
      this.confirmDialog("确定删除该apk？", true, () => {
        this.$axios
          .post("/delete", {
            Apk: {
              "id{}": arg,
            },
          })
          .then((res) => {
            res.data.code == 500 && this.$Message.warning("该apk已被绑定，删除失败");
            res.data.code == 200 &&
              (this.queryApkList({}), this.$Message.success("删除成功"));
            this.$Modal.remove();
            this.selected = [];
          });
      });
    },
    handleApk(status) {
      this.editApkData = {
        params: {
          ...this.editApkData,
        },
        status,
      };
      this.visible = true;
    },
    handleClear() {
      this.pageParams.page = 0;
      this.$refs.queryForm.resetFields();
      this.queryApkList({});
    },
    handlePage(page) {
      this.pageParams.page = page - 1;
      this.queryApkList({});
    },
    handlePageSize(pageSize) {
      this.pageParams.count = pageSize;
      this.queryApkList({});
    },
    queryApkList(params) {
      this.$axios
        .post("/get", {
          "[]": {
            Apk: {
              ...params,
              "@order": "id-",
            },
            query: 2,
            ...this.pageParams,
          },
          "total@": "/[]/total",
        })
        .then((res) => {
          if (res.data.total === 0) {
            this.$Message.warning("暂无数据");
            return;
          }
          this.total = res.data.total;
          this.data = res.data["[]"].reduce((crr, next) => {
            crr.push(next.Apk);
            return crr;
          }, []);
        });
    },
  },
};
</script>
