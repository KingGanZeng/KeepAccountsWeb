import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import {AtToast} from "taro-ui";
import { RecordChartProps, RecordChartState } from './recordChart.interface'
import './recordChart.scss'
import { PieChart } from "../../components/PieChart/PieChart";
import Tips from '../../utils/tips'
import {MAINHOST} from "../../config";


class RecordChart extends Component<RecordChartProps,RecordChartState > {
  config:Config = {
    navigationBarTitleText: '账单图表'
  }
  constructor(props: RecordChartProps) {
    super(props)
    const itemId = decodeURIComponent(this.$router.params.itemId)
    this.state = {
      itemId: itemId,
      hasError: false,
      hasErrorMsg: '数据获取失败',
      hasErrorIcon: 'close-circle',
      recordList: [],
    }
  }

  async getRecord() {
    Tips.loading()
    let result:any = await Taro.request({
      method: 'GET',
      url: `${MAINHOST}/api/recordDataApi?book_id=` + this.state.itemId,
    })
    if (!result.data.results) {
      this.setState({
        hasError: true,
        hasErrorMsg: '账本数据获取失败',
        hasErrorIcon: 'close-circle',
      })
      Tips.loaded()
      return
    }
    result = result.data.results
    this.setState({
      recordList: result
    })
    const ExpensePieChartData = [
      {value:200, name:'餐饮'},
      {value:138, name:'零食饮料'},
      {value:1200, name:'住宿'},
      {value:1350, name:'景点门票'},
      {value:1548, name:'购物'},
      {value:3000, name:'旅行团费'},
      {value:500, name:'交通'}
    ]
    const IncomePieChartData = [
      {value:200, name:'退款'},
      {value:100, name:'退税'},
    ]
    this.ExpensePieChart.refresh({
      chartData: ExpensePieChartData,
      legend: ['餐饮', '零食饮料', '住宿', '景点门票', '购物', '旅行团费', '交通'],
    });
    this.IncomePieChart.refresh({
      chartData: IncomePieChartData,
      legend: ['退款', '退税']
    });
    Tips.loaded()
  }

  // @ts-ignore
  refExpensePieChart = node => {this.ExpensePieChart = node}

  // @ts-ignore
  refIncomePieChart = node => {this.IncomePieChart = node}

  componentDidMount() {
    this.getRecord()
  }

  render() {
    return (
      <View className='recordChart-wrap'>
        <AtToast
          isOpened={this.state.hasError}
          text={this.state.hasErrorMsg}
          icon={this.state.hasErrorIcon}
          hasMask
        />
        <PieChart
          ref={this.refExpensePieChart}
          chartTitle='支出项'
        />
        <PieChart
          ref={this.refIncomePieChart}
          chartTitle='收入项'
        />
      </View>
    )
  }
}

export default RecordChart
