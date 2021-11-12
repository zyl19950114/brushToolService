<template>
  <div class="upload-terminal">
    <query-from @on-query="queryApkList(queryParamsData)" @on-clear="handleClear">
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
            <FormItem label="apk连接" prop="apk_name">
              <Input v-model="queryParams.apk_url" clearable />
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
    />
    <Table
      :columns="columns"
      :data="data"
      stripe
    ></Table>
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
      editApkData: null,
      visible: false,
      pageParams: {
        page: 0,
        count: 10,
      },
      queryParams: {
        id: "",
        apk_name: "",
        apk_url: "",
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
        },
        {
          title: "版本",
          key: "version",
          width: 140,
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
    queryParamsData() {
      let params = {};
      for (const k in this.queryParams) {
        if (this.queryParams[k] && this.queryParams[k] !== "") {
          params[k] = this.queryParams[k];
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
    onCurrentChange(currentRow) {
      console.log(currentRow);
    },
    handleEdit(params) {
      this.editApkData = params;
      this.handleApk("edit");
    },
    handleDelete(params) {
      this.confirmDialog("确定删除该apk？", true, () => {
        this.$axios
          .post("/delete", {
            Apk: {
              id: params.id,
            },
          })
          .then((res) => {
            this.$Modal.remove();
            this.queryApkList({});
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
    queryApkList(params) {
      this.$axios
        .post("/get", {
          "[]": {
            Apk: {
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
            crr.push(next.Apk);
            return crr;
          }, []);
        });
    },
  },
};
</script>
