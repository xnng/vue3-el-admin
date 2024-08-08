<template>
  <ElForm :inline="true">
    <ElFormItem
      :style="`${isMobile() ? 'width: 100%' : ''}`"
      v-for="item of searchColumn"
      :key="item.label"
      :label="item.searchLable ? item.searchLable : item.label"
      :label-width="searchLabelWidth ? searchLabelWidth : item.searchLabelWidth"
    >
      <template v-if="item.searchSlot">
        <slot :name="item.prop"></slot>
      </template>
      <ElInput
        v-if="['text', 'number'].includes(item.type) && !item.searchSlot"
        :placeholder="`${t('common.inputText')} ${item.label}`"
        :clearable="item.clearable ? item.clearable : true"
        @clear="searchValue[item.prop] = ''"
        v-model="searchValue[item.prop]"
        :disabled="item.searchDisabled"
        :style="`width: ${item.searchWidth ? item.searchWidth : 240}px`"
        :class="[isMobile() && 'mobile-searchitem']"
      />

      <ElSelect
        v-if="item.type == 'select' && !item.searchSlot"
        v-model="searchValue[item.prop]"
        :clearable="item.clearable ? item.clearable : true"
        @clear="searchValue[item.prop] = ''"
        :placeholder="`${t('common.selectText')} ${item.label}`"
        :disabled="item.searchDisabled"
        :style="`width: ${item.searchWidth ? item.searchWidth : 240}px`"
        :class="[isMobile() && 'mobile-searchitem']"
      >
        <ElOption v-for="option in item.dicData" :key="option.label" :label="option.label" :value="option.value" />
      </ElSelect>
      <ElDatePicker
        v-if="['date', 'datetime'].includes(item.type) && !item.searchSlot"
        v-model="searchValue[item.prop]"
        :type="item.type ? item.type : 'date'"
        :clearable="item.clearable ? item.clearable : true"
        :disabled="item.searchDisabled"
        @clear="searchValue[item.prop] = ''"
        :value-format="item.valueFormat ? item.valueFormat : 'YYYY-MM-DD HH:mm:ss'"
        :placeholder="`${t('common.selectText')} ${item.label}`"
        :style="`width: ${item.searchWidth ? item.searchWidth : 240}px`"
        :class="[isMobile() && 'mobile-searchitem']"
      />
      <ElDatePicker
        v-if="item.type == 'daterange' && !item.searchSlot"
        v-model="searchValue[item.prop]"
        :type="item.type ? item.type : 'date'"
        :clearable="item.clearable ? item.clearable : true"
        :disabled="item.searchDisabled"
        :value-format="item.valueFormat ? item.valueFormat : 'YYYY-MM-DD HH:mm:ss'"
        @clear="searchValue[item.prop] = []"
        :placeholder="`${t('common.selectText')} ${item.label}`"
        :style="`width: ${item.searchWidth ? item.searchWidth : 240}px`"
        :class="[isMobile() && 'mobile-searchitem']"
        :range-separator="t('common.to')"
        :start-placeholder="t('common.startTimeText')"
        :end-placeholder="t('common.endTimeText')"
        :default-time="[dayjs(searchValue[item.prop]).startOf('day').toDate(), dayjs(searchValue[item.prop]).endOf('day').toDate()]"
      />
      <ElDatePicker
        v-if="item.type == 'datetimerange' && !item.searchSlot"
        v-model="searchValue[item.prop]"
        :type="item.type ? item.type : 'date'"
        :placeholder="`${t('common.selectText')} ${item.label}`"
        :disabled="item.searchDisabled"
        :value-format="item.valueFormat ? item.valueFormat : 'YYYY-MM-DD HH:mm:ss'"
        :clearable="item.clearable ? item.clearable : true"
        @clear="searchValue[item.prop] = []"
        :style="`width: ${item.searchWidth ? item.searchWidth : 340}px`"
        :class="[isMobile() && 'mobile-searchitem']"
        :range-separator="t('common.to')"
        :start-placeholder="t('common.startTimeText')"
        :end-placeholder="t('common.endTimeText')"
        :default-time="[dayjs(searchValue[item.prop]).startOf('day').toDate(), dayjs(searchValue[item.prop]).endOf('day').toDate()]"
      />
    </ElFormItem>
    <ElFormItem :style="`${isMobile() ? 'width: 100%' : ''}`">
      <div :class="[isMobile() && 'mobile-searchbtn']">
        <ElButton type="primary" @click="handleSearch" :loading="searchLoading">
          <Icon icon="ep:search" />
          <span>{{ t('common.query') }}</span>
        </ElButton>
        <ElButton type="info" @click="resetForm">
          <Icon icon="ep:delete" />
          <span>{{ t('common.reset') }}</span>
        </ElButton>
      </div>
    </ElFormItem>
  </ElForm>
</template>

<script lang="ts" setup>
import { ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElButton, ElDatePicker } from 'element-plus'
import { ref, computed, watch } from 'vue'
import { ITableOption } from '../ATable/CrudTypes'
import { isMobile } from '@/utils/util'
import { useI18n } from '@/hooks/web/useI18n'
import dayjs from 'dayjs'

const { t } = useI18n()
const props = defineProps<{
  options: ITableOption
  modelValue: any
}>()

const emit = defineEmits(['search', 'reset', 'update:modelValue'])

const searchValue = ref({})
const searchLoading = ref(false)

// 和父组件的数据同步
watch(
  props.modelValue,
  (val) => {
    searchValue.value = val
  },
  { deep: true, immediate: true }
)
watch(
  searchValue,
  (value) => {
    emit('update:modelValue', value)
  },
  { deep: true }
)

const searchLabelWidth = computed(() => {
  return props.options.tableConfig.searchLabelWidth
})

const handleSearch = () => {
  searchLoading.value = true
  emit('search', {
    done: () => {
      searchLoading.value = false
    }
  })
}

const searchColumn = computed(() => {
  return props.options.column
    .map((item: any) => ({
      ...item,
      type: item.type ? (['text', 'number'].includes(item.type) ? 'text' : item.type) : 'text',
      searchLabelWidth: item.searchLabelWidth ? item.searchLabelWidth : 68
    }))
    .filter((item: any) => item.search)
    .sort((prev, next) => prev.searchSort - next.searchSort)
})

const resetForm = () => {
  searchValue.value = {}
  emit('reset')
}
</script>

<style scoped lang="less">
:deep(.el-form-item) {
  margin-right: 20px;
}
.mobile {
  &-searchitem {
    width: 100% !important;
  }
  &-searchbtn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
:deep(.el-form-item__label) {
  padding: 5px;
}
</style>
