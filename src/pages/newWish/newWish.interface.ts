
/**
 * newWish.state 参数类型
 *
 * @export
 * @interface NewWishState
 */
export interface NewWishState {
  wishName: string,
  endTime: string,
  category: string,
  categoryCheck: boolean,
  money: number,
  note: string,
  weight: number,
  loading: boolean,
  hasError: false,
  hasErrorMsg: '新建账本错误',
  hasErrorIcon: 'close-circle',
}

/**
 * newWish.props 参数类型
 *
 * @export
 * @interface NewWishProps
 */
export interface NewWishProps {}
