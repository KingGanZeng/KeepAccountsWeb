
/**
 * discoveryDetail.state 参数类型
 *
 * @export
 * @interface DiscoveryDetailState
 */
export interface DiscoveryDetailState {
  recommendInfoId: number, // 当前文章的id
  recommendInfo: any, // 文章信息
  isCollect: boolean, // 是否被收藏
  iconClass: string, // 收藏按钮
  collectionId?: any, // 用户收藏夹id
  hasError: boolean,
  hasErrorMsg: string,
  hasErrorIcon: string,
}

/**
 * discoveryDetail.props 参数类型
 *
 * @export
 * @interface DiscoveryDetailProps
 */
export interface DiscoveryDetailProps {}
