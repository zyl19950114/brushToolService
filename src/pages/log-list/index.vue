<template>
  <div class="upload-terminal">
    <!-- <query-from @on-query="queryLogList(queryParamsData)" @on-clear="handleClear">
      <Form label-position="top" class="query-from" :model="queryParams" ref="queryForm">
        <Row :gutter="16">
          <Col span="4" class="col">
            <FormItem label="操作时间" prop="operate_time">
              <Date-picker
                v-model="queryParams.operate_time"
                format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
                style="width: 200px"
              ></Date-picker>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </query-from> -->
    <list-top pageShow :btnShow="false" :total="total" @on-page="handlePage" />
    <Table :context="self" :columns="columns" :data="data" stripe></Table>
  </div>
</template>

<script>
import QueryFrom from "../../components/query-from.vue";
import ListTop from "../../components/list-top.vue";
export default {
  components: {
    ListTop,
    // QueryFrom,
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
        operate_time: ''
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
          title: "操作时间",
          key: "operate_time",
        },
        {
          title: "旧程序版本",
          key: "old_version",
        },
        {
          title: "新程序版本",
          key: "new_version",
        }
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
  },
  created() {
    this.queryLogList({});
  },
  methods: {
    handleEdit(params) {
      this.editLogData = params;
      this.handleLog("edit");
    },
    handlePage(page) {
      this.pageParams.page = page - 1;
      this.queryLogList({});
    },
    handleClear() {
      this.pageParams.page = 0;
      this.$refs.queryForm.resetFields();
      this.queryLogList({});
    },
    queryLogList(params) {
      console.log(params);
      this.$axios
        .post("/get", {
          "[]": {
            Log: {
              ...params,
            },
            query: 2,
            ...this.pageParams,
          },
          "total@": "/[]/total",
        })
        .then((res) => {
          this.total = res.data.total;
          console.log(res);
          this.data = res.data["[]"].reduce((crr, next) => {
            crr.push(next.Log);
            return crr;
          }, []);
        });
    },
  },
};
</script>