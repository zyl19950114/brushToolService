<template>
  <div id="app">
    <router-view v-if="$route.path === '/login'" />
    <root-nav v-else>
      <transition name="Skleft">
        <router-view />
      </transition>
    </root-nav>
  </div>
</template>

<script>
import RootNav from "@/components/RootNav";
export default {
  name: "App",
  components: {
    RootNav,
  },
};
</script>

<style>
#app {
  height: 100vh;
  overflow: hidden;
}

.Skleft-enter-active,
.Sklef-leave-active {
  transition: all 400ms;
}

.Skleft-leave-to {
  transform: translate3d(-30px, 0, 0);
  opacity: 1;
}

.Skleft-enter {
  transform: translate3d(30px, 0, 0);
  opacity: 0;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
