
/**
 * discovery.state 参数类型
 *
 * @export
 * @interface DiscoveryState
 */
export interface DiscoveryState {
  discoveryList: any, // 发现列表
  nextPageUrl: string, // 下次请求url，用于下拉加载
  hasNext: boolean, // 是否还有下一页
}

/**
 * discovery.props 参数类型
 *
 * @export
 * @interface DiscoveryProps
 */
export interface DiscoveryProps {}
