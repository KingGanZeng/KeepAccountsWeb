import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { BarChartProps, BarChartState } from './BarChart.interface'
import './BarChart.scss'
// @ts-ignore
import * as echarts from "../ec-canvas/echarts";

class BarChart extends Component<BarChartProps,BarChartState > {
  constructor(props: BarChartProps) {
    super(props)
    this.state = {
      ec: {
        lazyLoad: true,
      }
    }
  }
  static options = {
    addGlobalClass: true
  }
  static defaultProps:BarChartProps = {}
  config = {
    usingComponents: {
      'ec-canvas': '../ec-canvas/ec-canvas', // 引入第三方组件
    }
  };

  /**
   * 获取图表数据
   */
  getData() {
    const tmpBarDateData = ['3-22', '3-22', '3-22', '3-22', '3-22', '3-22']
    const tmpBarData = {
      count: [ 200,300,400,500,600,700],
      income: [ 200,300,400,500,600,700],
      expense: [ -10,-20,-30,-40,-50,-60],
    }
    const obj = {
      barDateData: tmpBarDateData,
      barData: tmpBarData,
    }
    return obj;
  }

  init(barData, barDateData) {
    this.refs.barChart.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
      })
      const option = {
        tooltip : {
          trigger: 'axis',
          axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          },
          position: {
            left: 0,
          }
        },
        legend: {
          data:['利润', '支出', '收入'],
          padding: 10,
          textStyle:{ // 图例文字的样式
            color:'#e3e3e3',
            fontSize: 12
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          containLabel: true
        },
        xAxis : [
          {
            type : 'value',
            show: false,
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
            splitLine: {
              show: true,
              //  改变轴线颜色
              lineStyle: {
                // 使用深浅的间隔色
                color: ['red']
              }
            },
          },
        ],
        yAxis : [
          {
            type : 'category',
            axisTick : {show: false},
            data : barDateData,
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
          }
        ],
        series : [
          {
            name:'差额',
            type:'bar',
            label: {
              normal: {
                show: true,
                position: 'right'
              }
            },
            data: barData.count,
            itemStyle: {
              normal: {
                color: '#e3e3e3'
              }
            }
          },
          {
            name:'收入',
            type:'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'right'
              }
            },
            data: barData.income,
            itemStyle: {
              normal: {
                color: '#f65858'
              }
            }
          },
          {
            name:'支出',
            type:'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'left'
              }
            },
            data: barData.expense,
            itemStyle: {
              normal: {
                color: '#4ffa93'
              }
            }
          }
        ]
      };
      canvas.setChart(chart)
      console.log(chart, option)
      chart.setOption(option)
      return chart
    })
  }

  componentDidMount(): void {
    const obj = this.getData()
    // @ts-ignore
    const barData = obj.barData
    // @ts-ignore
    const barDateData = obj.barDateData
    this.init(barData, barDateData)
  }

  render() {
    return (
      <View className='fx-BarChart-wrap'>
        <View className='charts-title'>一周消费状况</View>
        <ec-canvas
          ref="barChart"
          id='mychart-dom-area'
          canvas-id='mychart-area'
          ec={this.state.ec}
        />
      </View>
    )
  }
}

export default BarChart
