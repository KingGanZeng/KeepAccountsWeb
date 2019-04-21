import Taro, { Component } from "@tarojs/taro";
import {View} from "@tarojs/components"
import * as echarts from "../ec-canvas/echarts";
import './PieChart.scss'
import {PieChartState, PieChartProps} from "./PieChart.interface";

function setChartData(chart, data) {
  let option = {
    tooltip : {
      trigger: 'item',
      formatter: "{b} : {c} ({d}%)"
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: data.legend,
      textStyle:{
        color: '#ccc',
        fontSize: 12
      }
    },
    textStyle : {
      color: '#cccccc',
    },
    series : [
      {
        type: 'pie',
        center: ['50%', '60%'],
        radius: [0, '60%'],
        data: data.chartData,
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
  chart.setOption(option);
}

export default class PieChart extends Component<PieChartProps, PieChartState > {
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

  static defaultProps:PieChartProps = {
    chartTitle: '',
  }

  refresh(data) {
    console.log(55555, data)
    this.Chart.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      setChartData(chart, data);
      return chart;
    }, 'dark');
  }

  refChart = node => (this.Chart = node);

  render() {
    return (
      <View className='fx-PieChart-wrap'>
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
