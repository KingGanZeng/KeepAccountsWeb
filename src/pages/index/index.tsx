
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtListItem } from "taro-ui"
import { connect } from '@tarojs/redux'
import { Request } from '../../utils/request'
import { IndexProps, IndexState } from './index.interface'
import Tips from '../../utils/tips'
import { addZero } from "../../utils/common";
import './index.scss'
// @ts-ignore
import { TabBar } from '../../components/TabBar/TabBar'
// @ts-ignore
import { NavBar } from '../../components/NavBar/NavBar'
// @ts-ignore
import { Content } from '../../components/Content/Content'

@connect(({ index }) => ({
    ...index,
}))

class Index extends Component<IndexProps,IndexState > {
  config:Config = {
    navigationBarTitleText: '我的账本' // 标题栏标题
  };
  constructor(props: IndexProps) {
    super(props);
    const nowDate = new Date();
    const year = nowDate.getFullYear();
    const month = addZero((nowDate.getMonth() + 1).toString());
    this.state = {
      yearMonth: `${year}-${month}`, // 用于存储日期，并传递给NavBar
    }
  }

  /**
   * 时间修改，重新渲染页面
   * @param date
   */
  onDateChange(date) {
    this.setState({
      yearMonth: date,
    }, () => {
      this.getDateData(date)
    })
  }


  // 获取NavBar数据
  async getNavBarData(month: number, year: number, book_id: string) {
    return await this.props.dispatch({
      type: 'index/getNavBarData',
      payload: {
        month: month,
        year: year,
        user_name: 'zenggan', // 这里需要localstorage中获取
        book_id: book_id
      }
    })
  }

  // 获取Content账单数据
  async getBookData(month: number, year: number, book_id: string) {
    return await this.props.dispatch({
      type: 'index/getBookData',
      payload: {
        user_name: 'zenggan', // 这里需要localstorage中获取
        month: month,
        year: year,
        book_id: book_id
      }
    })
  }

  /**
   * 页面data请求
   * @param date
   */
  getDateData(date) {
    const y = date.split('-')[0];
    const m = date.split('-')[1];
    const book_id = this.$router.params.myBookId;
    Tips.loading();
    this.getNavBarData(m, y, book_id)
    this.getBookData(m, y, book_id)
    Tips.loaded()
    this.render()
  }

  // 页面挂载时执行
  componentDidMount() {
    Request.login();
    this.getDateData(this.state.yearMonth)
  }

  render() {
    const { navBarData, bookData } = this.props;
    // 设置账本信息
    let bookName = '我的账本';
    if (this.$router.params.myBookName) {
      bookName = decodeURIComponent(this.$router.params.bookName)
    }

    //处理收支数据
    let incomeList = [];
    let expenseList = [];
    if(bookData) {
      bookData.forEach(item => {
        if(item.income_expenses === 'income') {
          const tmpObj = {
            title: item.note,
            note: `收入${item.number}元`,
            date: item.date
          };
          incomeList.push(tmpObj)
        } else {
          const tmpObj = {
            title: item.note,
            note: `支出${item.number}元`,
            date: item.date
          };
          expenseList.push(tmpObj)
        }
      })
    }

    return (
      <View className='index-wrapper'>
        <View className='index-header'>
          <NavBar yearMonthStr={this.state.yearMonth} onDateState={this.onDateChange.bind(this)}/>
        </View>
        <View className='index-content'>
            <Content />
        </View>
        <View className='index-footer'>
          <TabBar />
        </View>
      </View>
    )
  }
}

export default Index
