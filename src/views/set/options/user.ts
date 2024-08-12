import { ITableOption } from '@/components/ATable/CrudTypes'
import dayjs from 'dayjs'
export const tableOption: ITableOption = {
  tableConfig: {
    border: false,
    stripe: false,
    align: 'left',
    menu: true,
    addBtn: false,
    editBtn: false,
    delBtn: false,
    viewBtn: false,
    selection: false,
    index: true,
    menuWidth: 100
  },
  column: [
    {
      label: '用户',
      prop: 'name',
      slot: true,
      width: 150,
      search: true
    },
    {
      label: '角色',
      prop: 'role',
      slot: true
    },
    {
      label: '创建时间',
      addDisplay: false,
      prop: 'createTime',
      formatter: (row: any) => dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss'),
      width: 180
    },
    {
      label: '更新时间',
      addDisplay: false,
      prop: 'updateTime',
      formatter: (row: any) => dayjs(row.updateTime).format('YYYY-MM-DD HH:mm:ss'),
      width: 180
    }
  ]
}
