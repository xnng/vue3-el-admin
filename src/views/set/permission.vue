<template>
  <ACard>
    <div>
      <ATable
        :options="tableOption"
        v-model="tableData"
        ref="tableRefs"
        rowKey="id"
        :treeProps="{ children: 'children', hasChildren: 'hasChildren' }"
        @refresh="refresh"
        @fetch="refresh"
        @show-edit="showEdit"
        @delete="handleDelete"
        :default-expand-all="tableExpand"
        @show-add="handleAdd"
      >
        <template #btnSlot>
          <ElButton type="primary" @click="expandChange">{{ tableExpand ? '一键收起' : '一键展开' }}</ElButton>
        </template>
        <template #type="{ row }">
          <ElTag :type="renderType(row).tagType">{{ renderType(row).label }}</ElTag>
        </template>
        <template #key="{ row }">
          <div>
            <span>{{ row.key }}</span>
          </div>
        </template>
        <template #apis="{ row }">
          <div class="apibox">
            <div v-for="(item, index) of row.apis.filter((item: any) => item.type == 1)" :key="index" class="row">
              <div class="tags">
                <ElTag v-if="item.method == 'get'" type="success" size="small">GET</ElTag>
                <ElTag v-if="item.method == 'post'" type="warning" size="small">POST</ElTag>
                <ElTag v-if="item.method == 'put'" type="primary" size="small">PUT</ElTag>
                <ElTag v-if="item.method == 'delete'" type="danger" size="small">DEL</ElTag>
              </div>
              <span>{{ item.description }}</span>
              <span class="ml-[5px]">{{ item.url }}</span>
            </div>
          </div>
        </template>
        <template #menuSlot="{ row }">
          <ElButton type="primary" link size="default" @click="handBindApi(row)" :disabled="row.type != '2'"> 绑定接口 </ElButton>
          <ElButton type="primary" link size="default" @click="handAddChild(row)"> 新增子菜单 </ElButton>
        </template>
      </ATable>
    </div>
    <ADialog
      v-model="editForm"
      :center="false"
      width="450px"
      v-model:show="showDialog"
      @change="handleDialogChange"
      @confirm="handleConfirm($event)"
      :title="dialogTitle"
      :column="dialogColumn"
    />
    <ADialog :center="false" width="650px" v-model:show="showBindDialog" title="绑定接口">
      <template #default>
        <div>
          <ElTree show-checkbox ref="treeRef" :data="apiList" node-key="id" :props="defaultProps" :default-checked-keys="defaultCheckKeys">
            <template #default="{ data }">
              <span class="w-[53px]" v-if="data.method">
                <ElTag v-if="data.method == 'get'" type="success" size="small">GET</ElTag>
                <ElTag v-if="data.method == 'post'" type="warning" size="small">POST</ElTag>
                <ElTag v-if="data.method == 'put'" type="primary" size="small">PUT</ElTag>
                <ElTag v-if="data.method == 'delete'" type="danger" size="small">DEL</ElTag>
              </span>
              <span>{{ data.description }} </span>
              <span class="ml-[5px]" v-if="data.parentId !== -1"> {{ data.url }}</span>
            </template>
          </ElTree>
        </div>
      </template>
      <template #footer>
        <ElButton @click="showBindDialog = false">
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
import { ref, onMounted, nextTick } from 'vue'
import { tableOption } from './options/permission'
import ATable from '@/components/ATable/index.vue'
import ADialog from '@/components/ADialog/index.vue'
import { ElButton, ElTag, ElTree } from 'element-plus'
import {
  addPermissionApi,
  editPermissionApi,
  getPermissionApi,
  deletePermissionApi,
  bindPermissionApi,
  getPermissionApiListApi
} from '@/api/set/permission'
import singleMessage from '@/utils/singleMessage'
import { getAllNodeIds } from '@/utils'

const dialogColumn = ref(tableOption.column)
const showDialog = ref(false)
const showBindDialog = ref(false)
const editForm = ref<any>({})
const dialogTitle = ref('')
const tableData = ref<any>([])
const tableExpand = ref(true)
const parentId = ref(-1)
const apiList = ref<any>([])
const defaultProps = {
  children: 'children',
  label: 'description'
}

const handleAdd = ({ done }: any) => {
  done()
  editForm.value = {
    sort: 1,
    type: '1'
  }
  parentId.value = -1
  showDialog.value = true
  dialogTitle.value = '新增'
}
const tableRefs = ref<any>(null)
const expandChange = () => {
  tableExpand.value = !tableExpand.value
  tableData.value.forEach((item: any) => {
    tableRefs.value.$refs.tableRef.toggleRowExpansion(item, tableExpand.value)
  })
}
const renderType = (row: any): any => {
  let type = row.type
  const permissionTypeDic = [
    {
      label: '页面',
      tagType: undefined,
      value: '1'
    },
    {
      label: '功能',
      tagType: 'success',
      value: '2'
    },
    {
      label: '目录',
      value: '3',
      tagType: 'warning'
    }
  ]
  return permissionTypeDic.find((item) => item.value == type)
}

const refresh = async ({ done }: any) => {
  try {
    await getList()
    getApiList()
  } finally {
    done()
  }
}

const handleDialogChange = (val: any) => {
  const routerIndex = dialogColumn.value.findIndex((item) => item.prop == 'key')

  switch (val.type) {
    case '1': {
      dialogColumn.value[routerIndex].addDisplay = true
      dialogColumn.value[routerIndex].editDisplay = true
      break
    }
    case '2': {
      dialogColumn.value[routerIndex].addDisplay = false
      dialogColumn.value[routerIndex].editDisplay = false
      break
    }
    case '3': {
      dialogColumn.value[routerIndex].addDisplay = false
      dialogColumn.value[routerIndex].editDisplay = false
      break
    }
  }
}

const handAddChild = (row: any) => {
  editForm.value = {
    type: 1
  }
  editForm.value.type = '1'
  parentId.value = row.id
  showDialog.value = true
  dialogTitle.value = '新增子菜单'
}

const showEdit = ({ row, done }: any) => {
  editForm.value = {
    ...row
  }
  console.log(row, 'row')

  // if (row.type == 2) {
  //   editForm.value.type = row.isButton == 0 ? 2 : 3
  // }
  // parentId.value = editForm.value.parentId
  done()
  showDialog.value = true
  dialogTitle.value = '编辑'
}

const handleDelete = async ({ row, done }: any) => {
  try {
    const res = await deletePermissionApi(row.id)
    if (res.success) {
      singleMessage.success('操作成功')
      await getList()
    }
  } finally {
    done()
  }
}

const getList = async () => {
  const result = await getPermissionApi({})
  if (result.success) {
    tableData.value = result.data
  }
}

// 获取接口列表
const getApiList = async () => {
  const result = await getPermissionApiListApi()
  if (result.success) {
    apiList.value = result.data
  }
}

onMounted(() => {
  getApiList()
})

const handleConfirm = async ({ done }: any) => {
  try {
    const options: any = {
      pid: parentId.value,
      sort: editForm.value.sort,
      name: editForm.value.name,
      type: [2, 3].includes(editForm.value.type) ? 2 : editForm.value.type,
      router: editForm.value.key
    }
    let request = editPermissionApi

    if (editForm.value.id) {
      options.id = editForm.value.id
      request = editPermissionApi
    } else {
      request = addPermissionApi
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

const defaultCheckKeys = ref<any>([])
const currentBindPer = ref<any>([])
const handBindApi = async (row: any) => {
  parentId.value = row.id
  // defaultCheckKeys.value = row.apis.map((item) => item.id)
  currentBindPer.value = row.apis.map((item: any) => item.id)
  showBindDialog.value = true
  renderBindKeys()
}

const renderBindKeys = () => {
  treeRef.value?.setCheckedKeys([])
  const menuIds = currentBindPer.value
  menuIds.forEach((i: any) => {
    nextTick(() => {
      const node = treeRef.value?.getNode(i)
      if (node && node.isLeaf) {
        treeRef.value?.setChecked(node, true, true)
      }
    })
  })
}

const treeRef = ref<InstanceType<typeof ElTree>>()
const checkAll = () => {
  const allIds = getAllNodeIds(apiList.value)
  treeRef.value?.setCheckedKeys(allIds)
}

const saveBtnLoading = ref(false)
const bindRoleConfirm = async () => {
  saveBtnLoading.value = true
  const checkedKeys = treeRef.value?.getCheckedKeys() || []
  const parentCheckedKeys = treeRef.value?.getHalfCheckedKeys() || []
  try {
    const res = await bindPermissionApi({
      permissionId: parentId.value,
      apiIds: [...checkedKeys, ...parentCheckedKeys]
    })
    if (res.success) {
      singleMessage.success('操作成功')
      showBindDialog.value = false
      getList()
    }
  } finally {
    saveBtnLoading.value = false
  }
}
</script>

<style lang="less" scoped>
// .apibox {
//   max-height: 100px;
//   // overflow-y: auto;
// }
.row {
  display: flex;
  align-items: center;
  // margin: 5px 0;
}
.tags {
  width: 52px;
}
</style>
