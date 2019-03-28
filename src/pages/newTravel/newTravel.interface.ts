
/**
 * newTravel.state 参数类型
 *
 * @export
 * @interface NewTravelState
 */
export interface NewTravelState {
  sBookId: string, // 总账本编号
  imageFile: any,
  titleInput: string,
  budget: number,
  bookType: string,
  username: string,
  uid: string,
  hasBookId: boolean,
  hasError: boolean,
  hasErrorMsg: string,
  hasErrorIcon: string,
}

/**
 * newTravel.props 参数类型
 *
 * @export
 * @interface NewTravelProps
 */
export interface NewTravelProps {}
