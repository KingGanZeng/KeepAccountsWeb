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
  });
  canvas.setChart(chart);

  const option = {
    grid: {
      x: 10, //默认是80px
      y: 40, //默认是60px
      x2: 10, //默认80px
      y2: 30 //默认60px
    },
    tooltip: {
      formatter: '{b}:\n{c}元',
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      nameTextStyle: {
        color: '#ffffff' // x坐标轴名称文字样式
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: '#fff',
          fontSize:'16'
        }
      },
      // 控制网格线是否显示
      splitLine: {
        show: false,
        //  改变轴线颜色
        lineStyle: {
          // 使用深浅的间隔色
          color: ['red']
        }
      },
      // x轴的颜色和宽度
      axisLine:{
        lineStyle:{
          color:'#ef6b73',
          width: 2,   //这里是坐标轴的宽度,可以去掉
        }
      },
    },
    yAxis: {
      type: 'value',
      show: false,
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
      symbolSize: 8,   //拐点圆的大小
      itemStyle: {
        normal : {
          show: true,
          color:'#ef6b73',
          position: 'top',
          lineStyle:{
            color:'#ef6b73',
            width: 2,
          }
        }
      },
      smooth: false
    }]
  };

  chart.setOption(option);
  return chart
}

class LineChart extends Component<LineChartProps,LineChartState > {
  constructor(props: LineChartProps) {
    super(props);
    this.state = {
      ec: {
        onInit: initChart,
      }
    }
  }
  static options = {
    addGlobalClass: true
  };
  static defaultProps:LineChartProps = {};
  config = {
    usingComponents: {
      'ec-canvas': '../ec-canvas/ec-canvas', // 引入第三方组件
    }
  };

  render() {
    return (
      <View className='fx-LineChart-wrap'>
        <View className='charts-title'>2019年月花费分析</View>
        <ec-canvas
          id='mychart-dom-area'
          canvas-id='mychart-area'
          ec={this.state.ec}
        />
      </View>
    )
  }
}

export default LineChart
