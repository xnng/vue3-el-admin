import { FormInstance, FormItemRule } from 'element-plus'
import { Ref } from 'vue'

export interface IDicData {
  label: string
  value: string | number
  tagType?: '' | 'success' | 'info' | 'warning' | 'danger'
}

export interface IColumn {
  /**
   * 字段名称
   */
  label: string
  /**
   * 字段属性
   */
  prop: string
  /**
   * 是否可搜索
   */
  search?: boolean
  /**
   * 是否显示清除按钮
   */
  clearable?: boolean
  /**
   * 搜索label宽度，单位 px
   */
  searchLabelWidth?: number
  /**
   * 搜索内容宽度，单位 px
   */
  searchWidth?: number
  /**
   * 字段类型
   */
  type?: 'text' | 'textarea' | 'select' | 'date' | 'datetime' | 'daterange' | 'datetimerange' | 'radio' | 'img'

  /**
   * 是否多选
   */
  multiple?: boolean
  /**
   * 编辑字段类型
   */
  editType?: 'text' | 'textarea' | 'select' | 'date' | 'datetime' | 'daterange' | 'datetimerange' | 'radio'
  /**
   * 表格字段类型
   */
  tableType?: 'text' | 'select' | 'date' | 'datetime' | 'daterange' | 'datetimerange' | 'radio'
  /**
   * 表单校验规则
   */
  validate?: RegExp
  /**
   * 表单校验错误提示
   */
  validateTip?: string
  /**
   * 单位显示
   */
  suffix?: string
  /**
   * textarea 配置
   */
  textAreaConfig?: {
    /**
     * 最小行数
     */
    minRows?: number
    /**
     * 最大行数
     */
    maxRows?: number
  }
  /**
   * select/redio 类型的字段数据
   */
  dicData?: IDicData[]

  /**
   * 字段表格宽度
   */
  width?: number
  /**
   * 搜索字段排序
   */
  searchSort?: number
  /**
   * 编辑字段排序
   */
  editSort?: number
  /**
   * 对齐方式
   */
  align?: 'left' | 'center' | 'right'
  /**
   * 表格显示插槽
   */
  slot?: boolean
  /**
   * 编辑插槽
   */
  editSlot?: boolean
  /**
   * 搜索插槽
   */
  searchSlot?: boolean
  /**
   * 是否显示省略号
   */
  showTooltip?: boolean
  /**
   * 数据格式化
   */
  formatter?: (row: any) => any
  /**
   * 编辑时是否禁用
   */
  editDisabled?: boolean
  /**
   * 搜索时是否禁用
   */
  searchDisabled?: boolean
  /**
   * 编辑时是否显示
   */
  editDisplay?: boolean
  /**
   * 添加时是否显示
   */
  addDisplay?: boolean
  /**
   * 表格中是否显示
   */
  tableDisplay?: boolean
  /**
   * 编辑框栅格宽度
   */
  span?: number
  /**
   * 编辑框label宽度
   */
  editLabelWidth?: number
  /**
   * 编辑框label
   */
  editLabel?: string
  /**
   * 搜索框 label
   */
  searchLable?: string
  /**
   * 编辑框是否必填
   */
  required?: boolean
  /**
   * 组件大小
   */
  size?: 'large' | 'default' | 'small'
  /**
   * 文本框输入长度限制
   */
  maxlength?: number
  /**
   * 表单校验规则
   */
  rules?: (row: any, formRef: Ref<FormInstance | null>) => FormItemRule[]
  /**
   * 是否显示tag
   */
  tag?: boolean
  /**
   * 时间格式
   */
  valueFormat?: string
  /**
   * 是否自定义 edit label
   */
  editLabelSlot?: boolean
  /**
   * 是否是表格中的字段
   */
  isTableColumn?: boolean
  /**
   * 日期禁用函数
   */
  disabledDate?: (time: Date) => boolean
  /**
   * 最小宽度
   */
  minWidth?: number
}

export interface ITableOption {
  column: IColumn[]
  tableConfig: {
    /**
     * 是否显示斑马纹
     */
    stripe?: boolean
    /**
     * 是否显示表格边框
     */
    border?: boolean
    /**
     * 操作栏宽度
     */
    menuWidth?: number
    /**
     * 搜索label宽度
     */
    searchLabelWidth?: number
    /**
     * 尺寸
     */
    size?: 'large' | 'default' | 'small'
    /**
     * 是否展示多选
     */
    selection?: boolean
    /**
     * 是否显示序号
     */
    index?: boolean
    /**
     * 序号字段名称
     */
    indexLabel?: string
    /**
     * 序号字段宽度
     */
    indexWidth?: number
    /**
     * 是否固定序号
     */
    indexFixed?: boolean
    /**
     * 对齐方式
     */
    align: 'left' | 'center' | 'right'
    /**
     * 是否显示操作栏
     */
    menu?: boolean
    /**
     * 是否显示添加按钮
     */
    addBtn?: boolean
    /**
     * 添加按钮权限值
     */
    addBtnPermission?: string
    /**
     * 是否显示编辑按钮
     */
    editBtn?: boolean
    /**
     * 编辑按钮权限值
     */
    editBtnPermission?: string
    /**
     * 是否显示删除按钮
     */
    delBtn?: boolean
    /**
     * 删除按钮权限值
     */
    delBtnPermission?: string
    /**
     * 是否显示查看按钮
     */
    viewBtn?: boolean
    /**
     * 是否显示导出按钮
     */
    exportBtn?: boolean
    /**
     * 分页配置
     */
    paginationConfig?: {
      /**
       * 是否使用小型分页样式
       */
      small?: boolean
      /**
       * 每页显示个数选择器的选项设置 [10, 20, 30, 40, 50]
       */
      pageSizes?: number[]
      /**
       * 组件布局 'total, sizes, prev, pager, next, jumper'
       */
      layout?: string
    }
    /**
     * 是否显示分页
     */
    showPagination?: boolean
    /**
     * 是否显示表格上方的按钮组
     */
    showBtns?: boolean
    /**
     * 是否显示固定数据
     */
    fixedData?: boolean
  }
}
