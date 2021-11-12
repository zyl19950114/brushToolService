<template>
  <div class="flex between align-center" style="height: 32px; padding: 30px 0">
    <div class="left">
      <Button
        v-if="btnShow"
        type="primary"
        :icon="btnIcon"
        shape="circle"
        :class="{ btn: !btnDisable }"
        :disabled="btnDisable"
        :loading="loading"
        @click="handleClick"
        >{{ btnText }}</Button
      >
      <slot></slot>
    </div>
    <div class="right flex align-center">
      <Page
        v-if="pageShow"
        :current="current"
        :total="total"
        show-total
        show-sizer
        :page-size="10"
        size="small"
        :page-size-opts="pageNumList"
        @on-change="handleChange"
        @on-page-size-change="handlePageSizeChange"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    btnText: String,
    btnShow: {
      type: Boolean,
      default: true,
    },
    sortShow: {
      type: Boolean,
      default: true,
    },
    pageShow: {
      type: Boolean,
      default: false,
    },
    total: {
      type: Number,
      default: 0,
    },
    btnDisable: {
      type: Boolean,
      default: false,
    },
    btnIcon: {
      type: String,
      default: "md-add",
    },
    loading: {
      type: Boolean,
      default: false,
    },
    current: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      pageNumList: [10, 50, 100, 200, 500, 1000],
      pageName: "10条",
    };
  },
  methods: {
    handleClick() {
      this.$emit("on-click");
    },
    handleChange(page) {
      this.$emit("on-page", page);
    },
    handlePageSizeChange(name) {
      this.$emit("on-page-size", name);
    },
  },
};
</script>
