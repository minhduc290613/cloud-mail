<template>
  <div class="perm-box">
    <div class="header-actions">
      <Icon class="icon" icon="ion:add-outline" width="23" height="23" @click="openAddRole"/>
      <Icon class="icon" icon="ion:reload" width="18" height="18" @click="refresh"/>
    </div>
    <el-scrollbar class="perm-scrollbar">
      <div class="loading" :class="tableLoading ? 'loading-show' : 'loading-hide'"
           :style="first ? 'background: transparent' : ''">
        <loading/>
      </div>
      <el-table
          :data="roles"
          style="height: 100%;"
          :empty-text="''"
      >
        <el-table-column width="10"/>
        <el-table-column :label="$t('role')" prop="name" :min-width="roleWidth">
          <template #default="props">
            <div class="role-name">
              <span>{{ formatRoleName(props.row.name) }}</span>
              <span v-if="props.row.isDefault"><el-tag class="def-tag">{{ $t('default') }}</el-tag></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('order')" :width="sortWidth" prop="sort"/>
        <el-table-column v-if="desShow" :label="$t('description')" min-width="200" prop="description">
          <template #default="props">
            <div class="description">
              <span>{{ formatRoleDesc(props.row.description) }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('tabSetting')" :width="settingWidth">
          <template #default="props">
            <el-dropdown trigger="click">
              <el-button size="small" type="primary">{{ $t('action') }}</el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="openRoleSet(props.row)">{{ $t('change') }}</el-dropdown-item>
                  <el-dropdown-item @click="setDef(props.row)">{{ $t('default') }}</el-dropdown-item>
                  <el-dropdown-item @click="delRole(props.row)">{{ $t('delete') }}</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
    <el-dialog top="5vh" class="dialog" v-model="roleFormShow" @closed="resetForm">
      <template #header>
        <span style="font-size: 18px">{{ dialogType.title }}</span>
        <el-popover
            width="340"
            :title="t('featDesc')"
            placement="bottom"
        >
          <template #reference>
            <Icon class="warning" icon="fe:warning" width="18" height="18"/>
          </template>
          <div style="font-weight: bold;;margin-bottom: 2px;">{{ t('emailInterception') }}</div>
          <div>{{ t('emailInterceptionDesc') }}</div>
          <div style="font-weight: bold;;margin-top: 10px;margin-bottom: 2px;">{{ t('availableDomains') }}</div>
          <div>
            {{ t('availableDomainsDesc') }}
          </div>
        </el-popover>
      </template>
      <div class="dialog-box">
        <el-input class="dialog-input" v-model="form.name" type="text" :maxlength="12" :placeholder="$t('roleName')"
                  autocomplete="off" @keyup.enter="roleFormClick"/>
        <el-input class="dialog-input" v-model="form.description" :maxlength="30" type="text"
                  :placeholder="$t('description')" autocomplete="off" @keyup.enter="roleFormClick"/>
        <el-input-tag class="dialog-input" tag-type="warning" v-model="form.banEmail"
                      @add-tag="banEmailAddTag" type="text" :placeholder="$t('emailInterception')" autocomplete="off"/>
        <el-select
            class="dialog-input"
            v-model="form.availDomain"
            multiple
            filterable
            allow-create
            default-first-option
            :reserve-keyword="false"
            tag-type="success"
            :placeholder="$t('availableDomains')"
            @change="availDomainChange"
        >
          <el-option
              v-for="item in domainOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
        <div class="dialog-input">
          <el-input-number :placeholder="$t('order')" :min="0" :max="9999" v-model.number="form.sort"
                           controls-position="right" autocomplete="off"/>
        </div>
        <el-radio-group v-model="expand" size="small" @change="expandChange" class="perm-expand">
          <el-radio-button :label="$t('expand')" :value="true"/>
          <el-radio-button :label="$t('collapse')" :value="false"/>
        </el-radio-group>
        <el-tree
            :expand-on-click-node="false"
            :check-on-click-node="false"
            ref="tree"
            :data="treeList"
            show-checkbox
            node-key="permId"
            :default-expand-all="expand"
            :props="{
              label: 'name'
            }"
        >
          <template #default="{ node, data }">
            <div>
              <span>{{ formatPermName(data, node.label) }}</span>
              <span class="send-num" v-if="data.permKey === 'email:send'" @click.stop>
                <el-input-number v-if="form.sendType === 'day' || form.sendType === 'count'" v-model="form.sendCount" controls-position="right" :min="0" :max="99999" size="small"
                                 :placeholder="$t('total')">
                </el-input-number>
                  <el-select v-model="form.sendType" placeholder="Select" size="small"
                             :style="`width: ${ locale === 'zh' ? 65 : 85 }px;margin-left: 5px;`">
                    <el-option :label="$t('total')" value="count"/>
                    <el-option :label="$t('daily')" value="day"/>
                    <el-option :label="$t('internal')" value="internal"/>
                    <el-option :label="$t('btnBan')" value="ban"/>
                  </el-select>
              </span>
              <span class="send-num" v-if="data.permKey === 'account:add'" @click.stop>
                <el-input-number v-model="form.accountCount" controls-position="right" :min="0" :max="99999"
                                 size="small" :placeholder="$t('total')">
                </el-input-number>
              </span>
            </div>
          </template>
        </el-tree>
        <el-button class="btn" type="primary" :loading="permLoading" @click="roleFormClick"
        >{{ $t('save') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
import {Icon} from "@iconify/vue";
import {defineOptions, nextTick, reactive, ref} from "vue";
import {roleAdd, roleDelete, rolePermTree, roleRoleList, roleSet, roleSetDef} from "@/request/role.js";
import loading from '@/components/loading/index.vue';
import {useRoleStore} from "@/store/role.js";
import {useUserStore} from "@/store/user.js";
import {useSettingStore} from "@/store/setting.js";
import {isEmail, isDomain} from "@/utils/verify-utils.js";
import {useI18n} from "vue-i18n";

defineOptions({
  name: 'role'
})

const {domainList} = useSettingStore();
const {t, locale} = useI18n();
const userStore = useUserStore();
const roleStore = useRoleStore();
const roleFormShow = ref(false)
const treeList = reactive([])
const roles = ref([])
const tree = ref({})
const permLoading = ref(false)
const tableLoading = ref(false)
const desShow = ref(true)
const settingWidth = ref(null)
const sortWidth = ref(null)
const roleWidth = ref(200)
const first = ref(true)

const dialogType = reactive({
  title: '',
  type: ''
})

const form = reactive({
  name: null,
  description: null,
  banEmail: [],
  sendType: 'count',
  sendCount: 0,
  accountCount: 0,
  sort: 0,
  isDefault: 0,
  availDomain: []
})

let domainOptions = []

const expand = ref(false)

let chooseRole = {}

refresh()

rolePermTree().then(tree => {
  treeList.push(...tree)
})

domainOptions = domainList.map(domain => {
  const cleanDomain = domain.replace(/^@/, '');
  return {label: cleanDomain, value: cleanDomain};
});

function formatRoleName(name) {
  if (name === '普通用户') return t('defaultRole')
  return name
}

function formatRoleDesc(desc) {
  if (desc === '只有普通使用权限') return t('defaultRoleDesc')
  return desc
}

function formatPermName(data, fallbackLabel) {
  if (data?.permKey) {
    const keyMap = {
      'email:send': t('permEmailSend'),
      'email:delete': t('permEmailDelete'),
      'account:query': t('permAccountQuery'),
      'account:add': t('permAccountAdd'),
      'account:delete': t('permAccountDelete'),
      'my:delete': t('permMyDelete'),
      'analysis:query': t('permDataQuery'),
      'user:query': t('permUserQuery'),
      'user:add': t('permUserAdd'),
      'user:set-pwd': t('permPwdModify'),
      'user:set-status': t('permStatusModify'),
      'user:set-type': t('permTypeModify'),
      'user:delete': t('permUserDelete'),
      'user:reset-send': t('permResetSend'),
      'all-email:query': t('permAllEmailQuery'),
      'all-email:delete': t('permAllEmailDelete'),
      'role:query': t('permRoleQuery'),
      'role:add': t('permRoleAdd'),
      'role:set': t('permRoleSet'),
      'role:delete': t('permRoleDelete'),
      'reg-key:query': t('permKeyQuery'),
      'reg-key:add': t('permKeyAdd'),
      'reg-key:delete': t('permKeyDelete'),
      'setting:query': t('permSettingQuery'),
      'setting:set': t('permSettingSet'),
    };
    if (keyMap[data.permKey]) {
      return keyMap[data.permKey];
    }
  }

  const rawName = data?.name || fallbackLabel;
  const nameMap = {
    '邮件': t('permMail'),
    'Emails': t('permMail'),
    '邮箱侧栏': t('permMailboxSidebar'),
    'Email Address': t('permMailboxSidebar'),
    '个人设置': t('permPersonalSettings'),
    'Settings': t('permPersonalSettings'),
    '分析页': t('permAnalyticsPage'),
    'Analytics': t('permAnalyticsPage'),
    '用户信息': t('permUserList'),
    '用户列表': t('permUserList'),
    'All Users': t('permUserList'),
    '邮件列表': t('permAllMail'),
    '全部邮件': t('permAllMail'),
    'All Mail': t('permAllMail'),
    '权限控制': t('permRoleControl'),
    'Role': t('permRoleControl'),
    '注册密钥': t('permInviteCode'),
    'Invite Code': t('permInviteCode'),
    '系统设置': t('permSystemSettings'),
    'System Settings': t('permSystemSettings'),
    '邮件发送': t('permEmailSend'),
    'Send Email': t('permEmailSend'),
    '邮件删除': t('permEmailDelete'),
    'Delete Email': t('permEmailDelete'),
    '邮箱查看': t('permAccountQuery'),
    'View Email': t('permAccountQuery'),
    '邮箱添加': t('permAccountAdd'),
    'Add Email': t('permAccountAdd'),
    '邮箱删除': t('permAccountDelete'),
    '用户注销': t('permMyDelete'),
    'Delete User': t('permMyDelete'),
    '数据查看': t('permDataQuery'),
    'View Data': t('permDataQuery'),
    '用户查看': t('permUserQuery'),
    'View User': t('permUserQuery'),
    '用户添加': t('permUserAdd'),
    'Add User': t('permUserAdd'),
    '密码修改': t('permPwdModify'),
    'Change Password': t('permPwdModify'),
    '状态修改': t('permStatusModify'),
    'Change Status': t('permStatusModify'),
    '权限修改': t('permTypeModify'),
    'Change Role': t('permTypeModify'),
    '用户删除': t('permUserDelete'),
    '发件重置': t('permResetSend'),
    'Reset Send Count': t('permResetSend'),
    '身份查看': t('permRoleQuery'),
    'View Role': t('permRoleQuery'),
    '身份添加': t('permRoleAdd'),
    'Add Role': t('permRoleAdd'),
    '身份修改': t('permRoleSet'),
    '身份删除': t('permRoleDelete'),
    'Delete Role': t('permRoleDelete'),
    '密钥查看': t('permKeyQuery'),
    'View Code': t('permKeyQuery'),
    '密钥添加': t('permKeyAdd'),
    'Add Code': t('permKeyAdd'),
    '密钥删除': t('permKeyDelete'),
    'Delete Code': t('permKeyDelete'),
    '设置查看': t('permSettingQuery'),
    'View Settings': t('permSettingQuery'),
    '设置修改': t('permSettingSet'),
    'Change Settings': t('permSettingSet'),
  };

  return nameMap[rawName] || rawName || fallbackLabel;
}


function availDomainChange() {
  const index = form.availDomain.findIndex(domain => {
    return !domainOptions.map(option => option.value).includes(domain)
  })
  if (index > -1) {
    form.availDomain.splice(index, 1)
  }
}

function banEmailAddTag(val) {
  const emails = Array.from(new Set(
      val.split(/[,，]/).map(item => item.trim()).filter(item => item)
  ));

  form.banEmail.splice(form.banEmail.length - 1, 1)

  emails.forEach(email => {
    if ((isEmail(email) || isDomain(email) || email === '*') && !form.banEmail.includes(email)) {
      form.banEmail.push(email)
    }
  })
}


function roleFormClick() {
  if (permLoading.value) return
  if (dialogType.type === 'add') {
    addRole()
  } else {
    setRole()
  }
}

function setDef(role) {
  roleSetDef(role.roleId).then(() => {
    ElMessage({
      message: t('saveSuccessMsg'),
      type: "success",
      plain: true
    })
    getRoleList()
  })
}

function delRole(role) {
  ElMessageBox.confirm(t('delConfirm', {msg: role.name}), {
    confirmButtonText: t('confirm'),
    cancelButtonText: t('confirm'),
    type: 'warning'
  }).then(() => {
    roleDelete(role.roleId).then(() => {
      ElMessage({
        message: t('copySuccessMsg'),
        type: "success",
        plain: true
      })
      getRoleList()
      userStore.refreshUserList()
      roleStore.refreshSelect()
    })
  });
}

function expandChange(e) {
  if (e) {
    const nodes = tree.value?.store.nodesMap;
    for (const key in nodes) {
      nodes[key].expanded = true;
    }
  } else {
    const nodes = tree.value?.store.nodesMap;
    for (const key in nodes) {
      nodes[key].expanded = false;
    }
  }

}

function setRole() {

  if (!form.name) {
    ElMessage({
      message: t('emptyRoleNameMsg'),
      type: "error",
      plain: true
    })
    return
  }

  const params = {...form, roleId: chooseRole.roleId}
  const checkedId = tree.value.getCheckedKeys()
  const halfId = tree.value.getHalfCheckedKeys()
  params.permIds = [...checkedId, ...halfId]

  permLoading.value = true
  roleSet(params).then(() => {
    ElMessage({
      message: t('saveSuccessMsg'),
      type: "success",
      plain: true
    })

    const names = roles.value.map(role => role.name)

    if (!names.includes(params.name)) {
      roleStore.refreshSelect()
    }

    roleFormShow.value = false
    getRoleList()
  }).finally(() => {
    permLoading.value = false
  })
}

function resetForm() {
  form.name = null
  form.description = null
  form.sort = 0
  form.sendType = 'count'
  form.sendCount = 0
  form.accountCount = 0
  form.banEmail = []
  form.availDomain = []
  tree.value.setCheckedKeys([])
}

function openRoleSet(role) {
  chooseRole = role
  dialogType.title = t('changeRoleTitle')
  dialogType.type = 'set'
  roleFormShow.value = true
  form.sort = role.sort
  form.name = role.name
  form.description = role.description
  form.sendType = role.sendType
  form.sendCount = role.sendCount
  form.accountCount = role.accountCount
  form.banEmail = role.banEmail
  form.availDomain = role.availDomain
  nextTick(() => {
    tree.value.setCheckedKeys(role.permIds)
  })
}


function openAddRole() {
  dialogType.title = t('addRoleTitle')
  dialogType.type = 'add'
  roleFormShow.value = true
}

function addRole() {
  const params = {...form}
  const checkedId = tree.value.getCheckedKeys()
  const halfId = tree.value.getHalfCheckedKeys()
  params.permIds = [...checkedId, ...halfId]

  permLoading.value = true
  roleAdd(params).then(() => {
    ElMessage({
      message: t('addSuccessMsg'),
      type: "success",
      plain: true
    })
    roleFormShow.value = false
    getRoleList()
    roleStore.refreshSelect()
  }).finally(() => {
    permLoading.value = false
  })
}


function refresh() {
  tableLoading.value = true
  roles.length = 0
  getRoleList()
}

function getRoleList() {
  roleRoleList().then(list => {
    roles.value = list
  }).finally(() => {
    tableLoading.value = false
    setTimeout(() => {
      first.value = false
    }, 200)
  })
}

function adjustWidth() {
  desShow.value = window.innerWidth > 767
  settingWidth.value = window.innerWidth < 480 ? (locale.value === 'en' ? 85 : 75) : null
  sortWidth.value = window.innerWidth < 480 ? 75 : null
  roleWidth.value = window.innerWidth < 480 ? 180 : 200
}

adjustWidth()

window.onresize = () => {
  adjustWidth()
};


</script>
<style scoped lang="scss">

.perm-box {
  height: 100%;
  overflow: hidden;
  width: 100%;

  .perm-scrollbar {
    height: 100%;
  }
}

.send-num {
  margin-left: 10px;

  .el-input-number {
    width: 95px;
  }
}

.def-tag {
  margin-left: 10px;
  height: 20px;
}

.header-actions {
  padding: 9px 15px;
  display: flex;
  align-items: center;
  gap: 18px;
  box-shadow: var(--header-actions-border);
  font-size: 18px;

  .search {
    :deep(.el-input-group) {
      height: 28px;
    }

    :deep(.el-input__inner) {
      height: 28px;
    }
  }

  .icon {
    cursor: pointer;
  }
}

.warning {
  position: relative;
  left: 5px;
  top: 2px;
  color: gray;
  cursor: pointer;
}

:deep(.description) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.loading {
  height: calc(100% - 41px);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  background: var(--loadding-background);
  z-index: 2;
}

.loading-show {
  transition: all 200ms ease 200ms;
  opacity: 1;
}

.loading-hide {
  pointer-events: none;
  transition: var(--loading-hide-transition);
  opacity: 0;
}

.role-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.description {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}


:deep(.el-segmented--small .el-segmented__item) {
  border-radius: 8px !important;
  overflow: hidden;
}

.dialog-box {
  .dialog-input {
    margin-bottom: 15px !important;
  }
}

.perm-expand {
  margin-bottom: 5px;
  --el-border-radius-base: 4px;
  position: relative;
  bottom: 5px;
}


:deep(.el-dialog) {
  margin-bottom: 20px !important;
  width: 460px !important;
  @media (max-width: 500px) {
    width: calc(100% - 40px) !important;
    margin-right: 20px !important;
    margin-left: 20px !important;

  }
}

:deep(.el-scrollbar__view) {
  height: 100%;
}

.btn {
  width: 100%;
  margin-top: 15px;
}
</style>
