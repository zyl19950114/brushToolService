<template>
  <Menu :active-name="$route.path" theme="dark" width="auto">
    <template v-for="item in routesList">
      <Menu-item
        :name="item.path"
        :to="item.path"
        v-if="!('children' in item)"
        :index="item.path"
        :key="item.path"
      >
        <Icon v-if="navShow" :type="item.meta.icon" :size="iconSize"></Icon>
        <Poptip v-else trigger="hover" :content="item.meta.navName" placement="right">
          <Icon :type="item.meta.icon" :size="iconSize"></Icon>
        </Poptip>
        <span v-show="navShow" class="layout-text">{{ item.meta.navName }}</span>
      </Menu-item>
      <Submenu v-if="'children' in item" :index="item.path" :key="item.path">
        <template #title>
          <Icon :type="item.meta.icon" :size="iconSize"></Icon>
          <span v-show="navShow" class="layout-text">{{ item.meta.navName }}</span>
        </template>
        <!-- 如有子路由，调用组件本身进行递归处理 -->
        <root-nav-list :routesList="item.children" />
      </Submenu>
    </template>
  </Menu>
</template>

<script>
export default {
  name: "RootNavList",
  props: {
    routesList: {
      type: Array,
      required: true,
    },
    navShow: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    iconSize() {
      return this.navShow ? 14 : 24;
    },
  },
};
</script>
<style lang="scss">
.layout-logo-left {
  border-radius: 3px;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  .kirisun-logo {
    flex: 1;
  }
  img {
    width: 90%;
    display: block;
  }
  p {
    margin-left: 15px;
    display: inline-block;
    white-space: nowrap;
    color: rgb(219, 219, 219);
  }
}
.layout-text {
  white-space: nowrap;
  overflow: hidden;
}
</style>
