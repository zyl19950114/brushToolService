<template>
  <div class="layout" :class="{ 'layout-hide-text': spanLeft < 3 }">
    <div class="layout-header">
      <img class="kirisun-logo" src="@/assets/kirisun-logo.png" alt="" />
      <span class="kirisun-text">{{ $webConfig.VUE_APP_TITLE }}</span>
      <Icon
        @click="toggleClick"
        :class="['menu-icon', { 'menu-icon-hide': spanLeft === 1 }]"
        type="md-menu"
        size="32"
      ></Icon>
      <div class="layout-header__user">
        <div class="layout-header__user__avatar">
          <Icon type="ios-person" />
        </div>
        <span class="layout-header__user__user">{{ user }}</span>
        <Icon
          title="退出"
          @click="handleLogOut"
          class="layout-header__user__logOut"
          type="ios-log-out"
        />
      </div>
    </div>
    <Row type="flex">
      <i-col :span="spanLeft" class="layout-menu-left">
        <root-nav-list :routesList="routesList" :navShow="navShow" />
      </i-col>
      <i-col :span="spanRight">
        <div class="layout-content-main">
          <div class="layout-breadcrumb">
            <Breadcrumb>
              <Breadcrumb-item href="/">首页</Breadcrumb-item>
              <Breadcrumb-item :href="$route.path">{{
                $route.meta.navName
              }}</Breadcrumb-item>
            </Breadcrumb>
          </div>
          <slot />
        </div>
        <footer class="layout-footer">
          {{ $webConfig.VUE_APP_VISION }}
        </footer>
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
    user() {
      return JSON.parse(sessionStorage.getItem("userData")).username;
    },
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
    handleLogOut() {
      sessionStorage.removeItem("token");
      this.$router.push("/login");
    },

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
  display: flex;
  flex-direction: column;
}
.ivu-row-flex {
  height: 100%;
  overflow: hidden;
}
.layout-breadcrumb {
  padding: 10px 0;
  margin-bottom: 10px;
  border-bottom: 1px solid #e3e3e3;
}
.layout-content {
  flex: 1;
  display: flex;
  overflow: hidden;
  background: #fff;
}
.layout-content-main {
  padding: 10px;
  flex: 1;
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
  height: 46px;
  background: #515a6e;
  display: flex;
  padding: 0 10px;
  align-items: center;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  &__user {
    margin-left: auto;
    display: flex;
    align-items: center;
    color: #fff;
    &__avatar {
      height: 30px;
      width: 30px;
      border-radius: 50%;
      background: #0087cf;
      color: #fff;
      line-height: 30px;
      text-align: center;
      font-size: 18px;
    }
    &__user {
      padding: 0 10px;
      border-right: 1px solid rgb(124, 124, 124);
    }
    &__logOut {
      font-size: 20px;
      margin-left: 10px;
      cursor: pointer;
    }
  }
  .kirisun-logo {
    width: 140px;
  }
  .kirisun-text {
    font-size: 22px;
    color: #fff;
    font-weight: bold;
    line-height: 40px;
    margin-left: 14px;
  }
}

.layout-footer {
  padding: 2px 0;
  width: 100%;
  text-align: center;
  font-size: 12px;
  background: #a5a5a5;
  color: #fff;
}

.ivu-col {
  transition: width 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
}
.menu-icon {
  transition: 0.2s all;
  color: #fff;
  cursor: pointer;
  margin-left: 10px;
  font-size: 28px !important;
}
.menu-icon-hide {
  transform: rotate(90deg);
}
</style>
