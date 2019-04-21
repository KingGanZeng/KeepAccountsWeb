import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import {AtToast} from "taro-ui";
import { BookChartProps, BookChartState } from './bookChart.interface'
import './bookChart.scss'
// @ts-ignore
import { BarChart } from '../../components/BarChart/BarChart'
import Tips from '../../utils/tips'
import { MAINHOST } from "../../config";


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
      bookDataObj: {},
    }
  }

  /**
   * echarts的ref函数
   * @param node
   */
  // @ts-ignore
  refBarChart = node => {this.BarChart = node}

  /**
   * 获取用户所有账本信息
   */
  async getBook() {
    const uid = await Taro.getStorageSync('uid')
    try {
      const result = await Taro.request({
        method: 'GET',
        url: `${MAINHOST}/api/getSpecialBookList`,
        data: {
          uid: uid,
        }
      })
      return result.data.results
    } catch (e) {
      console.log(e)
      return false
    }
  }

  async getRecords(itemId) {
    try {
      const result = await Taro.request({
        method: 'GET',
        url: `${MAINHOST}/api/recordDataApi`,
        data: {
          book_id: itemId,
        }
      })
      return result.data.results
    } catch (e) {
      console.log(e)
      return false
    }
  }

  /**
   * 按照场景进行分类，
   */
  async getAllData() {
    Tips.loading()
    const bookList = await this.getBook()
    if (!bookList) {
      // 如果链接报错，则直接退出
      this.setState({
        hasError: true,
        hasErrorMsg: '账本数据获取失败',
        hasErrorIcon: 'close-circle',
      })
      Tips.loaded()
      return;
    }

    for(const book of bookList) {
      // 遍历某一账本内的所有账单信息
      for (const itemId of book.book) {
        let itemRecordList:any = await this.getRecords(itemId) // 获取某一项目的所有账目信息
        let singleBookMoney = {
          income: 0,
          expense:0,
        } // 用于存储单个账本的复杂度信息
        console.log(23333, itemRecordList)
        let itemExpense = 0;
        let itemIncome = 0;
        // 遍历某一项目内的所有构件
        for (const record of itemRecordList) {
          if (record.record_type === 'expense') {
            itemExpense += parseFloat(record.money)
            singleBookMoney.expense = itemExpense
          } else {
            itemIncome += parseFloat(record.money)
            singleBookMoney.income = itemIncome
          }
        }
        if (this.state.bookDataObj[book.book_type]) {
          const tmpExpense = this.state.bookDataObj[book.book_type].expense + singleBookMoney.expense
          const tmpIncome = this.state.bookDataObj[book.book_type].income + singleBookMoney.income
          this.state.bookDataObj[book.book_type]= {
            income: tmpIncome,
            expense: tmpExpense,
          }
        } else {
          this.state.bookDataObj[book.boo_type]= {
            income: singleBookMoney.income,
            expense: singleBookMoney.expense,
          }
        }
      }
    }
    console.log(this.state);
    const chartData = {
      dimensions: {
        data: ['日常', '旅游', '租房', '聚会', '装修', '理财', '生意', '汽车', '育儿']
      },
      measures: [{
        data: [2000, 1333, 1588, 1000, 1000, 200, 300, 0, 200], // 支出
      },{
        data: [1999, 0, 200, 0, 300, 2000, 1000, 0, 200]
      }]
    }
    // @ts-ignore
    this.BarChart.refresh(chartData);
    Tips.loaded()
  }

  componentDidMount() {
    this.getAllData()
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
