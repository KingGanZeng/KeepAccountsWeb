import Taro, { Component } from "@tarojs/taro";
import {View} from "@tarojs/components";
import * as echarts from "../ec-canvas/echarts";
import './BarChart.scss'
import { BarChartProps, BarChartState } from "./BarChart.interface";

function setChartData(chart, data, propNameList) {
  const colorList = [
    ['#4ffa93', '#dd6a66'],
    ['#f65858', '#625cbd'],
  ]
  const nameList = ['支出', '收入']
  let option = {
    legend: {
      data: nameList,
      textStyle: {
        color: '#ffffff',
        fontSize:'12'
      },
    },
    grid: {
      left: '3%',
      right: '17%',
      bottom: '3%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis : [
      {
        type: 'value',
        position: 'top',
        name: propNameList[1],
        axisLine: {
          lineStyle: {
            type: 'solid',
            color: '#fff',//左边线的颜色
            width:'2'//坐标线的宽度
          }
        },
        axisLabel: {
          textStyle: {
            color: '#fff',//坐标值得具体的颜色

          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed'
          }
        },
      }
    ],
    yAxis : [
      {
        type: 'category',
        name: propNameList[0],
        data: [],
        axisLine: {
          lineStyle: {
            type: 'solid',
            color: '#fff',//左边线的颜色
            width:'2'//坐标线的宽度
          }
        },
        axisLabel: {
          textStyle: {
            color: '#fff',//坐标值得具体的颜色
          },
        },
      },
    ],
    series : []
  };
  if (data && data.dimensions && data.measures) {
    option.yAxis[0].data = data.dimensions.data
    option.series = data.measures.map((item, index) => {
      return {
        ...item,
        name: nameList[index],
        type: 'bar',
        itemStyle: {
          normal: {
            barBorderRadius: 4,
            barWidth: 30,
            color: colorList[index][1]
          },
        },
      }
    })
  }
  chart.setOption(option);
}

export default class BarChart extends Component<BarChartProps,BarChartState > {
  config = {
    usingComponents: {
      "ec-canvas": "../ec-canvas/ec-canvas"
    }
  };

  constructor(props) {
    super(props);
  }

  state = {
    ec: {
      lazyLoad: true
    }
  };

  static defaultProps:BarChartProps = {
    chartTitle: '',
    legend: ['项目', '金额(元)']
  }

  refresh(data) {
    console.log(data)
    this.Chart.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      setChartData(chart, data, this.props.legend);
      return chart;
    });
  }

  refChart = node => (this.Chart = node);

  render() {
    return (
      <View className='fx-BarChart-wrap'>
        <View className='charts-title'>{this.props.chartTitle}</View>
          <ec-canvas
            ref={this.refChart}
            canvas-id="mychart-area"
            ec={this.state.ec}
          />
      </View>
    );
  }
}
