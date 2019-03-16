import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { LineChartProps, LineChartState } from './LineChart.interface'
// @ts-ignore
import * as echarts from '../ec-canvas/echarts'
import './LineChart.scss'

function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  })
  canvas.setChart(chart)
  const model = {
    yCates: ['Saturday', 'Friday', 'Thursday',
      'Wednesday', 'Tuesday', 'Monday',
      'Sunday'],
    xCates: ['1', '2', '3', '4', '5'],
    data: [
      // [yCateIndex, xCateIndex, value]
      [0, 0, 5], [0, 1, 7], [0, 2, 3], [0, 3, 5], [0, 4, 2],
      [1, 0, 1], [1, 1, 2], [1, 2, 4], [1, 3, 8], [1, 4, 2],
      [2, 0, 2], [2, 1, 3], [2, 2, 8], [2, 3, 6], [2, 4, 7],
      [3, 0, 3], [3, 1, 7], [3, 2, 5], [3, 3, 1], [3, 4, 6],
      [4, 0, 3], [4, 1, 2], [4, 2, 7], [4, 3, 8], [4, 4, 9],
      [5, 0, 2], [5, 1, 2], [5, 2, 3], [5, 3, 4], [5, 4, 7],
      [6, 0, 6], [6, 1, 5], [6, 2, 3], [6, 3, 1], [6, 4, 2]
    ]
  }

  const data = model.data.map(function (item) {
    return [item[1], item[0], item[2] || '-']
  })

  const option = {
    title: {
      text: '月花费',
      textStyle:{
        color:'#ffffff',
        fontSize: '14px',
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      x: 40, //默认是80px
      y: 40, //默认是60px
      x2: 10, //默认80px
      y2: 30 //默认60px
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      nameTextStyle: {
        color: '#ffffff' // x坐标轴名称文字样式
      },
      axisLine: {
        lineStyle: {
          color: '#ffffff' //坐标轴线颜色
        }
      },
      splitLine:{
        show:false
      },
    },
    yAxis: {
      type: 'value',
      nameTextStyle: {
        color: '#ffffff' // x坐标轴名称文字样式
      },
      axisLine: {
        lineStyle: {
          color: '#ffffff' //坐标轴线颜色
        }
      },
      splitLine:{
        show:false
      },
    },
    series: [{
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line',
      itemStyle: {
        normal : {
          color:'#ffffff',
          lineStyle:{
            color:'#ffffff'
          }
        }
      },
      smooth: true
    }]
  }

  chart.setOption(option)
  return chart
}

class LineChart extends Component<LineChartProps,LineChartState > {
  constructor(props: LineChartProps) {
    super(props)
    this.state = {
      ec: {
        onInit: initChart,
      }
    }
  }
  static options = {
    addGlobalClass: true
  }
  static defaultProps:LineChartProps = {}
  config = {
    usingComponents: {
      'ec-canvas': '../ec-canvas/ec-canvas', // 引入第三方组件
    }
  }

  render() {
    return (
      <View className='fx-LineChart-wrap'>
        <ec-canvas id='mychart-dom-area' canvas-id='mychart-area' ec={this.state.ec} />
      </View>
    )
  }
}

export default LineChart
