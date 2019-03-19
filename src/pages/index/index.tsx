
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
// @ts-ignore
import { TravelPartyContent } from '../../components/TravelPartyContent/TravelPartyContent'
// @ts-ignore
import { MoneyManagementContent } from '../../components/MoneyManagementContent/MoneyManagementContent'

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
    const urlBookType= decodeURIComponent(this.$router.params.bookType);
    this.state = {
      yearMonth: `${year}-${month}`, // 用于存储日期，并传递给NavBar
      bookId: urlBookId || ' ',
      bookType: urlBookType || ' ', // 账本类别
      username: '',
      uid: ''
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
  async getRecordData(month: string, year: string, book_id: string) {
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
   * 获取投资理财的相关信息
   * @param year
   * @param book_id
   */
  async getMoneyManagementData(year: string, book_id: string) {
    return await this.props.dispatch({
      type: 'index/getMoneyManagementData',
      payload: {
        uid: 'DAF1221DFX', // 这里需要提前获取
        year: year,
        book_id: book_id,
      }
    })
  }

  /**
   * 页面data请求
   * @param date
   */
  getDateData(date:string) {
    const y = date.split('-')[0];
    const m = date.split('-')[1];
    Tips.loading();
    if (this.state.bookType == 'moneyManagement') {
      this.getMoneyManagementData(y, this.state.bookId)
    } else {
      this.getRecordData(m, y, this.state.bookId);
    }
    Tips.loaded()
      .then(() => {
        this.render();
      })
  }

  // 页面挂载时执行
  componentDidMount() {
    this.getDateData(this.state.yearMonth);
    Taro.setNavigationBarTitle({ // 设置标题栏账本名
      title: decodeURIComponent(this.$router.params.bookName)
    })
    // 从缓存中获取用户信息
    Taro.getStorage({
      key: 'uid',
      // @ts-ignore
      success: (res) => {
        this.setState({
          uid: res.data
        })
      }
    });
    Taro.getStorage({
      key: 'username',
      // @ts-ignore
      success: (res) => {
        this.setState({
          username: res.data
        })
      }
    })
  }

  render() {
    const { recordData, moneyManagementData } = this.props;

    // recordData = [
    //   {record_id: 'r05', uid: 'DE90ESD290', date: '2019-03-12', username: 'zenggan', record_type: 'income', category:'sell', money: 200.32, note: ''},
    //   {record_id: 'r04', uid: 'DE90ESD290', date: '2019-03-12', username: 'zenggan', record_type: 'expense', category:'food', money: 200.12, note: '今天天气不错'},
    //   {record_id: 'r03', uid: 'DE90ESD290', date: '2019-03-12', username: 'zenggan', record_type: 'expense', category:'shopping',money: 2009.00, note: ''},
    //   {record_id: 'r02', uid: 'DE90ESD290', date: '2019-03-11', username: 'zenggan', record_type: 'expense', category:'shopping',money: 400.00, note: '今天天气不错'},
    //   {record_id: 'r05', uid: 'DE90ESD290', date: '2019-03-12', username: 'zenggan', record_type: 'income', category:'sell', money: 200.32, note: ''},
    //   {record_id: 'r04', uid: 'DE90ESD290', date: '2019-03-12', username: 'zenggan', record_type: 'expense', category:'food', money: 200.12, note: '今天天气不错'},
    //   {record_id: 'r03', uid: 'DE90ESD290', date: '2019-03-12', username: 'zenggan', record_type: 'expense', category:'shopping',money: 2009.00, note: ''},
    //   {record_id: 'r02', uid: 'DE90ESD290', date: '2019-03-11', username: 'zenggan', record_type: 'expense', category:'shopping',money: 400.00, note: '今天天气不错'},
    //   {record_id: 'r01', uid: 'DE90ESD290', date: '2019-03-7', username: 'zenggan', record_type: 'expense', category:'food',money: 40.00, note: '今天天气不错'},
    //   {record_id: 'r00', uid: 'DE90ESD290', date: '2019-03-5', username: 'zenggan', record_type: 'income', category:'salary',money: 40000.00, note: ''},
    // ];
    // moneyManagementData = [
    //   {management_name: '支付宝理财', income: 2000, expense: 3000.02, manage_id: 'm01', create_time: '2019-03-01'},
    //   {management_name: '微信理财', income: 1000, expense: 500, manage_id: 'm02', create_time: '2019-01-01'}
    // ];

    let renderContentType = '';
    if (this.state.bookType == 'travelParty') {
      renderContentType = 'travelParty';
    } else if (this.state.bookType == 'moneyManagement') {
      renderContentType = 'moneyManagement'
    } else {
      renderContentType = 'normal' // 除出游和理财外的其他项
    }

    let navBarData = { // 顶部数据集，不同类型做不同处理
      incomeCount: 0,
      expenseCount: 0,
      count: 0,
      budget: 0,
    };
    //处理收支数据
    let incomeList = [];
    let expenseList = [];
    let incomeData:any = {};
    let expenseData:any = {};
    if (recordData && renderContentType == 'normal') {
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
        count: 2,
        budget: 100
      };
    }

    // 处理旅游出行数据
    let bookRecord = [];

    // 处理理财投资数据
    let moneyBookRecord = moneyManagementData;
    if (moneyManagementData && renderContentType == 'moneyManagement') {
      let incomeCount = 0;
      let expenseCount = 0;
      moneyManagementData.forEach(item => {
        incomeCount += item.income;
        expenseCount += item.expense;
      });
      navBarData.incomeCount = incomeCount;
      navBarData.expenseCount = expenseCount;
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
          { renderContentType == 'travelParty' &&
          <TravelPartyContent
            nowbookRecord={bookRecord}
            nowBookType='travelParty'
            nowBookId={this.state.bookId}
          />}
          { renderContentType == 'moneyManagement' &&
          <MoneyManagementContent
            nowBookRecord={moneyBookRecord}
            nowBookType='moneyManagement'
            nowBookId={this.state.bookId}
          />}
          { renderContentType == 'normal' &&
          <Content
            // @ts-ignore
            income={incomeData.recordList}
            // @ts-ignore
            expense={expenseData.recordList}
            nowBookType={this.state.bookType}
          />}
        </View>
        <View className='index-footer'>
          { renderContentType != 'moneyManagement' &&
          <TabBar
            nowBookId={this.state.bookId}
            nowBookType={this.state.bookType}
          /> }
        </View>
      </View>
    )
  }
}

export default Index;
