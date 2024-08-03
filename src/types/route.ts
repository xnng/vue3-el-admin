export interface RouteItem {
  path: string
  meta?: {
    title?: string
    icon?: string
  }
  children?: RouteItem[]
}
