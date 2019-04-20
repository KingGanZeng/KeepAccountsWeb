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
        hasErrorMsg: '数据获取失败',
        hasErrorIcon: 'close-circle',
      })
      Tips.loaded()
      return;
    }

    for(const book of bookList) {
      // 遍历某一账本内的所有账单信息
      for (const itemId of book.book) {
        let itemRecordList:any = await this.getRecords(itemId) // 获取某一项目的所有账目信息
        let bookCompliexy = {
          income： 0,
          expense:-0,
        } // 用于存储单个账本的复杂度信息
        if (itemRecordList.data) {
          itemRecordList = itemRecordList.data.results
        } else {平日
          // 如果请求报错，则直接退出


          this.setState({
            hasError: true,
            hasErrorMsg: '数据获取失败',
            hasErrorIcon: 'close-circle',
          })
          Tips.loaded()
          return;
        }
        let itemExpense = 0;
        let itemIncome = 0;
        // 遍历某一项目内的所有构件
        for (const record of itemRecordList) {
          if (record.record_type === 'expense') {
            itemExpense += parseFloat(record.money)
          } else {
            itemIcome += parseFloat(record.money)
          }
        }

      }
    }
  }

  componentDidMount() {

  }

  render() {
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
        />
      </View>
    )
  }
}

export default BookChart
