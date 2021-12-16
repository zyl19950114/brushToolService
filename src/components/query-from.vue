<template>
  <div
    class="flex between brush-tool-card"
  >
    <slot></slot>
    <div class="btn-wrap">
      <Button
        :loading="loading"
        type="primary"
        shape="circle"
        class="btn"
        @click="handleClick('on-query')"
      >
        <Icon v-if="!loading" type="ios-search" color="#fff" />{{ searchText }}
        <!-- <Icon
          v-if="hasClear"
          v-show="isCloseShow"
          @click="handleClick('on-clear')"
          type="ios-search"
          color="#fff"
        />清除 -->
      </Button>
      <Button
        :loading="loading"
        type="error"
        shape="circle"
        class="btn clear-btn"
        @click="handleClick('on-clear')"
      >
        <Icon type="md-close" color="#fff" />清除
      </Button>
      <!-- <div
        v-if="hasClear"
        class="clear-btn"
        v-show="isCloseShow"
        @click="handleClick('on-clear')"
      >
        <Icon type="md-close" size="10" color="#" />清除
      </div> -->
      <!-- <div class="tc mt5 grey-text close" v-show="handleClick('on-clear')"><Icon type="md-close" size="10" color="#"/>清除</div> -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    searchText: {
      type: String,
      default: "查询",
    },
    hasClear: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isCloseShow: false,
    };
  },
  methods: {
    handleClick(type) {
      console.log(type);
      this.$emit(type, null, "query");
    },
  },
};
</script>

<style lang="scss" scoped>
.brush-tool-card {
  padding-top: 10px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgb(240, 240, 240);
}
.btn-wrap {
  margin-left: auto;
}
.clear-btn {
  margin-left: 8px;
}
</style>
