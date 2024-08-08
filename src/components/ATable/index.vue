<template>
  <section>
    <!-- 操作栏 -->
    <ElRow class="mb-10px">
      <ElCol class="dialogBts" :xs="24" :sm="24" :md="20" :lg="20" :xl="20">
        <ElButton
          :loading="addLoading"
          type="primary"
          v-if="tableConfig.addBtn"
          @click="handleAdd"
          v-permission="tableConfig.addBtnPermission ? tableConfig.addBtnPermission : 'show'"
        >
          <Icon icon="ep:plus" />
          <span>{{ t('common.add') }}</span>
        </ElButton>

        <slot name="btnSlot"></slot>
      </ElCol>
      <ElCol :xs="24" :sm="24" :md="4" :lg="4" :xl="4" v-if="tableConfig.showBtns">
        <div class="flex flex-items-center gap-10px justify-end">
          <div
            v-loading="refreshLoading"
            class="w-39px h-39px flex flex-items-center justify-center cursor-pointer transition-colors bg-[#F8F9FA] rd-[50%] hover:bg-[var(--el-color-primary-hover-10)]"
            @click="handleRefresh"
          >
            <img class="w-16px h-16px" src="@/assets/atable/shuaxin@2x.png" />
          </div>
          <!-- <div
            v-if="tableConfig.exportBtn"
            class="w-39px h-39px flex flex-items-center justify-center cursor-pointer transition-colors bg-[#F8F9FA] rd-[50%] hover:bg-[var(--el-color-primary-hover-10)]"
            @click="handleRefresh"
          >
            <img class="w-16px h-16px" src="@/assets/atable/daochu@2x.png" />
          </div> -->

          <ElPopover placement="bottom-start" trigger="click">
            <template #reference>
              <div
                class="w-39px h-39px flex flex-items-center justify-center cursor-pointer transition-colors bg-[#F8F9FA] rd-[50%] hover:bg-[var(--el-color-primary-hover-10)]"
              >
                <img class="w-16px h-16px" src="@/assets/atable/shezhi@2x.png" />
              </div>
            </template>
            <ElScrollbar>
              <div class="flex item-center h-32px borderline">
                <ElCheckbox v-model="settingCheckAll" :indeterminate="isIndeterminate" @change="handleChangeCheckAll">
                  <div class="color-[rgba(0,0,0,.85)]">列展示</div>
                </ElCheckbox>
              </div>
              <ElCheckboxGroup v-model="settingChecked">
                <div style="max-height: 300px">
                  <div v-for="menu in column" :key="menu.prop">
                    <ElCheckbox :value="menu.prop">
                      <div class="settingtext">
                        {{ menu.label }}
                      </div>
                    </ElCheckbox>
                  </div>
                </div>
              </ElCheckboxGroup>
            </ElScrollbar>
          </ElPopover>
        </div>
      </ElCol>
    </ElRow>

    <!-- 多选 -->
    <section class="mb-10px">
      <ElAlert type="warning" :closable="false" v-if="tableConfig.selection">
        <template #title>
          <div class="flex items-center ml-[-10px]">
            <Icon icon="ep:warning" />
            <span class="ml-5px">{{ t('common.selected') }} {{ selectionList.length }} {{ t('common.item') }}</span>
            <ElButton type="primary" link class="ml-40px" size="small" @click="selectionClear" v-if="selectionList.length !== 0">{{
              t('common.empty')
            }}</ElButton>
          </div>
        </template>
      </ElAlert>
    </section>

    <section class="mb-10px">
      <slot name="infoSlot"></slot>
    </section>

    <ElTable
      v-loading="tableLoading"
      :stripe="tableConfig.stripe"
      :row-key="rowKey"
      :tree-props="treeProps"
      :default-expand-all="defaultExpandAll"
      ref="tableRef"
      :border="tableConfig.border"
      @select-all="handleSelectAll"
      @select="handleSelectionChange"
      :size="tableConfig.size"
      :header-cell-style="{ background: '#f4f4f4', color: 'rgba(0, 0, 0, 0.85)' }"
      :data="tableData"
      class="table-Title"
    >
      <template #empty>
        <ElEmpty />
      </template>
      <!-- 多选 -->
      <ElTableColumn v-if="tableConfig.selection" type="selection" />
      <!-- 序号 -->
      <ElTableColumn
        v-if="tableConfig.index"
        type="index"
        :label="tableConfig.indexLabel ? tableConfig.indexLabel : t('common.index')"
        :width="tableConfig.indexWidth ? tableConfig.indexWidth : 70"
        :fixed="tableConfig.indexFixed"
        :align="tableConfig.align"
      />

      <template v-for="col of column.filter((item) => item.tableDisplay)" :key="col.prop">
        <ElTableColumn
          :min-width="col.minWidth ? col.minWidth : 100"
          :show-overflow-tooltip="col.showTooltip === false ? false : true"
          :label="col.label"
          :width="col.width"
          :align="col.align ? col.align : tableConfig.align"
          :prop="col.prop"
        >
          <template #default="{ row, index }">
            <div v-if="col.slot"><slot :name="col.prop" :row="row" :index="index"></slot></div>
            <div v-else-if="col.formatter">{{ col.formatter(row) }}</div>
            <div v-else-if="col.type == 'select' && !col.tag">{{ col.dicData?.find((item) => item.value == row[col.prop])?.label }}</div>
            <div v-else-if="col.type == 'select' && col.tag">
              <ElTag :type="col.dicData?.find((item) => item.value == row[col.prop])?.tagType || undefined">
                {{ col.dicData?.find((item) => item.value == row[col.prop])?.label }}
              </ElTag>
            </div>
            <div v-else-if="col.type == 'img'">
              <div class="img cursor-zoom-in" v-if="row[col.prop]">
                <img :src="row[col.prop]" @click="handleViewImg(row[col.prop])" />
              </div>
            </div>
          </template>
        </ElTableColumn>
      </template>

      <!-- 操作栏 -->
      <template v-if="tableConfig.menu">
        <ElTableColumn
          :label="t('common.operate')"
          :align="tableConfig.align"
          v-slot="{ row }"
          fixed="right"
          :width="tableConfig.menuWidth ? `${tableConfig.menuWidth}px` : '120px'"
        >
          <ElButton
            type="primary"
            link
            :disabled="row.$editDisabled"
            :loading="row.$editLoading"
            size="default"
            @click="handleEdit(row)"
            v-if="tableConfig.editBtn"
            v-permission="tableConfig.editBtnPermission ? tableConfig.editBtnPermission : 'show'"
          >
            <span>{{ t('common.edit') }}</span>
          </ElButton>
          <ElPopconfirm
            class="popconfirm"
            :title="t('common.delSure')"
            @confirm="handleDelete(row)"
            v-if="tableConfig.delBtn"
            ,
            :confirm-button-text="t('common.ok')"
            :cancel-button-text="t('common.cancel')"
          >
            <template #reference>
              <ElButton
                :disabled="row.$deleteDisabled"
                type="primary"
                :loading="row.$deleteLoading"
                link
                size="default"
                v-permission="tableConfig.delBtnPermission ? tableConfig.delBtnPermission : 'show'"
              >
                <span>{{ t('common.del') }}</span>
              </ElButton>
            </template>
          </ElPopconfirm>
          <ElButton type="primary" link :loading="row.$viewLoading" size="default" @click="handleView(row)" v-if="tableConfig.viewBtn">
            <span>{{ t('common.lookDetail') }}</span>
          </ElButton>
          <slot name="menuSlot" :row="row"></slot>
        </ElTableColumn>
      </template>
      <slot name="append"></slot>
    </ElTable>

    <!-- 分页 -->
    <section class="flex justify-center mt-20px" v-if="tableData.length !== 0 && tableConfig.showPagination">
      <ElPagination
        v-model:current-page="paginationCom.currentPage"
        v-model:page-size="paginationCom.pageSize"
        :page-sizes="paginationConfig?.pageSizes || [15, 30, 45, 60]"
        :small="paginationConfig?.small || false"
        :background="true"
        :layout="paginationConfig?.layout || defaultLayout"
        :total="paginationCom.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </section>

    <ADialog v-model:show="isShowImg" width="600px" :title="t('10232')" closeOnClickModal>
      <div class="w-100% flex items-center justify-center">
        <img class="w-100%" :src="currentImg" />
      </div>
      <template #footer>
        <ElButton @click="isShowImg = false">
          <span>{{ t('common.closeTab') }}</span>
        </ElButton>
      </template>
    </ADialog>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { IColumn, ITableOption } from './CrudTypes'
import {
  ElAlert,
  ElButton,
  ElPagination,
  ElTable,
  ElTableColumn,
  ElPopconfirm,
  ElPopover,
  ElScrollbar,
  ElCheckboxGroup,
  ElCheckbox,
  ElTag,
  ElEmpty,
  ElCol,
  ElRow
} from 'element-plus'
import ADialog from '@/components/ADialog/indexV2.vue'
import { isMobile } from '@/utils/util'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()
const props = defineProps<{
  options: ITableOption
  modelValue: any[]
  selection?: any[]
  rowKey?: string
  defaultExpandAll?: boolean
  treeProps?: {
    children: string
    hasChildren: string
  }
  pagination?: {
    currentPage: number
    pageSize: number
    total: number
  }
}>()

const emit = defineEmits([
  'update:modelValue',
  'update:pagination',
  'update:selection',
  'show-edit',
  'show-add',
  'show-view',
  'refresh',
  'delete',
  'fetch',
  'actived'
])
const tableData = ref<any>([])
const selectionList = ref<any[]>([])
const tableRef = ref<InstanceType<typeof ElTable>>()
const addLoading = ref(false)
const refreshLoading = ref(false)
const tableLoading = ref(false)
const paginationCom = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
})
const isShowImg = ref(false)
const currentImg = ref('')

const defaultLayout = isMobile() ? 'total, prev, pager, next' : 'total, sizes, prev, pager, next, jumper'

const paginationConfig = computed(() => {
  return props.options.tableConfig.paginationConfig
})

// 同步表格数据
watch(
  () => props.modelValue,
  (val) => {
    if (JSON.stringify(val) !== JSON.stringify(tableData.value)) {
      tableData.value = val.map((item) => ({
        ...item,
        $editLoading: false,
        $viewLoading: false,
        $deleteLoading: false
      }))
    }
  },
  { deep: true, immediate: true }
)
watch(
  tableData,
  (value) => {
    emit('update:modelValue', value)
  },
  { deep: true }
)

watch(
  selectionList,
  (value) => {
    emit('update:selection', value)
  },
  { deep: true }
)

// 同步分页数据
if (props.pagination) {
  watch(
    props.pagination,
    (val) => {
      if (val.total !== paginationCom.value.total) {
        paginationCom.value = val
      }
    },
    {
      deep: true
    }
  )
}

const tableConfig = computed(() => {
  return {
    ...props.options.tableConfig,
    showPagination: props.options.tableConfig.hasOwnProperty('showPagination') ? props.options.tableConfig.showPagination : true,
    showBtns: props.options.tableConfig.hasOwnProperty('showBtns') ? props.options.tableConfig.showBtns : true
  }
})

let initColumn = props.options.column
  .map((item) => ({
    ...item,
    type: item.hasOwnProperty('tableType') ? item.tableType : item.type,
    editDisplay: item.hasOwnProperty('editDisplay') ? item.editDisplay : true,
    addDisplay: item.hasOwnProperty('addDisplay') ? item.addDisplay : true,
    tableDisplay: item.hasOwnProperty('tableDisplay') ? item.tableDisplay : true,
    isTableColumn: item.hasOwnProperty('isTableColumn') ? item.isTableColumn : true
  }))
  .filter((item) => item.isTableColumn)

const column = ref<IColumn[]>([])
column.value = initColumn

// 设置图标操作-start
const settingCheckAll = ref(false)
const settingChecked = ref<any[]>([])
const isIndeterminate = ref(true)

if (tableConfig.value.fixedData) {
  settingChecked.value = JSON.parse(localStorage.getItem('settingCheckedList') as string) || [
    'code',
    'l_zhCN',
    'l_en',
    'l_zhTW',
    'l_th',
    'l_km',
    'l_fr',
    'l_ko'
  ]
} else {
  settingChecked.value = column.value.map((item) => item.prop)
}

watch(
  settingChecked,
  (val) => {
    const checkedCount = val.length
    settingCheckAll.value = checkedCount === column.value.length
    isIndeterminate.value = checkedCount > 0 && checkedCount < column.value.length
    // column.value.forEach((item) => {
    //   item.tableDisplay = val.includes(item.prop)
    // })
    if (tableConfig.value.fixedData) {
      localStorage.setItem('settingCheckedList', JSON.stringify(val))
    }
  },
  { deep: true, immediate: true }
)
const handleChangeCheckAll = (val) => {
  settingChecked.value = val ? column.value.map((item) => item.prop) : []
}
// 设置图标操作-end

const handleAdd = () => {
  addLoading.value = true
  emit('show-add', {
    done: () => {
      addLoading.value = false
    }
  })
}

onMounted(() => {
  tableLoading.value = true
  emit('fetch', {
    done: () => {
      tableLoading.value = false
    }
  })
})

const handleEdit = (row) => {
  row.$editLoading = true
  emit('show-edit', {
    row,
    done: () => {
      row.$editLoading = false
    }
  })
}

const handleDelete = (row) => {
  row.$deleteLoading = true
  emit('delete', {
    row,
    done: () => {
      row.$deleteLoading = false
    }
  })
}

const handleView = (row) => {
  row.$viewLoading = true
  emit('show-view', {
    row,
    done: () => {
      row.$viewLoading = false
    }
  })
}

const refreshSelection = () => {
  if (selectionList.value.length > 0) {
    tableData.value.forEach((item) => {
      tableRef.value!.toggleRowSelection(item, selectionList.value.find((i) => i.id === item.id) ? true : false)
    })
  }
}

const handleRefresh = () => {
  refreshLoading.value = true
  tableLoading.value = true
  emit('refresh', {
    done: () => {
      refreshLoading.value = false
      tableLoading.value = false
      refreshSelection()
    }
  })
}

const selectionClear = () => {
  tableRef.value!.clearSelection()
  selectionList.value = []
}

const handleSelectAll = (val) => {
  if (val.length == 0) {
    tableData.value.forEach((item) => {
      selectionList.value = selectionList.value.filter((i) => i.id !== item.id)
    })
    return
  }
  val.forEach((item) => {
    if (!selectionList.value.find((i) => i.id === item.id)) {
      selectionList.value.push(item)
    }
  })
}

const handleSelectionChange = (val, row) => {
  if (val.includes(row)) {
    selectionList.value.push(row)
  } else {
    selectionList.value = selectionList.value.filter((item) => item.id !== row.id)
  }
}

const handleSizeChange = (size: number) => {
  paginationCom.value.pageSize = size
  emit('update:pagination', paginationCom.value)
  handleRefresh()
}

const toggleSelection = (row: any, type: boolean) => {
  tableRef.value!.toggleRowSelection(row, type)
}

const toggleSelectionList = (item, add) => {
  if (add) {
    selectionList.value.push(item)
    return
  } else {
    selectionList.value = selectionList.value.filter((i) => i.id !== item.id)
  }
}

const handleViewImg = (url) => {
  currentImg.value = url
  isShowImg.value = true
}

const handleCurrentChange = (page: number) => {
  paginationCom.value.currentPage = page
  emit('update:pagination', paginationCom.value)
  handleRefresh()
}

defineExpose({
  toggleSelection,
  toggleSelectionList,
  selectionClear
})
</script>

<style>
.el-popper {
  word-break: break-word !important;
}
</style>

<style lang="less" scoped>
.borderline {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
.settingtext {
  font-weight: normal;
  color: rgba(0, 0, 0, 0.85);
}
.dialogBts {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}
@media screen and (max-width: 600px) {
  .dialogBts {
    gap: 5px;
  }
}
.img {
  width: 120px;
  height: 120px;
  & > img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
}

:deep(.el-table__header) {
  .cell {
    word-break: break-word;
  }
}
</style>
