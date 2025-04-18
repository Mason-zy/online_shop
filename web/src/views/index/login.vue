<template>
  <div class="container">
    <div class="login-page pc-style">
      <img :src="LogoIcon" alt="logo" class="logo-icon">
      <div class="login-tab">
        <div class="tab-selected">
          <span>邮箱登录</span>
          <span class="tabline tabline-width"></span>
        </div>
      </div>
      <div class="mail-login" type="login">
        <div class="common-input">
          <img :src="MailIcon" class="left-icon">
          <div class="input-view">
            <input placeholder="请输入注册邮箱" v-model="pageData.loginForm.username" type="text" class="input">
            <p class="err-view">
            </p>
          </div>
          <!---->
        </div>
        <div class="common-input">
          <img :src="PwdIcon" class="left-icon">
          <div class="input-view">
            <input placeholder="请输入密码" v-model="pageData.loginForm.password" type="password" class="input">
            <p class="err-view">
            </p>
          </div>
<!--          <img src="@/assets/pwd-hidden.svg" class="right-icon">-->
          <!---->
        </div>
        <div class="next-btn-view">
          <button class="next-btn btn-active" style="margin: 16px 0px;" @click="handleLogin">登录</button>
        </div>
        <!-- 添加社交登录区域 -->
        <div class="social-login">
          <div class="social-title">其他登录方式</div>
          <div class="social-icons">
            <img :src="WeixinIcon" alt="微信登录" class="social-icon" @click="handleSocialLogin('weixin')">
            <img :src="QQIcon" alt="QQ登录" class="social-icon" @click="handleSocialLogin('qq')">
          </div>
        </div>
      </div>
      <div class="operation">
        <a @click="handleCreateUser" class="forget-pwd" style="text-align: left;">注册新帐号</a>
        <a class="forget-pwd" style="text-align: right;">忘记密码？</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useUserStore} from '/@/store';
import {message} from "ant-design-vue";
import LogoIcon from '/@/assets/images/k-logo.png';
import MailIcon from '/@/assets/images/mail-icon.svg';
import PwdIcon from '/@/assets/images/pwd-icon.svg';
import WeixinIcon from '/@/assets/images/weixin.png';
import QQIcon from '/@/assets/images/qq.png';


const router = useRouter();
const userStore = useUserStore();

const pageData = reactive({
  loginForm: {
    username: '',
    password: ''
  }
})

const handleLogin = ()=> {
  userStore.login({
    username: pageData.loginForm.username,
    password: pageData.loginForm.password
  }).then(res=> {
    loginSuccess()
    console.log('success==>', userStore.user_name)
    console.log('success==>', userStore.user_id)
    console.log('success==>', userStore.user_token)
  }).catch(err => {
    message.warn(err.msg || '登录失败')
  })
}

const handleCreateUser = () => {
  router.push({name:'register'})
}

const loginSuccess= ()=> {
  router.push({ name: 'portal' })
  message.success('登录成功！')
}

const handleSocialLogin = (type: string) => {
  message.info('社交登录功能开发中...')
}

</script>
<style scoped lang="less">
div {
  display: block;
}

.container {
  //background-color: #f1f1f1;
  background-image: url('../images/admin-login-bg.jpg');
  background-size: cover;
  object-fit: cover;
  height: 100%;
  max-width: 100%;
  display:flex;
  justify-content: center;
  align-items:center;
}

.new-content {
  position: absolute;
  left: 0;
  right: 0;
  margin: 80px auto 0;
  width: 980px;
}

.logo-img {
  width: 125px;
  display: block;
  margin-left: 137.5px;
}

.login-page {
  overflow: hidden;
  background: #fff;

  .logo-icon {
    margin-top: 20px;
    margin-left: 175px;
    width: 48px;
    height: 48px;
  }
}

.pc-style {
  position: relative;
  width: 400px;
  height: 520px;
  background: #fff;
  border-radius: 4px;
  -webkit-box-shadow: 2px 2px 6px #aaa;
  box-shadow: 2px 2px 6px #aaa;
}

.login-tab {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  color: #1e1e1e;
  font-size: 14px;
  color: #1e1e1e;
  font-weight: 500;
  height: 46px;
  line-height: 44px;
  margin-bottom: 40px;
  border-bottom: 1px solid #c3c9d5;

  div {
    position: relative;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    text-align: center;
    cursor: pointer;
  }

  .tabline {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
    display: inline-block;
    width: 0;
    height: 2px;
    background: #3d5b96;
    -webkit-transition: width .5s cubic-bezier(.46, 1, .23, 1.52);
    transition: width .5s cubic-bezier(.46, 1, .23, 1.52);
  }

  tab-selected {
    color: #1e1e1e;
    font-weight: 500;
  }

  .mail-login, .tel-login {
    padding: 0 28px;
  }

}

.mail-login {
  margin: 0px 24px;
}

.common-input {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: start;
  -ms-flex-align: start;
  align-items: flex-start;

  .left-icon {
    margin-right: 12px;
    width: 24px;
  }

  .input-view {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;

    .input {
      font-weight: 500;
      font-size: 14px;
      color: #1e1e1e;
      height: 26px;
      line-height: 26px;
      border: none;
      padding: 0;
      display: block;
      width: 100%;
      letter-spacing: 1.5px;
    }

    err-view {
      margin-top: 4px;
      height: 16px;
      line-height: 16px;
      font-size: 12px;
      color: #f62a2a;
    }
  }
}

.next-btn {
  background: #3d5b96;
  border-radius: 4px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  height: 40px;
  line-height: 40px;
  text-align: center;
  width: 100%;
  outline: none;
  cursor: pointer;
}

button {
  background: transparent;
  padding: 0;
  border-width: 0px;
}

button, input, select, textarea {
  margin: 0;
  padding: 0;
  outline: none;
}

.operation {
  display: flex;
  flex-direction: row;
  margin: 0 24px;
}

.forget-pwd {
  //text-align: center;
  display: block;
  overflow: hidden;
  flex:1;
  margin: 0 auto;
  color: #3d5b96;
  font-size: 14px;
  cursor: pointer;
}

.social-login {
  margin: 20px 0;
  text-align: center;
  
  .social-title {
    color: #999;
    font-size: 12px;
    margin-bottom: 15px;
    position: relative;
    
    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      width: 60px;
      height: 1px;
      background: #eee;
    }
    
    &::before {
      left: 50px;
    }
    
    &::after {
      right: 50px;
    }
  }
  
  .social-icons {
    display: flex;
    justify-content: center;
    gap: 30px;
    
    .social-icon {
      width: 36px;
      height: 36px;
      cursor: pointer;
      transition: transform 0.3s;
      
      &:hover {
        transform: scale(1.1);
      }
    }
  }
}

</style>
