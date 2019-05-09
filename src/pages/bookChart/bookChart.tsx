import Taro, { Component, Config } from '@tarojs/taro'
import {Picker, View} from '@tarojs/components'
import {AtToast} from "taro-ui";
import { BookChartProps, BookChartState } from './bookChart.interface'
import './bookChart.scss'
// @ts-ignore
import { BarChart } from '../../components/BarChart/BarChart'
import Tips from '../../utils/tips'
import { MAINHOST } from "../../config";
import {bookNameTranslate} from "../../utils/common";


class BookChart extends Component<BookChartProps,BookChartState > {
  config:Config = {
    navigationBarTitleText: '图表展示'
  }
  constructor(props: BookChartProps) {
    super(props)
    this.state = {
      hasError: false,
      hasErrorMsg: '数据获取失败',
      hasErrorIcon: 'close-circle',
      selectorChecked: '',
    }
  }

  /**
   * echarts的ref函数
   * @param node
   */
  // @ts-ignore
  refBarChart = node => {this.BarChart = node}

  async getBookMoney(year) {
    const min_time = `${year}-1-1`
    const max_time = `${year}-12-31`
    const uid = Taro.getStorageSync('uid')
    let chartData:any = {
      dimensions: {
        data: []
      },
      measures: [{
        data: [], // 支出
      },{
        data: []
      }]
    }
    try {
      const getUrl = `${MAINHOST}/api/getAllBookMoneyList?uid=${uid}&min_time=${min_time}&max_time=${max_time}`
      let result:any = await Taro.request({
        method: "GET",
        url: getUrl,
      })
      result = result.data
      for(const book in result.book_type_money_set) {
        const title = bookNameTranslate('Chinese', result.book_type_money_set[book].title)
        const income = result.book_type_money_set[book].income
        const expense = result.book_type_money_set[book].expense
        chartData.dimensions.data.push(title)
        chartData.measures[0].data.push(expense)
        chartData.measures[1].data.push(income)
      }
      return chartData
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * 按照场景进行分类，
   */
  async getAllData(year) {
    Tips.loading()
    const chartData = await this.getBookMoney(year)
    if (!chartData) {
      // 如果链接报错，则直接退出
      this.setState({
        hasError: true,
        hasErrorMsg: '账本数据获取失败',
        hasErrorIcon: 'close-circle',
      })
      Tips.loaded()
      return;
    }

    // const chartData = {
    //   dimensions: {
    //     data: ['日常', '旅游', '租房', '聚会', '装修', '理财', '生意', '汽车', '育儿']
    //   },
    //   measures: [{
    //     data: [2000, 1333, 1588, 1000, 1000, 200, 300, 0, 200], // 支出
    //   },{
    //     data: [1999, 0, 200, 0, 300, 2000, 1000, 0, 200]
    //   }]
    // }
    // @ts-ignore
    this.BarChart.refresh(chartData);
    Tips.loaded()
  }

  /**
   * 时间选择器
   * @param e
   */
  onChange = e => {
    const year = e.detail.value.split('-')[0]
    this.setState({
      selectorChecked: `${year}年`,
    }, () => {
      this.getAllData(year)
    })
  }

  componentDidMount() {
    const year = new Date().getFullYear()
    this.setState({
      selectorChecked: `${year}年`,
    })
    this.getAllData(year)
  }

  render() {
    const legend = ['场景', '金额(元)']

    return (
      <View className='bookChart-wrap'>
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
            value={this.state.selectorChecked}
          >
            <View className='picker'>
              当前选择：{this.state.selectorChecked}
            </View>
          </Picker>
        </View>
        <BarChart
          ref={this.refBarChart}
          chartTitle='总收支情况'
          legend={legend}
        />
      </View>
    )
  }
}

export default BookChart
