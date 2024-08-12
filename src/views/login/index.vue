<template>
  <div v-if="isMobile()" class="mobilebox">
    <div class="mobilebox-title">测试项目</div>

    <div class="mobilebox-form">
      <ElForm ref="loginFormRef" label-position="top" label-width="100px" size="large" :model="loginForm" :rules="loginFormRules">
        <ElFormItem label="用户名" prop="username">
          <ElInput placeholder="请输入用户名" v-model="loginForm.username" />
        </ElFormItem>
        <ElFormItem label="密码" prop="password">
          <ElInput placeholder="请输入密码" type="password" v-model="loginForm.password" @keyup.enter="checkLogin(loginFormRef)" show-password />
        </ElFormItem>
      </ElForm>
      <ElButton :loading="loginLoading" type="primary" style="width: 100%; margin-top: 3vh" size="large" @click="checkLogin(loginFormRef)">
        登录
      </ElButton>
    </div>
  </div>

  <div class="pcbox" v-else>
    <div class="pcbox-row">
      <img src="@/assets/imgs/login.png" alt="" />
      <div class="login">
        <div class="login-title">账户登录</div>
        <div class="login-form">
          <ElForm ref="loginFormRef" label-position="top" label-width="100px" size="large" :model="loginForm" :rules="loginFormRules">
            <ElFormItem label="账号" prop="username">
              <ElInput placeholder="请输入账号" v-model="loginForm.username" />
            </ElFormItem>
            <ElFormItem label="密码" prop="password">
              <ElInput placeholder="请输入密码" type="password" v-model="loginForm.password" @keyup.enter="checkLogin(loginFormRef)" show-password />
            </ElFormItem>
          </ElForm>
        </div>
        <div class="login-btn">
          <ElButton :loading="loginLoading" type="primary" style="width: 100%" size="large" @click="checkLogin(loginFormRef)">登录</ElButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElButton, ElForm, ElFormItem, ElInput, FormInstance, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import { isMobile } from '@/utils'
import { useUserStore } from '@/store/user'
import singleMessage from '@/utils/singleMessage'
import { useRouter } from 'vue-router'

const router = useRouter()

const userStore = useUserStore()

const loginForm = reactive({
  username: '',
  password: ''
})
const loginLoading = ref(false)
const loginFormRef = ref<FormInstance>()
const loginFormRules = reactive<FormRules<any>>({
  username: [
    {
      required: true,
      message: '请输入账号',
      trigger: ['blur', 'change']
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: ['blur', 'change']
    }
  ]
})

const handleLogin = async () => {
  loginLoading.value = true
  try {
    await userStore.login({
      name: loginForm.username,
      type: '3',
      password: loginForm.password
    })
    await userStore.getMenu()
    singleMessage.success('登录成功')
    router.push('/set/user')
  } catch (err) {
    console.log('err', err)
    const error = err as Error
    singleMessage.error(error.message)
  } finally {
    loginLoading.value = false
  }
}

const checkLogin = (loginFormRef: FormInstance | undefined) => {
  if (!loginFormRef) return
  loginFormRef.validate((valid: boolean) => {
    if (valid) {
      handleLogin()
    } else {
      return
    }
  })
}
</script>

<style lang="less" scoped>
.pcbox {
  width: 100vw;
  height: 100vh;
  background-color: #f6f8fd;
  position: relative;
  &-row {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    img {
      width: 527px;
      height: 473px;
      margin-right: 70px;
    }
  }
}
.header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 36px 40px;
  &-title {
    color: #212c67;
    font-size: 20px;
  }
}
.login {
  width: 450px;
  height: 490px;
  box-shadow: 0px 14px 29px 0px #dee1ff;
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 50px;
  &-title {
    font-weight: 600;
    color: #212c67;
    font-size: 30px;
  }
  &-form {
    margin-top: 34px;
    width: 100%;
  }
  &-btn {
    width: 100%;
    margin-top: 20px;
  }
}
.mobilebox {
  width: 100vw;
  height: 100vh;
  background-color: #ffffff;
  box-sizing: border-box;
  padding: 0 20px;
  &-title {
    width: 100%;
    text-align: center;
    padding-top: 10vh;
    padding-bottom: 5vh;
    font-size: 28px;
  }
}
</style>
