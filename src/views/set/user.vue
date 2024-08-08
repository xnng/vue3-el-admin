<template>
  <ACard v-loading="boxLoading">
    <ASearch v-model="searchForm" :options="tableOption" @reset="handleReset" @search="handleSearch" />
    <ATable :options="tableOption" v-model="tableData" v-model:pagination="pagination" @refresh="refresh" @fetch="refresh">
      <template #name="scoped">
        <div class="flex items-center gap-[10px]">
          <img :src="scoped.row.avatar" class="w-[40px] h-[40px] rounded-[50%]" alt="" />
          <span>{{ scoped.row.name }}</span>
        </div>
      </template>
      <template #role="scoped">{{ scoped.row.role.name }} </template>
      <template #status="scoped">
        <ElSwitch
          v-model="scoped.row.isAdmin"
          inline-prompt
          :active-value="true"
          :inactive-value="false"
          active-text="是"
          inactive-text="否"
          @change="changeStatus(scoped.row)"
        />
      </template>
      <template #menuSlot="{ row }">
        <ElButton type="primary" link size="default" @click="bindRole(row)">绑定角色</ElButton>
      </template>
    </ATable>
    <ADialog :center="false" top="10vh" width="500px" v-model:show="roleDialog" title="绑定角色" @close="handleClose" @confirm="handleConfirm">
      <ElRadioGroup v-model="checkRole">
        <div>
          <div v-for="item in roleList" :key="item.id">
            <ElRadio :label="item.id" size="large">{{ item.name }}</ElRadio>
          </div>
        </div>
      </ElRadioGroup>
    </ADialog>
  </ACard>
</template>
<script setup lang="ts">
import { ElButton, ElRadio, ElRadioGroup, ElSwitch } from 'element-plus'
import ASearch from '@/components/ASearch/index.vue'
import ATable from '@/components/ATable/index.vue'
import ACard from '@/components/ACard/index.vue'
import ADialog from '@/components/ADialog/index.vue'
import message from '@/utils/singleMessage'
import { tableOption } from './options/user'
import { ref, onMounted } from 'vue'
import { getUserListApi, toggleAdminApi, bindRoleApi } from '@/api/set/user'
import { getRoleApi } from '@/api/set/role'
const boxLoading = ref<boolean>(false)
const searchForm = ref<any>({})
const tableData = ref<any>([])
const pagination = ref<any>({
  currentPage: 1,
  pageSize: 15,
  total: 0
})
const refresh = async ({ done }) => {
  try {
    await getList()
  } finally {
    done()
  }
}

const roleList = ref<any>([])
const getRoleList = async () => {
  const res = await getRoleApi({ page: 1, size: 100 })
  if (res.success) {
    roleList.value = res.data.list
  }
}

onMounted(() => {
  getRoleList()
})
//获取分页数据
const getCarRentalOrderPage = async () => {
  const res = await getUserListApi({
    size: pagination.value.pageSize,
    page: pagination.value.currentPage,
    ...searchForm.value
  })
  if (res.success) {
    tableData.value = res.data.list.map((item: any) => ({
      ...item,
      isAdmin: item.role == 3 || item.role == 4 ? true : false,
      $editLoading: false
    }))
    pagination.value.total = res.data.total
  }
}
const getList = async () => {
  await Promise.all([getCarRentalOrderPage()])
}
//重置
const handleReset = () => {
  searchForm.value = {}
}
//搜索
const handleSearch = async ({ done }) => {
  pagination.value.currentPage = 1
  try {
    await getList()
  } finally {
    done()
  }
}

// 设为管理员
const changeStatus = async (row: any) => {
  console.log(row)
  try {
    const res = await toggleAdminApi({
      uid: row.uid,
      isAdmin: row.isAdmin
    })
    if (res.success) {
      message.success('操作成功')
    }
  } finally {
    getList()
  }
}

const roleDialog = ref<boolean>(false)
const checkRole = ref(0)
const checkUid = ref(0)
const bindRole = (row) => {
  checkUid.value = row.uid
  checkRole.value = row.roleId
  roleDialog.value = true
}

const handleClose = () => {
  checkRole.value = 0
}

const handleConfirm = async ({ done }) => {
  try {
    const res = await bindRoleApi({
      uid: checkUid.value,
      roleId: checkRole.value
    })
    if (res.success) {
      message.success('操作成功')
    }
    roleDialog.value = false
  } finally {
    getList()
    done()
  }
}
</script>

<style lang="scss" scoped></style>
