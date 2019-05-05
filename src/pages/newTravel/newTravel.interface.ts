
/**
 * newTravel.state 参数类型
 *
 * @export
 * @interface NewTravelState
 */
export interface NewTravelState {
  sBookId: string, // 总账本编号
  titleInput: string, // 项目名称
  budget: number, // 预算
  bookType: string, // 账本类型
  username: string,
  uid: string,
  hasBookId: boolean,
  hasError: boolean,
  hasErrorMsg: string,
  hasErrorIcon: string,
  groupIdInfo: string, // 组id
  groupMembers: any, // 小组成员列表
  is_shared: boolean, // 项目是否共享
  image_url?: string, // 图片云id
  firstShare: boolean, // 判断是否是第一次共享，用于在用户首次开启共享时创建小组
  files: any, // 图片
  hasImage: boolean, // 是否有一张图片
}

/**
 * newTravel.props 参数类型
 *
 * @export
 * @interface NewTravelProps
 */
export interface NewTravelProps {}
