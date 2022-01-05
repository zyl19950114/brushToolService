<template>
  <div class="login">
    <div class="login-header">
      <img src="@/assets/kirisun-logo.png" />
    </div>
    <div class="login-content">
      <div class="login-content__main">
        <!-- <div class="login-content__main__img">
          <img src="@/assets/login-earth.png">
        </div> -->
        <div class="login-content__main__form">
          <h1>{{ $webConfig.VUE_APP_TITLE }}</h1>
          <div class="login-content__main__form__input">
            <kirisun-input v-model="loginForm.username" placeholder="用户名" />
            <kirisun-input
              v-model="loginForm.password"
              type="password"
              placeholder="密码"
            />
            <div class="login-content__main__form__handle">
              <span>
                <label>
                  <input
                    v-model="isRemember"
                    type="checkbox"
                    class="login-content__main__checkbox"
                  />
                  记住用户
                </label>
              </span>
            </div>
            <button class="login-btn" @click="hendleLogin">
              登录
              <i class="login-btn__circle" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <footer class="login-footer">
      {{ $webConfig.VUE_APP_VISION }}
    </footer>
  </div>
</template>

<script>
import KirisunInput from "./components/KirisunInput";

export default {
  components: {
    KirisunInput,
  },
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      isRemember: false,
    };
  },
  mounted() {
    this.isRemember = JSON.parse(sessionStorage.getItem("rememberUser"));
    if (this.isRemember) {
      const userData = JSON.parse(sessionStorage.getItem("userData"));
      if (!userData) return;
      this.loginForm.username = userData.username;
      this.loginForm.password = userData.password;
    }
  },
  methods: {
    hendleLogin() {
      if (this.loginForm.username === "" || this.loginForm.password === "") {
        this.$Message.error("请输入用户名和密码", 10);
      }
      this.$axios
        .get("/login", {
          params: {
            username: this.loginForm.username,
            password: this.loginForm.password,
          },
        })
        .then((res) => {
          if (res && res.data.code === "0") {
            this.$Message.success("登录成功", 10);
            sessionStorage.setItem("token", res.data.desc);
            sessionStorage.setItem("rememberUser", this.isRemember);
            this.isRemember &&
              sessionStorage.setItem("userData", JSON.stringify(this.loginForm));
            !this.isRemember && sessionStorage.removeItem("userData");
            this.$router.push("/");
          } else {
            this.$Message.error("用户名或密码错误", 10);
          }
        });
    },
  },
};
</script>

<style lang="scss">
::-webkit-scrollbar {
  display: none;
}

.login {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: linear-gradient(-90deg, #345a76, #335376);
}

.login-header {
  width: 100%;
  height: 46px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
  color: hsla(0, 0%, 100%, 0.6);
  img {
    width: 140px;
  }
  &__opitions {
    margin-left: auto;
  }
}

.login-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  &__main {
    // width: 900px;
    // height: 500px;
    width: 540px;
    height: 420px;
    display: flex;
    background: rgba(34, 51, 94, 0.32);
    border-radius: 8px;
    box-shadow: 0 2px 6px 3px rgba(0, 0, 0, 0.06);
    &__img,
    &__form {
      flex: 1;
    }
    &__img img {
      width: 100%;
    }
    &__form {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      h1 {
        color: #fff;
        font-size: 24px;
        font-weight: 400;
        margin-bottom: 38px;
      }
      &__input {
        width: 100%;
        padding: 0 68px;
      }
      &__handle {
        color: rgba(255, 255, 255, 0.6);
        font-size: 12px;
        display: flex;
        width: 100%;
        justify-content: space-between;
        span {
          .login-content__main__checkbox {
            margin-right: 3px;
          }
          a {
            color: rgba(255, 255, 255, 0.6);
            text-decoration: none;
            transition: 0.2s all;
          }
          a:hover {
            color: rgba(255, 255, 255, 1);
          }
          label {
            display: flex;
            align-items: center;
            cursor: pointer;
          }
        }
      }
    }
  }

  .login-btn {
    position: relative;
    overflow: hidden;
    transition: 0.4s all;
    text-align: center;
    margin-top: 26px;
    width: 100%;
    border: none;
    cursor: pointer;
    border-radius: 2em;
    background: linear-gradient(90deg, #4466af, #355f8b) !important;
    color: rgba(255, 255, 255, 0.8);
    padding: 8px 0;
    &__circle {
      position: absolute;
      transition: 0.2s all;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      height: 50px;
      width: 50px;
      right: -22px;
      top: 5px;
    }
    &:hover {
      color: rgb(255, 255, 255);
    }
    &:hover .login-btn__circle {
      right: 100%;
      transform: translateX(50%);
      top: -12px;
    }
  }
}

.login-footer {
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: rgb(214, 214, 214);
  background: rgba(0, 0, 0, 0.3);
  font-size: 12px;
}
</style>
