<template>
  <div class="upload-terminal">
    <list-top
      pageShow
      :btnShow="false"
      :total="total"
      @on-page="handlePage"
    />
    <Table :context="self" :columns="columns" :data="data" stripe></Table>
  </div>
</template>

<script>
import ListTop from "../../components/list-top.vue";
export default {
  components: {
    ListTop,
  },
  data() {
    return {
      self: this,
      editTerminalData: null,
      visible: false,
      pageParams: {
        page: 0,
        count: 10,
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
  created() {
    this.queryTerminalList();
  },
  methods: {
    handleEdit(params) {
      this.editTerminalData = params;
      this.handleTerminal("edit");
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

<style lang="scss" scoped></style>
