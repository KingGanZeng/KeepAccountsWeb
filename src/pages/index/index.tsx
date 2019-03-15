
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
// import { Request } from '../../utils/request'
import { IndexProps, IndexState } from './index.interface'
import Tips from '../../utils/tips'
import { addZero, objArrReduce } from "../../utils/common";
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
    const month = addZero((nowDate.getMonth()+1).toString());
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

  // 获取Content账单数据
  async getRecordData(month: number, year: number, book_id: string) {
    console.log(month, year, book_id)
    return await this.props.dispatch({
      type: 'index/getRecordData',
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
    this.getRecordData(m, y, book_id)
    this.render()
    Tips.loaded();
  }

  // 页面挂载时执行
  componentDidMount() {
    console.log(this.state.yearMonth)
    this.getDateData(this.state.yearMonth)
  }

  render() {
    const { recordData } = this.props;

    //处理收支数据
    let incomeList = [];
    let expenseList = [];
    let incomeData = {};
    let expenseData = {};
    let navBarData = {};
    if (recordData) {
      recordData.forEach(item => {
        if (item.record_type === 'income') {
          // @ts-ignore
          incomeList.push(item)
        } else if (item.record_type === 'expense') {
          // @ts-ignore
          expenseList.push(item)
        }
      });
      incomeData = objArrReduce(incomeList);
      expenseData = objArrReduce(expenseList);
      navBarData = {
        incomeCount: incomeData.moneyAll,
        expenseCount: expenseData.moneyAll,
      };
    }

    return (
      <View className='index-wrapper'>
        <View className='index-header'>
          <NavBar
            yearMonthStr={this.state.yearMonth}
            onDateState={this.onDateChange.bind(this)}
            navBarData={navBarData}
          />
        </View>
        <View className='index-content'>
          <Content
            income={incomeData.recordList}
            expense={expenseData.recordList}
          />
        </View>
        <View className='index-footer'>
          <TabBar />
        </View>
      </View>
    )
  }
}

export default Index;
