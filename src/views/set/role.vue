<template>
  <ACard>
    <div>
      <ATable
        :options="tableOption"
        v-model="tableData"
        @refresh="refresh"
        @fetch="refresh"
        @show-edit="showEdit"
        @delete="handleDelete"
        @show-add="handleAdd"
      >
        <template #type="{ row }">
          <span v-if="row.type == 1">菜单</span>
          <span v-if="row.type == 2 && row.isButton">按钮</span>
          <span v-if="row.type == 2 && !row.isButton">接口</span>
        </template>
        <template #menuSlot="{ row }">
          <ElButton type="primary" :loading="row.$addPermissionLoading" link size="default" @click="addPermission(row)">+ 权限</ElButton>
        </template>
      </ATable>
    </div>
    <ADialog
      v-model="editForm"
      :center="false"
      width="450px"
      v-model:show="showDialog"
      @confirm="handleAddRole($event)"
      :title="dialogTitle"
      :column="dialogColumn"
    />

    <ADialog :center="false" top="10vh" width="500px" v-model:show="addPermissionDialog" title="分配权限">
      <template #default>
        <div>
          <ElTree show-checkbox ref="treeRef" :data="allPermission" node-key="id" :props="defaultProps" :default-checked-keys="defaultCheckKeys" />
        </div>
      </template>
      <template #footer>
        <ElButton @click="addPermissionDialog = false">
          <span>取消</span>
        </ElButton>
        <ElButton type="primary" @click="checkAll">
          <span>一键全选</span>
        </ElButton>
        <ElButton type="primary" @click="bindRoleConfirm" :loading="saveBtnLoading">
          <span>保存</span>
        </ElButton>
      </template>
    </ADialog>
  </ACard>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { tableOption } from './options/role'
import ATable from '@/components/ATable/index.vue'
import ADialog from '@/components/ADialog/index.vue'
import { ElButton, ElTree } from 'element-plus'
import {
  getRoleApi,
  getPermissionByRoleIdApi,
  addRoleApi,
  bindRoleWithPermissionApi,
  deleteRoleApi,
  editRoleApi,
  getRolePermissionListApi
} from '@/api/set/role'
import singleMessage from '@/utils/singleMessage'
import ACard from '@/components/ACard/index.vue'
import { getAllNodeIds } from '@/utils'

const dialogColumn = ref(tableOption.column)

const showDialog = ref(false)
const editForm = ref<any>({})
const dialogTitle = ref('')
const tableData = ref<any>([])
const allPermission = ref<any>([])
const addPermissionDialog = ref(false)
const defaultCheckKeys = ref<any>([])
const clickedRow = ref<any>({})
const treeRef = ref<InstanceType<typeof ElTree>>()
const saveBtnLoading = ref(false)
const currentBindPer = ref<any>([])

const defaultProps = {
  children: 'children',
  label: 'name'
}

const handleAdd = ({ done }: any) => {
  done()
  editForm.value = {}
  showDialog.value = true
  dialogTitle.value = '新增'
}

const refresh = async ({ done }: any) => {
  try {
    await getList()
  } finally {
    done()
  }
}

const showEdit = ({ row, done }: any) => {
  editForm.value = {
    ...row
  }
  done()
  showDialog.value = true
  dialogTitle.value = '编辑'
}

const handleDelete = async ({ row, done }: any) => {
  try {
    const res = await deleteRoleApi(row.id)
    if (res.success) {
      singleMessage.success('操作成功')
      await getList()
    }
  } finally {
    done()
  }
}

const getList = async () => {
  const result = await getRoleApi({ page: 1, size: 100 })
  if (result.success) {
    tableData.value = result.data.list.map((item: any) => ({
      ...item,
      $addPermissionLoading: false
    }))
  }
}

const handleAddRole = async ({ done }: any) => {
  try {
    const options: any = {
      name: editForm.value.name,
      code: editForm.value.code
    }
    let request = addRoleApi
    if (editForm.value.id) {
      options.id = editForm.value.id
      request = editRoleApi
    }
    const res = await request(options)
    if (res.success) {
      showDialog.value = false
      singleMessage.success('操作成功')
      await getList()
    }
  } finally {
    done()
  }
}

const getAllPermission = async () => {
  const permissionListRes = await getRolePermissionListApi({})
  if (permissionListRes.success) {
    allPermission.value = permissionListRes.data
  }
}

const getRolePermission = async (id: number) => {
  const rolePermission = await getPermissionByRoleIdApi(id)
  if (rolePermission.success) {
    currentBindPer.value = rolePermission.data
  }
}

const addPermission = async (row: any) => {
  row.$addPermissionLoading = true
  clickedRow.value = { ...row }
  try {
    await Promise.all([getRolePermission(row.id), getAllPermission()])
    addPermissionDialog.value = true
    await nextTick()
    renderBindKeys()
  } finally {
    row.$addPermissionLoading = false
  }
}

const renderBindKeys = () => {
  treeRef.value?.setCheckedKeys([])
  const menuIds = currentBindPer.value
  menuIds.forEach((i: any) => {
    const node = treeRef.value?.getNode(i)
    if (node && node.isLeaf) {
      treeRef.value?.setChecked(node, true, true)
    }
  })
}

const checkAll = () => {
  const allIds = getAllNodeIds(allPermission.value)
  treeRef.value?.setCheckedKeys(allIds)
}

const bindRoleConfirm = async () => {
  try {
    saveBtnLoading.value = true
    const checkedKeys = treeRef.value?.getCheckedKeys() || []
    const parentCheckedKeys = treeRef.value?.getHalfCheckedKeys() || []
    const result = await bindRoleWithPermissionApi({
      roleId: clickedRow.value.id,
      permissionIds: [...checkedKeys, ...parentCheckedKeys]
    })
    if (result.success) {
      singleMessage.success('操作成功')
      addPermissionDialog.value = false
    }
  } finally {
    saveBtnLoading.value = false
  }
}
</script>

<style lang="less" scoped></style>
