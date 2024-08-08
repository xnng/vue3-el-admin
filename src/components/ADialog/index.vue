<template>
  <div v-if="visible">
    <ElDialog
      :title="title"
      :width="width"
      v-model="visible"
      :close-on-click-modal="closeOnClickModal"
      :center="center"
      @close="dialogClose"
      :top="top"
      :cancelText="cancelText"
    >
      <template #default>
        <slot name="default" v-if="slotContent"></slot>
        <div v-else>
          <ElForm ref="ruleFormRef" label-position="top" :model="editValue" :disabled="isView" :status-icon="false">
            <ElRow :gutter="40">
              <ElCol :span="col.span ? getSpan(col.span) : 12" v-for="col of editColumn" :key="col.prop">
                <ElFormItem
                  :label="col.editLabel"
                  :rules="col.rules(editValue, toRef(ruleFormRef))"
                  :prop="col.prop"
                  :label-width="col.editLabelWidth ? col.editLabelWidth : 100"
                >
                  <template v-if="col.editSlot">
                    <slot :name="col.prop"></slot>
                  </template>
                  <template v-if="col.editLabelSlot" #label>
                    <slot :name="`${col.prop} Label`"></slot>
                  </template>
                  <ElInput
                    v-if="['text', 'number'].includes(col.type) && !col.editSlot"
                    :placeholder="`请输入 ${col.label}`"
                    :clearable="col.clearable"
                    :maxlength="col.maxlength ? col.maxlength : ''"
                    :size="col.size ? col.size : 'default'"
                    :type="col.type"
                    v-model="editValue[col.prop]"
                    :style="`width: ${col.searchWidth ? `${col.searchWidth}px` : '100%'}`"
                    :disabled="isEdit && col.editDisabled"
                  >
                    <template #suffix v-if="col.suffix">{{ col.suffix }}</template>
                  </ElInput>

                  <ElDatePicker
                    v-if="['date'].includes(col.type) && !col.editSlot"
                    v-model="editValue[col.prop]"
                    type="date"
                    :clearable="col.clearable"
                    :placeholder="`请选择 ${col.label}`"
                    :style="`width: ${col.searchWidth ? `${col.searchWidth}px` : '100%'}`"
                    :disabled="isEdit && col.editDisabled"
                  />

                  <ElDatePicker
                    v-if="['datetime'].includes(col.type) && !col.editSlot"
                    v-model="editValue[col.prop]"
                    type="datetime"
                    :disabled-date="col.disabledDate"
                    :clearable="col.clearable"
                    :placeholder="`请选择 ${col.label}`"
                    :style="`width: ${col.searchWidth ? `${col.searchWidth}px` : '100%'}`"
                    :disabled="isEdit && col.editDisabled"
                  />

                  <ElInput
                    v-if="col.type == 'textarea' && !col.editSlot"
                    :placeholder="`请输入 ${col.label}`"
                    :clearable="col.clearable"
                    :size="col.size ? col.size : 'default'"
                    :maxlength="col.maxlength ? col.maxlength : ''"
                    :type="col.type"
                    :show-word-limit="col.maxlength ? true : false"
                    :autosize="{
                      minRows: col?.textAreaConfig?.minRows || 4,
                      maxRows: col?.textAreaConfig?.maxRows || 4
                    }"
                    v-model="editValue[col.prop]"
                    :style="`width: ${col.searchWidth ? `${col.searchWidth}px` : '100%'}`"
                    :disabled="isEdit && col.editDisabled"
                  >
                    <template #suffix v-if="col.suffix">{{ col.suffix }}</template></ElInput
                  >
                  <ElSelect
                    v-if="col.type == 'select' && !col.editSlot"
                    v-model="editValue[col.prop]"
                    :multiple="col.multiple"
                    :placeholder="`请选择 ${col.label}`"
                    :size="col.size ? col.size : 'default'"
                    :style="`width: ${col.searchWidth ? `${col.searchWidth}px` : '100%'}`"
                    :disabled="isEdit && col.editDisabled"
                  >
                    <ElOption v-for="option in col.dicData" :key="option.label" :label="option.label" :value="option.value" />
                  </ElSelect>
                  <ElRadioGroup
                    v-if="col.type == 'radio' && !col.editSlot"
                    v-model="editValue[col.prop]"
                    :size="col.size ? col.size : 'default'"
                    :style="`width: ${col.searchWidth ? `${col.searchWidth}px` : '100%'}`"
                    :disabled="isEdit && col.editDisabled"
                  >
                    <ElRadio v-for="option in col.dicData" :key="option.label" :label="option.value">
                      {{ option.label }}
                    </ElRadio>
                  </ElRadioGroup>
                </ElFormItem>
              </ElCol>
            </ElRow>
          </ElForm>
        </div>
      </template>
      <template #footer>
        <slot name="footer" v-if="slotFooter"></slot>
        <div v-else>
          <ElButton @click="dialogClose">
            <span>{{ cancelText }}</span>
          </ElButton>
          <ElButton type="primary" @click="dialogConfirm" :loading="confirmLoading">
            <span>{{ confirmText }}</span>
          </ElButton>
        </div>
      </template>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
import {
  ElButton,
  ElDialog,
  ElForm,
  ElRow,
  ElCol,
  ElInput,
  ElFormItem,
  ElSelect,
  ElOption,
  ElRadioGroup,
  ElRadio,
  FormInstance,
  ElDatePicker
} from 'element-plus'
import { PropType, computed, useSlots, watch } from 'vue'
import { ref } from 'vue'
import { IColumn } from '../ATable/CrudTypes'
import { toRef } from 'vue'
import { notNull } from '@/utils/validate'
import { isMobile } from '@/utils'

const props = defineProps({
  column: { type: Array as PropType<IColumn[]>, default: () => [] },
  modelValue: { type: Object, default: () => ({}) },
  title: { type: String, default: '' },
  isEdit: Boolean,
  show: Boolean,
  closeOnClickModal: { type: Boolean, default: false },
  width: { type: String, default: '40%' },
  top: { type: String, default: '10vh' },
  center: { type: Boolean, default: false },
  cancelText: { type: String, default: '取消' },
  confirmText: { type: String, default: '确定' },
  isView: { type: Boolean, default: false }
})
const slotFooter = !!useSlots().footer
const slotContent = !!useSlots().default
const emit = defineEmits(['update:modelValue', 'update:show', 'close', 'confirm', 'change'])
const editValue = ref<any>({})
const ruleFormRef = ref<FormInstance | null>(null)
const confirmLoading = ref(false)

// 同步显示状态
const visible = computed({
  get() {
    return props.show
  },
  set(val) {
    emit('update:show', val)
  }
})

// 同步表单数据
watch(
  () => props.modelValue,
  (val) => {
    if (JSON.stringify(val) !== JSON.stringify(editValue.value)) {
      editValue.value = val
    }
  },
  { deep: true, immediate: true }
)
watch(
  editValue,
  (val) => {
    emit('update:modelValue', val)
    emit('change', val)
  },
  { deep: true }
)

const generateRule = (item: IColumn) => {
  if (item.validate && item.validateTip) {
    return () => [
      {
        required: item.required,
        pattern: item.validate,
        trigger: ['blur', 'change'],
        message: item.validateTip
      }
    ]
  }
  if (item.validateTip && !item.validate) {
    return () => [
      {
        required: item.required,
        pattern: notNull(),
        trigger: ['blur', 'change'],
        message: item.validateTip
      }
    ]
  }
  return () => []
}

const editColumn = computed(() => {
  const value = props.column
    .map((item) => ({
      ...item,
      type: item.editType ? item.editType : item.type || 'text',
      rules: item.rules ? item.rules : generateRule(item),
      editLabel: item.hasOwnProperty('editLabel') ? item.editLabel : item.label,
      editSort: item.hasOwnProperty('editSort') ? item.editSort : 20,
      editDisplay: item.hasOwnProperty('editDisplay') ? item.editDisplay : true,
      addDisplay: item.hasOwnProperty('addDisplay') ? item.addDisplay : true
    }))
    .filter((item: any) => (props.isEdit ? item.editDisplay : item.addDisplay))
    .sort((prev, next) => (prev.editSort || 0) - (next.editSort || 0))
  return value
})

const dialogClose = () => {
  visible.value = false
  emit('close')
}

const getSpan = (span: number) => {
  return isMobile() ? 24 : span
}

const dialogConfirm = () => {
  const handleConfirm = () => {
    confirmLoading.value = true
    emit('confirm', {
      done: () => {
        confirmLoading.value = false
      }
    })
  }
  if (ruleFormRef.value) {
    ruleFormRef.value.validate((validate) => {
      if (validate) {
        handleConfirm()
      }
    })
  } else {
    handleConfirm()
  }
}

defineExpose({
  ruleFormRef
})
</script>

<style lang="less" scoped>
:deep(.el-dialog) {
  &__header {
    padding-right: 16px;
    margin-right: 0;
    border-bottom: 1px solid #f0f0f0;
    box-sizing: border-box;
    padding-left: 20px;
    padding-right: 20px;
  }
  &__headerbtn {
    right: 10px;
  }
  &__body {
    box-sizing: border-box;
    padding: 20px 20px;
  }

  &__footer {
    border-top: 1px solid #f0f0f0;
    box-sizing: border-box;
    padding-left: 20px;
    padding-right: 20px;
  }
}
:deep(.el-form-item__error) {
  position: initial;
  display: block;
  width: 100%;
}
</style>
