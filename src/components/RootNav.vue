<template>
  <div class="layout" :class="{ 'layout-hide-text': spanLeft < 3 }">
    <Row type="flex">
      <i-col :span="spanLeft" class="layout-menu-left">
        <root-nav-list :routesList="routesList" :navShow="navShow" />
      </i-col>
      <i-col :span="spanRight">
        <div class="layout-header">
          <i-button type="text" @click="toggleClick">
            <Icon
              :class="['menu-icon', { 'menu-icon-hide': spanLeft === 1 }]"
              type="md-menu"
              size="32"
            ></Icon>
          </i-button>
        </div>
        <div class="layout-breadcrumb">
          <Breadcrumb>
            <Breadcrumb-item href="/">首页</Breadcrumb-item>
            <Breadcrumb-item :href="$route.path">{{
              $route.meta.navName
            }}</Breadcrumb-item>
          </Breadcrumb>
        </div>
        <div class="layout-content">
          <div class="layout-content-main">
            <slot />
          </div>
        </div>
      </i-col>
    </Row>
  </div>
</template>
<script>
import RootNavList from "./RootNavList";
export default {
  name: "RootNav",
  components: {
    RootNavList,
  },
  data() {
    return {
      spanLeft: 3,
      spanRight: 21,
    };
  },
  computed: {
    navShow() {
      let bool = true;
      if (this.spanLeft < 3) {
        bool = false;
      }
      return bool;
    },
    routesList() {
      const routers = this.$router.options.routes;
      return this.filtterRoutes(routers);
    },
  },

  methods: {
    filtterRoutes(routes, path = "") {
      let result = [];
      for (let index in routes) {
        // 排除404，排除没有meta的路由，排除navState不为true的路由
        if (
          routes[index].name !== "NotFound" &&
          routes[index].meta &&
          "navState" in routes[index].meta &&
          routes[index].meta.navState === true
        ) {
          // 重新子路由的path
          routes[index].path = path + routes[index].path;
          // 出现children就递归
          if ("children" in routes[index] && routes[index].children.length > 0) {
            // 开始递归，并传入父级的path进行下一轮拼接
            const children = this.filtterRoutes(
              routes[index].children,
              routes[index].path + "/"
            );
            // 结构路由参数
            const currentRoutes = { ...routes[index] };
            // 重整children数据，将递归回来有用的子级数据替换掉原数据
            currentRoutes.children = children;
            result.push(currentRoutes);
          } else {
            // 没有子级路由的就直接push进队列
            result.push(routes[index]);
          }
        }
      }
      return result;
    },
    toggleClick() {
      if (this.spanLeft === 3) {
        this.spanLeft = 1;
        this.spanRight = 23;
      } else {
        this.spanLeft = 3;
        this.spanRight = 21;
      }
    },
  },
};
</script>
<style scoped lang="scss">
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  height: 100%;
}
.ivu-row-flex {
  height: 100%;
}
.layout-breadcrumb {
  padding: 10px 15px 0;
}
.layout-content {
  flex: 1;
  margin: 15px;
  overflow: hidden;
  background: #fff;
  border-radius: 4px;
}
.layout-content-main {
  padding: 10px;
}
.layout-copy {
  text-align: center;
  padding: 10px 0 20px;
  color: #9ea7b4;
}
.layout-menu-left {
  background: #464c5b;
}
.layout-header {
  height: 60px;
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

.ivu-col {
  transition: width 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
}
.menu-icon {
  transition: 0.2s all;
  font-size: 28px !important;
}
.menu-icon-hide {
  transform: rotate(90deg);
}
</style>
