<template>
  <div id="login-box" class="has-background" v-loading="oauthLoading" :element-loading-text="$t('loginBtn') + '…'">
    
    <!-- Đã thay thế mây động bằng background ảnh mặc định -->
    <div class="login-background" :style="background"></div>
    
    <section class="brand-panel">
      <div class="brand-mark"><Icon icon="mdi:email-fast-outline" width="30" height="30" /></div>
      <div class="brand-eyebrow">CLOUD MAIL · PRIVATE WORKSPACE</div>
      <h1>Hộp thư riêng,<br><span>nhẹ nhàng hơn.</span></h1>
      <p class="brand-copy">Một không gian email nhanh, riêng tư và được xây dựng để bạn tập trung vào những điều quan trọng.</p>
      <div class="feature-list">
        <div class="feature-item"><Icon icon="solar:shield-check-bold-duotone" width="22" height="22" /><span>Bảo mật trên nền Cloudflare</span></div>
        <div class="feature-item"><Icon icon="solar:bolt-bold-duotone" width="22" height="22" /><span>Gửi và nhận email tức thì</span></div>
        <div class="feature-item"><Icon icon="solar:stars-bold-duotone" width="22" height="22" /><span>Trải nghiệm gọn gàng, hiện đại</span></div>
      </div>
      <div class="brand-orbit orbit-one"></div>
      <div class="brand-orbit orbit-two"></div>
    </section>
    
    <div class="form-wrapper">
      <div class="container">
        <div class="mobile-brand-mark"><Icon icon="mdi:email-fast-outline" width="24" height="24" /></div>
        <span class="form-kicker">{{ show === 'login' ? 'CHÀO MỪNG TRỞ LẠI' : 'BẮT ĐẦU NGAY' }}</span>
        <span class="form-title">{{ settingStore.settings.title }}</span>
        <span class="form-desc" v-if="show === 'login'">{{ $t('loginTitle') }}</span>
        <span class="form-desc" v-else>{{ $t('regTitle') }}</span>
        
        <div v-show="show === 'login'">
          <el-input :class="!hideLoginDomain ? 'email-input' : ''" v-model="form.email"
                    type="text" :placeholder="$t('emailAccount')" autocomplete="off" @keyup.enter="submit">
            <template #append v-if="!hideLoginDomain">
              <!-- Sửa: Truyền 'login' vào openSelect -->
              <div @click.stop="openSelect">
                <el-select
                    v-if="show === 'login'"
                    ref="mySelect"
                    popper-class="login-domain-popper"
                    v-model="suffix"
                    :placeholder="$t('select')"
                    class="select"
                >
                  <el-option
                      v-for="item in domainList"
                      :key="item"
                      :label="item"
                      :value="item"
                  />
                </el-select>
                <div style="color: var(--el-text-color-primary)">
                  <span>{{ suffix }}</span>
                  <Icon class="setting-icon" icon="mingcute:down-small-fill" width="20" height="20"/>
                </div>
              </div>
            </template>
          </el-input>
          <el-input v-model="form.password" :placeholder="$t('password')" type="password" autocomplete="off" @keyup.enter="submit"></el-input>
          <el-button class="btn" type="primary" @click="submit" :loading="loginLoading">{{ $t('loginBtn') }}</el-button>
          
          <el-button v-for="p in oauthProviders" :key="p.key" class="btn" style="margin-top: 10px" @click="oauthLogin(p.key)">
            <el-avatar v-if="p.iconType === 'image'" :src="p.icon" :size="18" style="margin-right: 10px" />
            <Icon v-else :icon="p.icon" width="18" height="18" style="margin-right: 10px" />
            {{ p.label }}
          </el-button>
        </div>
        
        <div v-show="show !== 'login'">
          <el-input :class="!hideLoginDomain ? 'email-input' : ''" v-model="registerForm.email" type="text" :placeholder="$t('emailAccount')"
                    autocomplete="off" @keyup.enter="submitRegister">
            <template #append v-if="!hideLoginDomain">
              <!-- Sửa: Truyền 'register' vào openSelect -->
              <div @click.stop="openSelect">
                <el-select
                    v-if="show !== 'login'"
                    ref="mySelect"
                    popper-class="login-domain-popper"
                    v-model="suffix"
                    :placeholder="$t('select')"
                    class="select"
                >
                  <el-option
                      v-for="item in domainList"
                      :key="item"
                      :label="item"
                      :value="item"
                  />
                </el-select>
                <div>
                  <span>{{ suffix }}</span>
                  <Icon class="setting-icon" icon="mingcute:down-small-fill" width="20" height="20"/>
                </div>
              </div>
            </template>
          </el-input>
          <el-input v-model="registerForm.password" :placeholder="$t('password')" type="password" autocomplete="off" @keyup.enter="submitRegister"/>
          <el-input v-model="registerForm.confirmPassword" :placeholder="$t('confirmPwd')" type="password"
                    autocomplete="off" @keyup.enter="submitRegister"/>
          <el-input v-if="settingStore.settings.regKey === 0" v-model="registerForm.code" :placeholder="$t('regKey')"
                    type="text" autocomplete="off" @keyup.enter="submitRegister"/>
          <el-input v-if="settingStore.settings.regKey === 2" v-model="registerForm.code"
                    :placeholder="$t('regKeyOptional')" type="text" autocomplete="off" @keyup.enter="submitRegister"/>
          <div v-show="verifyShow"
               class="register-turnstile"
               :data-sitekey="settingStore.settings.siteKey"
               data-callback="onTurnstileSuccess"
               data-error-callback="onTurnstileError"
               data-after-interactive-callback="loadAfter"
               data-before-interactive-callback="loadBefore"
          >
            <span style="font-size: 12px;color: #F56C6C" v-if="botJsError">{{ $t('verifyModuleFailed') }}</span>
          </div>
          <el-button class="btn" style="margin: 0" type="primary" @click="submitRegister" :loading="registerLoading">{{ $t('regBtn') }}</el-button>
          
          <el-button v-for="p in oauthProviders" :key="p.key" class="btn" style="margin-top: 10px" @click="oauthLogin(p.key)">
            <el-avatar v-if="p.iconType === 'image'" :src="p.icon" :size="18" style="margin-right: 10px" />
            <Icon v-else :icon="p.icon" width="18" height="18" style="margin-right: 10px" />
            {{ p.label }}
          </el-button>
        </div>
        
        <template v-if="settingStore.settings.register === 0">
          <div class="switch" @click="show = 'register'" v-if="show === 'login'">{{ $t('noAccount') }}
            <span>{{ $t('regSwitch') }}</span></div>
          <div class="switch" @click="show = 'login'" v-else>{{ $t('hasAccount') }} <span>{{$t('loginSwitch') }}</span>
          </div>
        </template>
      </div>
    </div>
    
    <el-dialog class="bind-dialog" v-model="showBindForm"  :title="$t('emailAccount')" >
      <div class="bind-container">
        <el-input :class="!hideLoginDomain ? 'email-input' : ''" v-model="bindForm.email" type="text" :placeholder="$t('emailAccount')" autocomplete="off" @keyup.enter="bind">
          <template #append v-if="!hideLoginDomain">
            <!-- Sửa: Truyền 'bind' vào openSelect -->
            <div @click.stop="openSelect">
              <el-select
                  ref="mySelect"
                  popper-class="login-domain-popper"
                  v-model="suffix"
                  :placeholder="$t('select')"
                  class="select"
              >
                <el-option
                    v-for="item in domainList"
                    :key="item"
                    :label="item"
                    :value="item"
                />
              </el-select>
              <div>
                <span>{{ suffix }}</span>
                <Icon class="setting-icon" icon="mingcute:down-small-fill" width="20" height="20"/>
              </div>
            </div>
          </template>
        </el-input>
        <el-input v-if="settingStore.settings.regKey === 0" v-model="bindForm.code" :placeholder="$t('regKey')"
                  type="text" autocomplete="off" @keyup.enter="bind"/>
        <el-input v-if="settingStore.settings.regKey === 2" v-model="bindForm.code"
                  :placeholder="$t('regKeyOptional')" type="text" autocomplete="off" @keyup.enter="bind"/>
        <el-button class="btn" type="primary" @click="bind" :loading="bindLoading">{{ $t('confirm') }}</el-button>
      </div>
    </el-dialog>
    
    <a v-show="settingStore.settings.projectLink" class="github" href="https://github.com/minhduc290613/cloud-mail">
      <Icon icon="mingcute:github-line" color="#1890ff" width="20" height="20" />
    </a>
  </div>
</template>

<script setup>
import router from "@/router";
import {useRoute} from "vue-router";
import {computed, nextTick, reactive, ref} from "vue";
import {login} from "@/request/login.js";
import {register} from "@/request/login.js";
import {websiteConfig} from "@/request/setting.js";
import {isEmail} from "@/utils/verify-utils.js";
import {useSettingStore} from "@/store/setting.js";
import {useAccountStore} from "@/store/account.js";
import {useUserStore} from "@/store/user.js";
import {useUiStore} from "@/store/ui.js";
import {Icon} from "@iconify/vue";
import {cvtR2Url} from "@/utils/convert.js";
import {loginUserInfo} from "@/request/my.js";
import {permsToRouter} from "@/perm/perm.js";
import {useI18n} from "vue-i18n";
import {oauthBindUser, oauthLinuxDoLogin, oauthGithubLogin, oauthGoogleLogin} from "@/request/ouath.js";

const {t} = useI18n();
const accountStore = useAccountStore();
const userStore = useUserStore();
const uiStore = useUiStore();
const settingStore = useSettingStore();
const route = useRoute();
const loginLoading = ref(false)
const bindLoading = ref(false)
const oauthLoading = ref(false);
const showBindForm = ref(false);
const show = ref('login')

const oauthKeys = ['linuxdo', 'github', 'google']

const oauthProvider = computed(() => {
  const fromState = route.query.state
  if (oauthKeys.includes(fromState)) return fromState
  const fromStore = sessionStorage.getItem('oauthProvider')
  return oauthKeys.includes(fromStore) ? fromStore : null
})

const oauthProviders = computed(() => {
  const allProviders = [
    { key: 'google', label: 'Google', icon: 'devicon:google', iconType: 'iconify' },
    { key: 'github', label: 'GitHub', icon: 'codicon:github-inverted', iconType: 'iconify' },
    { key: 'linuxdo', label: 'LinuxDo', icon: '/image/linuxdo.webp', iconType: 'image' },
  ]
  return allProviders.filter(p => settingStore.settings[p.key + 'Switch'] === 0)
})

const bindForm = reactive({
  email: '',
  oauthUserId: '',
  code: ''
})

const form = reactive({
  email: '',
  password: '',
});

const mySelect = ref()

const suffix = ref('')
const registerForm = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  code: null
})
const domainList = settingStore.domainList;
const registerLoading = ref(false)
suffix.value = domainList[0]
const verifyShow = ref(false)
let verifyToken = ''
let turnstileId = null
let botJsError = ref(false)
let verifyErrorCount = 0

window.onTurnstileSuccess = (token) => {
  verifyToken = token;
};

window.onTurnstileError = (e) => {
  if (verifyErrorCount >= 4) {
    return
  }
  verifyErrorCount++
  console.warn('人机验加载失败', e)
  setTimeout(() => {
    nextTick(() => {
      if (!turnstileId) {
        turnstileId = window.turnstile.render('.register-turnstile')
      } else {
        window.turnstile.reset(turnstileId);
      }
    })
  }, 1500)
};

window.loadAfter = (e) => {
  console.log('loadAfter')
}

window.loadBefore = (e) => {
  console.log('loadBefore')
}

const loginOpacity = computed(() => {
  const opacity = settingStore.settings.loginOpacity
  return uiStore.dark ? `rgba(0, 0, 0, ${opacity})` : `rgba(255, 255, 255, ${opacity})`
})

const hideLoginDomain = computed(() => settingStore.settings.loginDomain === 1)

/* Sửa: Cập nhật background mặc định bằng hình ảnh của bạn */
const background = computed(() => {
  const bgUrl = settingStore.settings.background 
    ? cvtR2Url(settingStore.settings.background)
    : 'https://github.com/minhduc290613/cloud-mail/blob/4c7c1b1a0e827a455c671e071c2fc5d907146a81/mail-vue/public/image/background.jpeg?raw=true'; // <-- THAY TÊN FILE ẢNH CỦA BẠN TẠI ĐÂY
    
  return {
    'background-image': `url(${bgUrl})`,
    'background-repeat': 'no-repeat',
    'background-size': 'cover',
    'background-position': 'center'
  }
})

const openSelect = () => {
  mySelect.value?.toggleMenu()
}

const getFullEmail = (email) => {
  return hideLoginDomain.value ? email : email + suffix.value
}

const getEmailName = (email) => {
  return email.split('@')[0]
}

function oauthLogin(provider) {
  const clientId = settingStore.settings[provider + 'ClientId']
  const redirectUri = encodeURIComponent(window.location.origin + '/login')
  sessionStorage.setItem('oauthProvider', provider)
  const authorizeUrls = {
    linuxdo: `https://connect.linux.do/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid+profile+email&state=${provider}`,
    github: `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email&state=${provider}`,
    google: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid+profile+email&state=${provider}`,
  }
  window.location.href = authorizeUrls[provider]
}

const loginFns = {
  linuxdo: oauthLinuxDoLogin,
  github: oauthGithubLogin,
  google: oauthGoogleLogin,
}

oauthGetUser();

async function oauthGetUser() {
  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')
  if (!code || !oauthProvider.value) return

  const provider = oauthProvider.value
  oauthLoading.value = true
  sessionStorage.removeItem('oauthProvider')
  window.history.replaceState({}, '', window.location.origin + window.location.pathname)

  loginFns[provider](code, window.location.origin + '/login').then(data => {
    bindForm.oauthUserId = data.userInfo.oauthUserId;
    if (!data.token) {
      showBindForm.value = true
      oauthLoading.value = false
      ElMessage({
        message: t('regTitle'),
        type: 'warning',
        duration: 4000,
        plain: true,
      })
      return;
    }
    saveToken(data.token);
  }).catch(() => {
    oauthLoading.value = false
  })
}

function bind() {
  if (bindLoading.value) return
  if (!bindForm.email) {
    ElMessage({ message: t('emptyEmailMsg'), type: 'error', plain: true })
    return
  }
  if (getEmailName(bindForm.email).length < settingStore.settings.minEmailPrefix) {
    ElMessage({ message: t('minEmailPrefix', {msg: settingStore.settings.minEmailPrefix}), type: 'error', plain: true })
    return
  }
  let email = getFullEmail(bindForm.email);
  if (!isEmail(email)) {
    ElMessage({ message: t('notEmailMsg'), type: 'error', plain: true })
    return
  }
  if (settingStore.settings.regKey === 0) {
    if (!bindForm.code) {
      ElMessage({ message: t('emptyRegKeyMsg'), type: 'error', plain: true })
      return
    }
  }
  const form = {email, oauthUserId: bindForm.oauthUserId, code: bindForm.code}
  bindLoading.value = true
  oauthBindUser(form).then(data => {
    saveToken(data.token)
  }).catch(() => {
    bindLoading.value = false
  })
}

const submit = () => {
  if (loginLoading.value) return
  if (!form.email) {
    ElMessage({ message: t('emptyEmailMsg'), type: 'error', plain: true })
    return
  }
  let email = getFullEmail(form.email);
  if (!isEmail(email)) {
    ElMessage({ message: t('notEmailMsg'), type: 'error', plain: true })
    return
  }
  if (!form.password) {
    ElMessage({ message: t('emptyPwdMsg'), type: 'error', plain: true })
    return
  }
  loginLoading.value = true
  login(email, form.password).then(async data => {
    await saveToken(data.token)
  }).finally(() => {
    loginLoading.value = false
  })
}

async function saveToken(token) {
  localStorage.setItem('token', token)
  refreshWebsiteConfig()
  const user = await loginUserInfo();
  accountStore.currentAccountId = user.account.accountId;
  accountStore.currentAccount = user.account;
  userStore.user = user;
  const routers = permsToRouter(user.permKeys);
  routers.forEach(routerData => {
    router.addRoute('layout', routerData);
  });
  await router.replace({name: 'layout'})
  uiStore.showNotice()
  oauthLoading.value = false;
  bindLoading.value = false;
}

function refreshWebsiteConfig() {
  websiteConfig().then(setting => {
    settingStore.settings = setting
    settingStore.domainList = setting.domainList
    if (!suffix.value && setting.domainList.length > 0) {
      suffix.value = setting.domainList[0]
    }
    document.title = setting.title
  }).catch(e => {
    console.error(e)
  })
}

function submitRegister() {
  if (registerLoading.value) return
  if (!registerForm.email) {
    ElMessage({ message: t('emptyEmailMsg'), type: 'error', plain: true })
    return
  }
  if (getEmailName(registerForm.email).length < settingStore.settings.minEmailPrefix) {
    ElMessage({ message: t('minEmailPrefix', {msg: settingStore.settings.minEmailPrefix}), type: 'error', plain: true })
    return
  }
  const email = getFullEmail(registerForm.email);
  if (!isEmail(email)) {
    ElMessage({ message: t('notEmailMsg'), type: 'error', plain: true })
    return
  }
  if (!registerForm.password) {
    ElMessage({ message: t('emptyPwdMsg'), type: 'error', plain: true })
    return
  }
  if (registerForm.password.length < 6) {
    ElMessage({ message: t('pwdLengthMsg'), type: 'error', plain: true })
    return
  }
  if (registerForm.password !== registerForm.confirmPassword) {
    ElMessage({ message: t('confirmPwdFailMsg'), type: 'error', plain: true })
    return
  }
  if (settingStore.settings.regKey === 0) {
    if (!registerForm.code) {
      ElMessage({ message: t('emptyRegKeyMsg'), type: 'error', plain: true })
      return
    }
  }
  if (!verifyToken && (settingStore.settings.registerVerify === 0 || (settingStore.settings.registerVerify === 2 && settingStore.settings.regVerifyOpen))) {
    if (!verifyShow.value) {
      verifyShow.value = true
      nextTick(() => {
        if (!turnstileId) {
          try {
            turnstileId = window.turnstile.render('.register-turnstile')
          } catch (e) {
            botJsError.value = true
            console.log('人机验证js加载失败')
          }
        } else {
          window.turnstile.reset('.register-turnstile')
        }
      })
    } else if (!botJsError.value) {
      ElMessage({ message: t('botVerifyMsg'), type: "error", plain: true })
    }
    return;
  }
  registerLoading.value = true
  const form = {
    email,
    password: registerForm.password,
    token: verifyToken,
    code: registerForm.code
  }
  register(form).then(({regVerifyOpen}) => {
    show.value = 'login'
    registerForm.email = ''
    registerForm.password = ''
    registerForm.confirmPassword = ''
    registerForm.code = ''
    registerLoading.value = false
    verifyToken = ''
    settingStore.settings.regVerifyOpen = regVerifyOpen
    verifyShow.value = false
    ElMessage({ message: t('regSuccessMsg'), type: 'success', plain: true })
  }).catch(res => {
    registerLoading.value = false
    if (res.code === 400) {
      verifyToken = ''
      settingStore.settings.regVerifyOpen = true
      if (turnstileId) {
        window.turnstile.reset(turnstileId)
      } else {
        nextTick(() => {
          turnstileId = window.turnstile.render('.register-turnstile')
        })
      }
      verifyShow.value = true
    }
  });
}
</script>

<style>
.el-select-dropdown__item { padding: 0 15px; }
.no-autofill-pwd .el-input__inner { -webkit-text-security: disc !important; }
</style>

<style lang="scss" scoped>
/* Xóa gradient màu xanh cũ vì đã dùng ảnh tĩnh */
#login-box { font: 100% Arial, sans-serif; height: 100%; margin: 0; padding: 0; overflow-x: hidden; display: grid; grid-template-columns: 1fr; }
.form-wrapper { animation: cm-login-in .7s cubic-bezier(.2,.8,.2,1) both; }
.container { border-radius: 24px; box-shadow: 0 24px 70px rgba(27, 32, 69, .16); backdrop-filter: blur(18px); border: 1px solid rgba(255,255,255,.38); }
.form-title { letter-spacing: -.03em; }
.btn { border-radius: 12px; transition: transform .22s ease, box-shadow .22s ease; }
.btn:hover { transform: translateY(-2px); }
@keyframes cm-login-in { from { opacity: 0; transform: translateY(22px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }

.form-wrapper { position: fixed; right: 0; height: 100%; z-index: 10; display: flex; align-items: center; justify-content: center; @media (max-width: 767px) { width: 100%; } }
.container { background: v-bind(loginOpacity); padding-left: 40px; padding-right: 40px; display: flex; flex-direction: column; justify-content: center; width: 450px; height: 100%; border-left: 1px solid var(--login-border); box-shadow: var(--el-box-shadow-light); @media (max-width: 1024px) { padding: 20px 18px; width: 384px; margin-left: 18px; } @media (max-width: 767px) { border: 1px solid var(--login-border); padding: 20px 18px; border-radius: 6px; height: fit-content; width: 100%; margin-right: 18px; margin-left: 18px; }
  .btn { height: 36px; width: 100%; border-radius: 6px; }
  .form-desc { margin-top: 5px; margin-bottom: 18px; color: var(--form-desc-color); }
  .form-title { font-weight: bold; font-size: 22px !important; }
  .switch { margin-top: 20px; text-align: center; span { color: var(--login-switch-color); cursor: pointer; } }
  :deep(.el-input__wrapper) { border-radius: 6px; background: var(--el-bg-color); }
  .email-input :deep(.el-input__wrapper) { border-radius: 6px 0 0 6px; background: var(--el-bg-color); }
  .el-input { height: 38px; width: 100%; margin-bottom: 18px; :deep(.el-input__inner) { height: 36px; } }
}

:deep(.el-select-dropdown__item) { padding: 0 10px; }
:deep(.bind-dialog) { width: 400px !important; @media (max-width: 440px) { width: calc(100% - 40px) !important; margin-right: 20px !important; margin-left: 20px !important; } }
.bind-container { display: grid; grid-template-columns: 1fr; gap: 15px; }
.setting-icon { position: relative; top: 6px; }
.github { position: fixed; width: 35px; height: 35px; display: flex; justify-content: center; align-items: center; border-radius: 50%; background: var(--el-bg-color); bottom: 10px; right: 10px; z-index: 1000; border: 1px solid var(--el-border-color-light); box-shadow: var(--el-box-shadow-light); cursor: pointer; }
:deep(.el-input-group__append) { padding: 0 !important; padding-left: 8px !important; padding-right: 4px !important; background: var(--el-bg-color); border-radius: 0 8px 8px 0; }
:deep(.el-button+.el-button) { margin: 0; }
.register-turnstile { margin-bottom: 18px; }
.select { position: absolute; right: 30px; width: 100px; opacity: 0; pointer-events: none; visibility: hidden; }
.custom-style { margin-bottom: 10px; }
.custom-style .el-segmented { --el-border-radius-base: 6px; width: 180px; }
/* Đã xóa toàn bộ CSS liên quan tới animation cloud */
</style>

<style lang="scss" scoped>
.brand-panel { position: fixed; inset: 0 auto 0 0; width: min(58vw, 760px); padding: clamp(38px, 8vw, 120px) clamp(28px, 8vw, 120px); color: #fff; z-index: 2; overflow: hidden; background: linear-gradient(135deg, rgba(19, 20, 48, .90), rgba(39, 32, 101, .85) 58%, rgba(24, 150, 145, .82)); clip-path: polygon(0 0, 100% 0, 88% 100%, 0 100%); }
.brand-mark, .mobile-brand-mark { display: grid; place-items: center; color: #fff; background: linear-gradient(135deg, #8174ff, #2ed9bd); box-shadow: 0 12px 30px rgba(75, 69, 190, .38); }
.brand-mark { width: 58px; height: 58px; border-radius: 18px; margin-bottom: 32px; animation: cm-mark-pulse 4s ease-in-out infinite; }
.brand-eyebrow, .form-kicker { font-size: 11px; font-weight: 800; letter-spacing: .18em; opacity: .72; }
.brand-panel h1 { margin: 18px 0 22px; font-size: clamp(38px, 5vw, 72px); line-height: .98; letter-spacing: -.06em; }
.brand-panel h1 span { color: #83e9d8; }
.brand-copy { max-width: 430px; color: rgba(255,255,255,.72); font-size: 16px; line-height: 1.75; }
.feature-list { display: grid; gap: 15px; margin-top: 42px; }
.feature-item { display: flex; align-items: center; gap: 12px; font-size: 14px; color: rgba(255,255,255,.86); }
.feature-item :deep(svg) { color: #83e9d8; flex: 0 0 auto; }
.brand-orbit { position: absolute; border: 1px solid rgba(255,255,255,.13); border-radius: 50%; pointer-events: none; }
.orbit-one { width: 520px; height: 520px; right: -250px; top: 8%; animation: cm-orbit 16s linear infinite; }
.orbit-two { width: 740px; height: 740px; right: -360px; top: -2%; opacity: .55; animation: cm-orbit 24s linear infinite reverse; }
.mobile-brand-mark { display: none; }
.form-wrapper { width: min(48vw, 660px); }
.container { width: min(420px, calc(100vw - 48px)) !important; height: auto !important; min-height: 520px; margin: 0 auto !important; padding: 42px 42px 34px !important; border: 1px solid rgba(255,255,255,.55) !important; border-radius: 28px !important; background: rgba(255,255,255,.88) !important; box-shadow: 0 28px 80px rgba(18, 19, 58, .3) !important; backdrop-filter: blur(24px); }
.container .form-kicker { display: block; color: #6d5dfc; margin-bottom: 8px; }
.container .form-title { color: #17182d; font-size: 30px !important; }
.container .form-desc { line-height: 1.6; }
.container .btn { height: 44px !important; border-radius: 12px !important; }
.container :deep(.el-input__wrapper) { min-height: 44px; border-radius: 12px !important; background: rgba(255,255,255,.82); }
.container .switch { font-size: 13px; }
@keyframes cm-mark-pulse { 0%,100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(-5px) rotate(3deg); } }
@keyframes cm-orbit { from { transform: rotate(0) translateX(12px); } to { transform: rotate(360deg) translateX(12px); } }
@media (max-width: 1024px) { .brand-panel { width: 50vw; padding: 52px 34px; } .brand-panel h1 { font-size: 42px; } .form-wrapper { width: 56vw; } }
@media (max-width: 767px) { .brand-panel { display: none; } .form-wrapper { width: 100%; } .container { min-height: 0; padding: 32px 24px 26px !important; margin: 18px !important; width: calc(100% - 36px) !important; } .mobile-brand-mark { display: grid; width: 48px; height: 48px; border-radius: 15px; margin-bottom: 22px; } }
</style>

<style lang="scss">
.login-domain-popper { max-width: calc(100vw - 32px) !important; border-radius: 14px !important; overflow: hidden; }
.login-domain-popper .el-select-dropdown__item { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
@media (max-width: 767px) {
  body { overflow-x: hidden; }
  #login-box { min-height: 100dvh; padding: 18px 0; box-sizing: border-box; }
  #login-box .form-wrapper { position: relative; right: auto; min-height: calc(100dvh - 36px); padding: 0 12px; box-sizing: border-box; }
  #login-box .container { box-sizing: border-box; width: 100% !important; max-width: 430px; margin: 0 auto !important; padding: 28px 20px 24px !important; border-radius: 24px !important; }
  #login-box .form-title { display: block; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 28px !important; }
  #login-box .form-desc { display: block; margin-bottom: 20px; font-size: 14px; }
  #login-box .el-input { width: 100%; }
  #login-box .el-input-group__append { max-width: 46%; overflow: hidden; }
  #login-box .el-input-group__append > div { max-width: 100%; overflow: hidden; }
  #login-box .el-input-group__append span { display: inline-block; max-width: calc(100vw * .34); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; vertical-align: middle; }
  #login-box .btn { min-height: 44px; }
}
</style>

<style lang="scss">
#login-box.has-background { background: transparent !important; }
#login-box .login-background { position: fixed; inset: 0; z-index: 0; width: 100%; height: 100%; min-height: 100dvh; background-size: cover !important; background-position: center center !important; background-repeat: no-repeat !important; }
#login-box.has-background::before { content: ''; position: fixed; inset: 0; z-index: 1; pointer-events: none; background: linear-gradient(135deg, rgba(18, 18, 42, .18), rgba(36, 200, 181, .08)); }
#login-box.has-background .form-wrapper { z-index: 10; }
@media (max-width: 767px) {
  #login-box.has-background { background: transparent !important; }
  #login-box.has-background .login-background { background-attachment: scroll !important; }
  .login-domain-popper { position: fixed !important; left: 16px !important; right: 16px !important; top: 58% !important; bottom: auto !important; width: auto !important; max-width: none !important; transform: none !important; z-index: 2000 !important; }
  .login-domain-popper .el-select-dropdown__list { max-height: 180px; overflow-y: auto; }
}
</style>


<style lang="scss">
/* Domain suffix selector: giữ ô chọn nằm gọn trong append, không đè lên ô email. */
.email-input :deep(.el-input-group__append) { min-width: 0 !important; overflow: visible !important; }
.email-input :deep(.el-input-group__append > div) { min-width: 0; max-width: 100%; display: flex; align-items: center; }
.email-input :deep(.el-input-group__append > div > div:last-child) { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: flex; align-items: center; }
.login-domain-popper { max-width: min(420px, calc(100vw - 24px)) !important; }
@media (max-width: 767px) {
  .email-input :deep(.el-input-group__append) { width: 42% !important; padding-left: 8px !important; }
  .email-input :deep(.el-input-group__prepend), .email-input :deep(.el-input__wrapper) { min-width: 0; }
  .login-domain-popper { position: fixed !important; left: 12px !important; right: 12px !important; top: auto !important; bottom: 22vh !important; width: auto !important; max-height: 42vh; overflow-y: auto; }
}
</style>
