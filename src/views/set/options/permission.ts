import { ITableOption } from '@/components/ATable/CrudTypes'
export const tableOption: ITableOption = {
  tableConfig: {
    border: true,
    stripe: false,
    align: 'left',
    menu: true,
    addBtn: true,
    editBtn: true,
    delBtn: true,
    viewBtn: false,
    showPagination: false,
    selection: false,
    exportBtn: false,
    index: false,
    menuWidth: 280
  },
  column: [
    {
      label: '名称',
      prop: 'name',
      required: true,
      validateTip: '请输入名称',
      type: 'text',
      width: 250,
      span: 24
    },
    {
      label: '类型',
      prop: 'type',
      type: 'text',
      required: true,
      slot: true,
      validateTip: '请选择类型',
      editType: 'radio',
      tag: true,
      dicData: [
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
      ],
      span: 24
    },
    {
      label: '排序',
      prop: 'sort',
      span: 24
    },
    {
      label: '权限值',
      editLabel: '页面路由',
      prop: 'key',
      required: true,
      validateTip: '请输入路由',
      type: 'text',
      slot: true,
      width: 250,
      span: 24
    },
    {
      label: '接口',
      prop: 'apis',
      required: true,
      editDisplay: false,
      addDisplay: false,
      validateTip: '请输入名称',
      type: 'text',
      showTooltip: false,
      width: 550,
      slot: true,
      span: 24
    }
  ]
}
