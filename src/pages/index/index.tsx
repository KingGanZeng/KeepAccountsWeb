
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
    const urlBookId = decodeURIComponent(this.$router.params.bookId);
    const urlBookType= decodeURIComponent(this.$router.params.bookType)
    this.state = {
      yearMonth: `${year}-${month}`, // 用于存储日期，并传递给NavBar
      bookId: urlBookId || ' ',
      bookType: urlBookType || ' ', // 账本类别
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
    this.getDateData(this.state.yearMonth)
    Taro.setNavigationBarTitle({ // 设置标题栏账本名
      title: decodeURIComponent(this.$router.params.bookName)
    })
  }

  render() {
    const { recordData } = this.props;

    //处理收支数据
    let incomeList = [];
    let expenseList = [];
    let incomeData:any = {};
    let expenseData:any = {};
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
      // @ts-ignore
      navBarData = {
        incomeCount: incomeData.moneyAll,
        expenseCount: expenseData.moneyAll,
        count:'2',
        budget:'100'
      };
    }

    return (
      <View className='index-wrapper'>
        <View className='index-header'>
          <NavBar
            yearMonthStr={this.state.yearMonth}
            onDateState={this.onDateChange.bind(this)}
            navBarData={navBarData}
            navBookType={this.state.bookType}
          />
        </View>
        <View className='index-content'>
          <Content
            // @ts-ignore
            income={incomeData.recordList}
            // @ts-ignore
            expense={expenseData.recordList}
          />
        </View>
        <View className='index-footer'>
          <TabBar nowBookId={this.state.bookId} />
        </View>
      </View>
    )
  }
}

export default Index;
