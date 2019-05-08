import Taro, { Component, Config } from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'
import {AtToast, AtCard} from "taro-ui";
import { RecordChartProps, RecordChartState } from './recordChart.interface'
import './recordChart.scss'
import { PieChart } from "../../components/PieChart/PieChart";
import Tips from '../../utils/tips'
import {MAINHOST} from "../../config";
import {globalData} from "../../utils/common";


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
      selectorChecked: '',
    }
  }

  async getRecord(year, month) {
    Tips.loading()
    let startTime;
    let endTime;
    startTime = `${year}-1-1`;
    // const nextMonth = parseInt(month, 10) + 1;
    endTime = `${year}-12-31`;
    let result:any = await Taro.request({
      method: 'GET',
      url: `${MAINHOST}/api/recordDataApi`,
      data: {
        book_id: this.state.itemId,
        create_timestamp_min: startTime,
        create_timestamp_max: endTime,
      }
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
    const recordTmpObj = {}
    result.forEach(record => {
      if (recordTmpObj[record.category]) {
        recordTmpObj[record.category].money += parseFloat(record.money)
      } else {
        recordTmpObj[record.category] = {
          bookType: record.book_type,
          category: record.category,
          record_type: record.record_type,
          money: parseFloat(record.money)
        }
      }
    })
    const recordExpenseList = []
    const recordIncomeList = []
    const recordExpenseLegend:any = []
    const recordIncomeLegend:any = []
    for (const i in recordTmpObj) {
      console.log(i)
      let name = globalData.categoryList[recordTmpObj[i].bookType][recordTmpObj[i].record_type].map((categoryItem) => {
        if (categoryItem.icon == recordTmpObj[i].category) {
          return categoryItem
        }
      });
      name = name.filter((nameItem) => {return nameItem})[0];
      if (recordTmpObj[i].record_type === 'expense') {
        recordExpenseList.push({
          value: recordTmpObj[i].money,
          name: name.title
        })
        console.log(name.title)
        recordExpenseLegend.push(1, name.title)
        console.log(2, recordExpenseLegend)
      } else {
        recordIncomeList.push({
          value: recordTmpObj[i].money,
          name: name.title
        })
        recordIncomeLegend.push(name.title)
      }
    }
    this.setState({
      recordList: {
        income: recordIncomeList,
        expense: recordExpenseList
      }
    })
    // const ExpensePieChartData = [
    //   {value:200, name:'餐饮'},
    //   {value:138, name:'零食饮料'},
    //   {value:1200, name:'住宿'},
    //   {value:1350, name:'景点门票'},
    //   {value:1548, name:'购物'},
    //   {value:3000, name:'旅行团费'},
    //   {value:500, name:'交通'}
    // ]
    // const IncomePieChartData = [
    //   {value:200, name:'退款'},
    //   {value:100, name:'退税'},
    // ]
    this.ExpensePieChart.refresh({
      chartData: recordExpenseList,
      legend: recordExpenseLegend || [],
    });
    this.IncomePieChart.refresh({
      chartData: recordIncomeList,
      legend: recordIncomeLegend || [],
    });
    Tips.loaded()
  }

  // @ts-ignore
  refExpensePieChart = node => {this.ExpensePieChart = node}

  // @ts-ignore
  refIncomePieChart = node => {this.IncomePieChart = node}

  onChange = e => {
    const year = e.detail.value.split('-')[0]
    const month = e.detail.value.split('-')[1]
    this.setState({
      selectorChecked: `${year}年`,
    }, () => {
      this.getRecord(year, month)
    })
  }

  componentDidMount() {
    const year = new Date().getFullYear()
    const month = new Date().getMonth() + 1
    this.getRecord(year, month)
    this.setState({
      selectorChecked: `${year}年`,
    })
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
        <View>
          <Picker
            mode='date'
            fields='year'
            className='picker-wrapper'
            onChange={this.onChange}
          >
            <View className='picker'>
              当前选择：{this.state.selectorChecked}
            </View>
          </Picker>
        </View>
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
