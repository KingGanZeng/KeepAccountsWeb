
/**
 * newWish.state 参数类型
 *
 * @export
 * @interface NewWishState
 */
export interface NewWishState {
  wishName: string, // 愿望名称
  endTime: string, // 到期时间
  wishLevelOneCategory: any, // 一级类目
  wishLevelOneCategoryCheck: string, // 一级类目选项
  showLevelTwoCategory: boolean, // 显示二级类目
  wishLevelTwoCategory: any, // 二级类目
  wishLevelTwoCategoryCheck: string, // 二级类目选项
  money: number, // 金额
  note: string, // 备注
  weight: number, // 权重
  is_finished: boolean, // 是否完成
  hasError: boolean,
  hasErrorMsg: string,
  hasErrorIcon: string,
}

/**
 * newWish.props 参数类型
 *
 * @export
 * @interface NewWishProps
 */
export interface NewWishProps {}
