
/**
 * TravelPartyContent.state 参数类型
 *
 * @export
 * @interface TravelPartyContentState
 */
export interface TravelPartyContentState {
  tempImageUrl: any, // 用于存放解析后的图片链接
}

/**
 * TravelPartyContent.props 参数类型
 *
 * @export
 * @interface TravelPartyContentProps
 */
export interface TravelPartyContentProps {
  nowBookRecord: any, // 数据源
  nowBookType: string, // 账本类型
  nowBookId: number, // 当前总账本id
  isAdmin: boolean, // 是否有管理员权限
}
