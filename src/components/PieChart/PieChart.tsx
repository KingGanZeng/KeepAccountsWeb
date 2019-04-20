import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { PieChartProps, PieChartState } from './PieChart.interface'
import Tips from '../../utils/tips'
import './PieChart.scss'
// @ts-ignore
import * as echarts from '../components/ec-canvas/echarts'

class PieChart extends Component<PieChartProps,PieChartState > {
  constructor(props: PieChartProps) {
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
  static defaultProps:PieChartProps = {}
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
        tooltip: {
          trigger: 'item',
          formatter: "{b}: {c} ({d}%)",
          position: {
            left: 0,
          }
        },
        grid: {
          top: '1%',
          left: '0',
          right: '0',
          bottom: '10%',
          containLabel: true
        },
        series: [
          {
            name:'收支状况',
            type:'pie',
            selectedMode: 'single',
            radius: [0, '30%'],

            label: {
              normal: {
                position: 'inner'
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data:[
              {value:335, name:'收入', selected:true},
              {value:679, name:'支出'},
            ]
          },
          {
            name:'收支状况',
            type:'pie',
            radius: ['45%', '60%'],
            data:[
              {value:335, name:'食品支出'},
              {value:310, name:'邮件营销'},
              {value:234, name:'联盟广告'},
              {value:135, name:'视频广告'},
              {value:1048, name:'百度大妈'},
              {value:251, name:'谷歌大妈'},
              {value:147, name:'必应大妈'},
              {value:102, name:'其他大妈'}
            ]
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
    Tips.loading()
    setTimeout(() => {
      this.init(barData, barDateData)
      Tips.loaded()
    }, 2100)
  }

  render() {
    return (
      <View className='fx-PieChart-wrap'>
        <View className='charts-title'>收支分类</View>
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

export default PieChart
