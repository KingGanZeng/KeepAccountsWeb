
/**
 * recommendInfo.state 参数类型
 *
 * @export
 * @interface RecommendInfoState
 */
export interface RecommendInfoState {
  current: number, // 面板index
  myUsageList: any, // 我的最爱列表
  recommendList: any, // 热门列表
  hasError: boolean,
  hasErrorMsg: string,
  hasErrorIcon: string,
  bookType: string,
  itemId: string,
}

/**
 * recommendInfo.props 参数类型
 *
 * @export
 * @interface RecommendInfoProps
 */
export interface RecommendInfoProps {}
