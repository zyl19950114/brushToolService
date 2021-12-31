<template>
  <div class="upload-terminal">
    <query-from @on-query="queryLogList(queryParamsData)" @on-clear="handleClear">
      <Form label-position="top" class="query-from" :model="queryParams" ref="queryForm">
        <Row :gutter="16">
          <Col span="4" class="col">
            <FormItem label="终端IMEI" prop="imei">
              <Input v-model="queryParams.imei" clearable />
            </FormItem>
          </Col>
          <Col span="4" class="col">
            <FormItem label="操作人" prop="username">
              <Input v-model="queryParams.username" clearable />
            </FormItem>
          </Col>
          <Col span="4" class="col">
            <FormItem label="旧程序版本" prop="old_version">
              <Input v-model="queryParams.old_version" clearable />
            </FormItem>
          </Col>
          <Col span="4" class="col">
            <FormItem label="新程序版本" prop="new_version">
              <Input v-model="queryParams.new_version" clearable />
            </FormItem>
          </Col>
          <Col span="4" class="col">
            <FormItem label="操作时间" prop="operate_time">
              <Date-picker
                v-model="queryParams.operate_time"
                type="date"
                placeholder="选择日期"
                style="width: 100%"
              ></Date-picker>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </query-from>
    <list-top
      pageShow
      :btnShow="false"
      :total="total"
      @on-page="handlePage"
      @on-page-size="handlePageSize"
    >
      <Button class="bulk-import-btn" type="primary" shape="circle" @click="exportLog"
        >日志导出</Button
      >
    </list-top>
    <Table
      ref="logTable"
      height="620"
      :context="self"
      :columns="columns"
      :data="data"
      stripe
    ></Table>
  </div>
</template>

<script>
import ListTop from "../../components/list-top.vue";
import QueryFrom from "../../components/query-from.vue";
import { formatDateTime } from "../../utils/base";

export default {
  components: {
    ListTop,
    QueryFrom,
  },
  data() {
    return {
      self: this,
      editLogData: null,
      visible: false,
      pageParams: {
        page: 0,
        count: 10,
      },
      queryParams: {
        imei: "",
        username: "",
        old_version: "",
        new_version: "",
        operate_time: "",
      },
      columns: [
        {
          title: "操作人",
          key: "username",
          width: 240,
        },
        {
          title: "终端IMEI",
          key: "imei",
        },
        {
          title: "操作时间",
          key: "operate_time",
        },
        {
          title: "旧程序版本",
          key: "old_version",
          sortable: true,
        },
        {
          title: "新程序版本",
          key: "new_version",
          sortable: true,
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
          k == "operate_time"
            ? (params[`${k}$`] = `%${formatDateTime(this.queryParams[k])}%`)
            : (params[`${k}$`] = `%${this.queryParams[k]}%`);
        }
      }
      return params;
    },
  },
  created() {
    this.queryLogList({});
  },
  methods: {
    exportLog() {
      this.$refs.logTable.exportCsv({
        filename: "操作日志",
      });
    },
    handleClear() {
      this.pageParams.page = 0;
      this.$refs.queryForm.resetFields();
      this.queryLogList({});
    },
    handleEdit(params) {
      this.editLogData = params;
      this.handleLog("edit");
    },
    handlePage(page) {
      this.pageParams.page = page - 1;
      this.queryLogList({});
    },
    handlePageSize(pageSize) {
      this.pageParams.count = pageSize;
      this.queryLogList({});
    },
    queryLogList(params) {
      this.$axios
        .post("/get", {
          "[]": {
            Log: {
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
            crr.push(next.Log);
            return crr;
          }, []);
        });
    },
  },
};
</script>
