import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { LineChartProps, LineChartState } from './LineChart.interface'
import './LineChart.scss'

class LineChart extends Component<LineChartProps,LineChartState > {
  constructor(props: LineChartProps) {
    super(props)
    this.state = {}
  }
  static options = {
    addGlobalClass: true
  }
  static defaultProps:LineChartProps = {}

  render() {
    return (
      <View className='fx-LineChart-wrap'>

      </View>
    )
  }
}

export default LineChart
