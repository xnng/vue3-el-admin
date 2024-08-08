import { ITableOption } from '@/components/ATable/CrudTypes'
import dayjs from 'dayjs'
export const tableOption: ITableOption = {
  tableConfig: {
    border: false,
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
    index: true,
    menuWidth: 190
  },
  column: [
    {
      label: '角色名称',
      prop: 'name',
      required: true,
      validateTip: '请输入角色名称',
      type: 'text',
      span: 24
    },
    {
      label: '描述',
      prop: 'desc',
      validateTip: '请输入描述',
      type: 'text',
      span: 24
    },
    {
      width: 200,
      label: '创建时间',
      formatter: (row) => dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss'),
      prop: 'createTime',
      addDisplay: false
    }
  ]
}
