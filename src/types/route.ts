/**
 * 定义路由项接口
 */
export interface RouteItem {
  /** 路由路径 */
  path: string
  /** 路由元数据 */
  meta?: {
    /** 路由标题 */
    title?: string
    /** 路由图标 */
    icon?: string
  }
  /** 子路由 */
  children?: RouteItem[]
}
