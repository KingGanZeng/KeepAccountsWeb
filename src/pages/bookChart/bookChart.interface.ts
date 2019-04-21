
/**
 * bookChart.state 参数类型
 *
 * @export
 * @interface BookChartState
 */
export interface BookChartState {
  hasError: boolean,
  hasErrorMsg: string,
  hasErrorIcon: string,
  bookDataObj: any, // 用于存储处理过后的基于场景的收支数据
}

/**
 * bookChart.props 参数类型
 *
 * @export
 * @interface BookChartProps
 */
export interface BookChartProps {}
