
/**
 * ContentInput.state 参数类型
 *
 * @export
 * @interface ContentInputState
 */
export interface ContentInputState {
  inputContent: string, // input框value
  focusState: boolean, // 聚焦状态，用于处理css
}

/**
 * ContentInput.props 参数类型
 *
 * @export
 * @interface ContentInputProps
 */
export interface ContentInputProps {
  placeholder: string, // placeholder值
  inputName: string, // 表明组件信息
  onInput?: any, // 用于子组件传值
}
