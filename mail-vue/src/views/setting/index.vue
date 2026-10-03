<template>
  <div class="box">
    <section class="profile-hero">
      <div class="profile-avatar">{{ profileInitial }}</div>
      <div class="profile-hero-copy">
        <span class="profile-eyebrow">{{ $t('profile') }}</span>
        <h1>{{ userStore.user.name || userStore.user.email }}</h1>
        <p>{{ userStore.user.email }}</p>
      </div>
      <div class="profile-status"><span></span>{{ $t('active') }}</div>
    </section>
    <div class="profile-stats">
      <div><strong>{{ userStore.user.role?.name || $t('normal') }}</strong><span>{{ $t('role') }}</span></div>
      <div><strong>{{ userStore.user.account?.email || userStore.user.email }}</strong><span>{{ $t('account') }}</span></div>
    </div>
    <div class="container profile-section">
      <div class="title">{{$t('profile')}}</div>
      <div class="item">
        <div>{{$t('username')}}</div>
        <div>
          <span v-if="setNameShow" class="edit-name-input">
            <el-input v-model="accountName"  ></el-input>
            <span class="edit-name" @click="setName">
             {{$t('save')}}
            </span>
          </span>
          <span v-else class="user-name">
            <span >{{ userStore.user.name }}</span>
            <span class="edit-name" @click="showSetName">
             {{$t('change')}}
            </span>
          </span>
        </div>
      </div>
      <div class="item">
        <div>{{$t('emailAccount')}}</div>
        <div>{{ userStore.user.email }}</div>
      </div>
      <div class="item">
        <div>{{$t('password')}}</div>
        <div>
          <el-button type="primary" @click="pwdShow = true">{{$t('changePwdBtn')}}</el-button>
        </div>
      </div>
    </div>
    <div class="language">
      <div class="title">{{$t('language')}}</div>
      <el-select
          :model-value="langSelect"
          class="language-select"
          placeholder="Select"
          @change="changeLang"
      >
        <el-option label="Tiếng Việt" value="vi" @pointerdown.prevent.stop="changeLang('vi')"/>
        <el-option label="简体中文" value="zh" @pointerdown.prevent.stop="changeLang('zh')"/>
        <el-option label="English" value="en" @pointerdown.prevent.stop="changeLang('en')"/>
      </el-select>
    </div>
    <div class="del-email" v-perm="'my:delete'">
      <div class="title">{{$t('deleteUser')}}</div>
      <div style="color: var(--regular-text-color);">
        {{$t('delAccountMsg')}}
      </div>
      <div>
        <el-button type="primary" @click="deleteConfirm">{{$t('deleteUserBtn')}}</el-button>
      </div>
    </div>
    <el-dialog v-model="pwdShow" :title="$t('changePassword')" width="340">
      <div class="update-pwd">
        <el-input type="password" :placeholder="$t('newPassword')" v-model="form.password" autocomplete="off" @keyup.enter="submitPwd"/>
        <el-input type="password" :placeholder="$t('confirmPassword')" v-model="form.newPwd" autocomplete="off" @keyup.enter="submitPwd"/>
        <el-button type="primary" :loading="setPwdLoading" @click="submitPwd">{{$t('save')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
import {computed, reactive, ref, defineOptions} from 'vue'
import {resetPassword, userDelete} from "@/request/my.js";
import {useUserStore} from "@/store/user.js";
import router from "@/router/index.js";
import {accountSetName} from "@/request/account.js";
import {useAccountStore} from "@/store/account.js";
import {useI18n} from "vue-i18n";
import {useSettingStore} from "@/store/setting.js";

const { t } = useI18n()
const accountStore = useAccountStore()
const settingStore = useSettingStore()
const userStore = useUserStore();
const setPwdLoading = ref(false)
const setNameShow = ref(false)
const accountName = ref(null)
const langSelect = ref(settingStore.lang)
const profileInitial = computed(() => (userStore.user.name || userStore.user.email || '?').slice(0, 1).toUpperCase())

defineOptions({
  name: 'setting'
})

function showSetName() {
  accountName.value = userStore.user.name
  setNameShow.value = true
}

function setName() {

  if (!accountName.value) {
    ElMessage({
      message: t('emptyUserNameMsg'),
      type: 'error',
      plain: true,
    })
    return;
  }

  setNameShow.value = false
  let name = accountName.value

  if (name === userStore.user.name) {
    return
  }

  userStore.user.name = accountName.value

  accountSetName(userStore.user.account.accountId,name).then(() => {
    ElMessage({
      message: t('saveSuccessMsg'),
      type: 'success',
      plain: true,
    })

    accountStore.changeUserAccountName = name

  }).catch(() => {
    userStore.user.name = name
  })
}

function changeLang(lang) {
  let setting = {}
  try {
    setting = JSON.parse(localStorage.getItem('setting') || '{}')
  } catch (e) {
    setting = {}
  }
  localStorage.setItem('setting', JSON.stringify({...setting, lang}))
  window.location.reload()
}

const pwdShow = ref(false)
const form = reactive({
  password: '',
  newPwd: '',
})

const deleteConfirm = () => {
  ElMessageBox.confirm(t('delAccountConfirm'), {
    confirmButtonText: t('confirm'),
    cancelButtonText: t('cancel'),
    type: 'warning'
  }).then(() => {
    userDelete().then(() => {
      localStorage.removeItem('token');
      router.replace('/login');
      ElMessage({
        message: t('delSuccessMsg'),
        type: 'success',
        plain: true,
      })
    })
  })
}


function submitPwd() {

  if (setPwdLoading.value) return

  if (!form.password) {
    ElMessage({
      message: t('emptyPwdMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  if (form.password.length < 6) {
    ElMessage({
      message: t('pwdLengthMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  if (form.password !== form.newPwd) {
    ElMessage({
      message: t('confirmPwdFailMsg'),
      type: 'error',
      plain: true,
    })
    return
  }

  setPwdLoading.value = true
  resetPassword(form.password).then(() => {
    ElMessage({
      message: t('saveSuccessMsg'),
      type: 'success',
      plain: true,
    })
    pwdShow.value = false
    setPwdLoading.value = false
    form.password = ''
    form.newPwd = ''
  }).catch(() => {
    setPwdLoading.value = false
  })

}

</script>
<style scoped lang="scss">
.box {
  padding: 40px 40px;

  @media (max-width: 767px) {
    padding: 30px 30px;
  }

  .update-pwd {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .title {
    font-size: 18px;
    font-weight: bold;
  }

  .container {
    font-size: 14px;
    display: grid;
    gap: 20px;
    margin-bottom: 40px;

    .item {
      display: grid;
      grid-template-columns: 50px 1fr;
      gap: 140px;
      position: relative;
      .user-name {
        display: grid;
        grid-template-columns: auto 1fr;
        span:first-child {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }

      .edit-name-input {
        position: absolute;
        bottom: -6px;
        .el-input {
          width: min(200px,calc(100vw - 222px));
        }
      }

      .edit-name {
        color: #4dabff;
        padding-left: 10px;
        cursor: pointer;
      }

      @media (max-width: 767px) {
        gap: 70px;
      }

      div:first-child {
        font-weight: bold;
      }

      div:last-child {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }

  .language {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 40px;

    .language-select {
      width: 100px;
    }
  }

  .del-email {
    font-size: 14px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
}
</style>


<style scoped lang="scss">
.profile-hero { position: relative; display: flex; align-items: center; gap: 18px; overflow: hidden; padding: 28px 30px; border-radius: 24px; color: #fff; background: linear-gradient(135deg, #242650, #6d5dfc 58%, #24c8b5); box-shadow: 0 18px 45px rgba(59,54,150,.2); animation: profile-in .55s ease both; }
.profile-avatar { display: grid; place-items: center; width: 68px; height: 68px; flex: 0 0 auto; border-radius: 22px; color: #25264e; background: #fff; font-size: 30px; font-weight: 800; box-shadow: 0 10px 25px rgba(0,0,0,.16); }
.profile-eyebrow { font-size: 11px; font-weight: 800; letter-spacing: .16em; opacity: .72; }
.profile-hero h1 { margin: 5px 0 3px; font-size: 25px; letter-spacing: -.03em; }
.profile-hero p { margin: 0; opacity: .75; }
.profile-status { margin-left: auto; align-self: flex-start; display: flex; align-items: center; gap: 7px; padding: 7px 11px; border-radius: 99px; background: rgba(255,255,255,.16); font-size: 12px; }
.profile-status span { width: 7px; height: 7px; border-radius: 50%; background: #83e9d8; box-shadow: 0 0 0 4px rgba(131,233,216,.18); }
.profile-stats { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; margin: 16px 0 28px; }
.profile-stats > div { padding: 16px 18px; border: 1px solid var(--el-border-color-light); border-radius: 16px; background: var(--el-bg-color); box-shadow: 0 8px 24px rgba(30,32,70,.05); }
.profile-stats strong, .profile-stats span { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.profile-stats strong { font-size: 14px; }
.profile-stats span { margin-top: 5px; color: var(--regular-text-color); font-size: 12px; }
.profile-section { padding: 22px !important; border: 1px solid var(--el-border-color-light); border-radius: 20px; background: color-mix(in srgb, var(--el-bg-color) 88%, transparent); }
@keyframes profile-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
@media (max-width: 767px) { .profile-hero { padding: 22px 18px; } .profile-avatar { width: 54px; height: 54px; border-radius: 17px; font-size: 24px; } .profile-hero h1 { font-size: 20px; } .profile-status { position: absolute; right: 16px; top: 16px; font-size: 0; padding: 5px; } .profile-stats { grid-template-columns: 1fr; } }
</style>
