<template>
  <div :style="{ width }">
    <ElSelect
      :disabled="disabled"
      :style="{ width: '100%' }"
      v-model="selectVal"
      filterable
      ref="selectRef"
      remote
      :clearable="clearable"
      :placeholder="placeholder"
      :multiple="multiple"
      @clear="handleClear"
      :default-first-option="true"
      @input="handleInput"
      remote-show-suffix
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
    >
      <ElOption v-for="option in dicData" :key="option.label" :label="option.label" :value="option.value" />
    </ElSelect>
  </div>
</template>

<script lang="ts">
import { ElSelect, ElOption } from 'element-plus'
import { defineComponent, ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()

const dicData: any[] = []
const domList: any[] = []

export default defineComponent({
  components: {
    ElSelect,
    ElOption
  },
  props: {
    disablePagination: {
      type: Boolean,
      default: false
    },
    pageSize: {
      type: Number,
      default: 20
    },
    placeholder: {
      type: String,
      default: t('common.selectText')
    },
    disabled: {
      type: Boolean,
      default: false
    },
    initDic: {
      type: Array,
      default: () => []
    },
    modelValue: {
      type: [Number, String, Array],
      default: null
    },
    request: {
      type: Function,
      required: true
    },
    labelKey: {
      type: String,
      default: 'name'
    },
    valueKey: {
      type: String,
      default: 'id'
    },
    clearable: {
      type: Boolean,
      default: true
    },
    multiple: {
      type: Boolean,
      default: false
    },
    searchKey: {
      type: String,
      default: 'name'
    },
    params: {
      type: Object,
      default: () => ({})
    },
    width: {
      type: String,
      default: '100%'
    },
    format: {
      type: Function,
      default: (data: any[]) => {
        return data
      }
    }
  },
  setup() {
    const selectRef = ref()
    return { selectRef }
  },
  data() {
    return {
      loadmoreLoading: false,
      domList: domList,
      dicData: dicData,
      loadFinished: false,
      selectVal: this.multiple ? [] : '',
      query: '',
      pagination: {
        currentPage: 1,
        pageSize: 20
      }
    }
  },
  watch: {
    modelValue: {
      handler(val) {
        this.selectVal = val
      },
      immediate: true
    }
  },
  mounted() {
    this.dicData = this.initDic
    this.pagination.pageSize = this.pageSize
  },
  methods: {
    uniqueArray(array, field) {
      const uniqueMap = new Map()
      array.forEach((obj) => {
        const key = obj[field]
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, obj)
        }
      })
      return Array.from(uniqueMap.values())
    },
    handleChange(val) {
      this.$emit('change', val)
      this.$emit('update:modelValue', val)
    },
    handleClear() {
      this.query = ''
      this.pagination.currentPage = 1
      this.loadFinished = false
      this.selectVal = this.multiple ? [] : ''
      this.$emit('change', '')
      this.$emit('update:modelValue', '')
      this.dicData = []
      setTimeout(() => {
        this.selectRef.blur()
      }, 50)
    },
    handleBlur() {
      this.removeLoadMoreListener()
      if (!this.selectVal) {
        this.query = ''
        this.pagination.currentPage = 1
        this.loadFinished = false
        this.dicData = []
      }
    },
    removeLoadMoreListener() {
      if (this.domList.length > 0) {
        this.domList.forEach((dom: HTMLInputElement) => {
          dom.removeEventListener('scroll', () => {})
        })
      }
    },
    handleFocus() {
      if (!this.selectVal) {
        this.dicData = []
      }
      this.loadFinished = false
      this.pagination.currentPage = 1
      this.addLoadMoreListener()
      // if (this.dicData.length > 0) return
      this.fetchData()
    },
    handleInput() {
      if (this.disablePagination) return
      const query = this.selectRef.selectedLabel
      this.loadFinished = false
      this.pagination.currentPage = 1
      this.query = query
      this.fetchData()
    },
    addLoadMoreListener() {
      setTimeout(() => {
        const domList = document.querySelectorAll("[class='el-select-dropdown__wrap el-scrollbar__wrap el-scrollbar__wrap--hidden-default']")
        this.domList = Array.from(domList)
        this.domList.forEach((dom) => {
          dom.addEventListener('scroll', (e: Event) => {
            const target = e.target as HTMLInputElement
            const condition = target.scrollHeight - target.scrollTop - 5 <= target.clientHeight
            if (condition) {
              this.loadMore()
            }
          })
        })
      }, 20)
    },
    async loadMore() {
      if (this.loadmoreLoading || this.loadFinished) return
      try {
        this.loadmoreLoading = true
        await this.fetchData()
      } finally {
        this.loadmoreLoading = false
      }
    },
    async fetchData() {
      const result = await this.request({
        [this.searchKey]: this.query,
        offset: (this.pagination.currentPage - 1) * this.pagination.pageSize,
        size: this.pagination.pageSize,
        ...this.params
      })
      if (result.code == 0) {
        if (!result.data || result.data.length == 0) {
          this.loadFinished = true
        }
        let fetchData = result.data || []
        fetchData = this.format(fetchData)
        fetchData =
          fetchData?.map((item) => ({
            label: item[this.labelKey],
            value: item[this.valueKey]
          })) || []
        if (this.pagination.currentPage == 1) {
          this.dicData = this.uniqueArray(this.initDic.concat(fetchData), 'value')
        } else {
          this.dicData = this.uniqueArray(this.dicData.concat(fetchData), 'value')
        }
        this.pagination.currentPage++
      }
    }
  }
})
</script>

<style lang="less" scoped></style>
