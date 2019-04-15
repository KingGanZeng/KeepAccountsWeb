
/**
 * wish.state 参数类型
 *
 * @export
 * @interface WishState
 */
export interface WishState {
  wishList: any, // 用户的愿望列表
  hasError: boolean,
  hasErrorMsg: string,
  hasErrorIcon: string,
  modalOpenState: boolean,
  modalContent: string,
  nowEditWishItem: any,
  nowIndex: number,
}

/**
 * wish.props 参数类型
 *
 * @export
 * @interface WishProps
 */
export interface WishProps {}
