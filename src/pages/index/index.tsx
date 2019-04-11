
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
// import { Request } from '../../utils/request'
import { IndexProps, IndexState } from './index.interface'
import Tips from '../../utils/tips'
import { addZero, objArrReduce } from "../../utils/common";
import './index.scss'
import {MAINHOST} from "../../config";
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
    navigationBarTitleText: '我的账本', // 标题栏标题
    enablePullDownRefresh: true,
    backgroundTextStyle: "dark"
  };
  constructor(props: IndexProps) {
    super(props);
    const nowDate = new Date();
    const year = nowDate.getFullYear();
    const month = addZero((nowDate.getMonth()+1).toString());
    const urlBookId = decodeURIComponent(this.$router.params.bookId);
    const urlBookType = decodeURIComponent(this.$router.params.bookType);
    const urlBudget = decodeURIComponent(this.$router.params.budget);
    this.state = {
      yearMonth: `${year}-${month}`, // 用于存储日期，并传递给NavBar
      bookId: urlBookId || ' ',
      bookType: urlBookType || ' ', // 账本类别
      budget: parseFloat(urlBudget), // 预算
      uid: '',
      specialDataObj: {},
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
    let startTime;
    let endTime;
    if (month == "undefined" || !month) {
      startTime = `${parseInt(year)-1}-12-31`;
      endTime = `${year}-12-31`
    } else {
      startTime = `${year}-${month}-1`;
      const nextMonth = parseInt(month, 10) + 1;
      endTime = `${year}-${nextMonth}-1`;
    }
    return await this.props.dispatch({
      type: 'index/getRecordData',
      payload: {
        uid: this.state.uid, // 这里需要localstorage中获取
        create_timestamp_min: startTime,
        create_timestamp_max: endTime,
        book_id: book_id
      }
    })
  }

  /**
   * 获取特殊账本的相关信息
   * @param year
   * @param book_id
   */
  async getSpecialBook(year: string, book_id: string) {
    Tips.loading()
    const endTime = `${year}-12-31`;
    const prevYear = parseInt(year, 10) - 1;
    const startTime = `${prevYear}-12-31`;
    // 先获取账本的信息，再根据账本信息查询内容
    let result:any =  await Taro.request({
      method: 'GET',
      url: `${MAINHOST}/api/getSpecialBookList?s_book_id=` + book_id,
    });
    result = result.data.results[0];

    let expenseCount = 0; // 用于记录支出
    let incomeCount = 0;
    let allCount = 0; // 用于记录笔数
    let tmpArr = []; // 用于存放每个账本记录
    result.book.forEach(async(item) => { // 遍历每个内置账本，获取账本数据
      let innerBookData:any = await Taro.request({ // 获取内置账本信息
        method: 'GET',
        url: `${MAINHOST}/api/getBookList?book_id=` + item
      });
      innerBookData = innerBookData.data.results[0];

      const itemData = await this.props.dispatch({ // 获取账单信息
        type: 'index/getRecordData',
          payload: {
          uid: this.state.uid, // 这里需要localstorage中获取
          create_timestamp_min: startTime,
          create_timestamp_max: endTime,
          book_id: item
        }
      });
      let innerExpense = 0;
      itemData.forEach((innerItem) => { // 统计数据
        if (innerItem.record_type == 'expense') {
          expenseCount = expenseCount + parseFloat(innerItem.money);
          innerExpense = innerExpense + parseFloat(innerItem.money);
        } else {
          incomeCount = incomeCount + parseFloat(innerItem.money);
        }
        allCount += 1;
      })
      const tmpObj:any = {
        bookId: item,
        innerBookInfo: innerBookData,
        innerExpense: innerExpense,
        recordArr: itemData,
        thumbnail: itemData.slice(0, 3), // 用于展示的缩略数据
      }
      // @ts-ignore
      tmpArr.push(tmpObj) // 每条记录加入内置账本集合中
    })
    this.setState({
      specialDataObj: {
        specialBookId: book_id,
        expense: expenseCount,
        income: incomeCount,
        count: allCount,
        bookArr: tmpArr
      }
    })
    setTimeout(() => { // 这里需要延时，不然拿不到数据
      this.setState({
        specialDataObj: {
          specialBookId: book_id,
          expense: expenseCount,
          income: incomeCount,
          count: allCount,
          bookArr: tmpArr
        }
      })
      Tips.loaded()
    }, 1000);
  }

  /**
   * 页面data请求
   * @param date
   */
  getDateData(date:string) {
    const y = date.split('-')[0];
    const m = date.split('-')[1];
    Tips.loading();
    if (this.state.bookType == 'moneyManagement' || this.state.bookType == 'travelParty') {
      this.getSpecialBook(y, this.state.bookId)
    } else {
      this.getRecordData(m, y, this.state.bookId);
    }
    Tips.loaded()
      .then(() => {
        this.render();
      })
  }

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.getDateData(this.state.yearMonth);
  }

  // 页面挂载时执行
  componentDidShow() {
    Taro.setNavigationBarTitle({ // 设置标题栏账本名
      title: decodeURIComponent(this.$router.params.bookName)
    });
    // 从缓存中获取用户信息
    const uid = Taro.getStorageSync('uid');
    this.setState({
      uid: uid,
    }, () => {
      this.getDateData(this.state.yearMonth);
    })
  }

  render() {
    const { recordData } = this.props;
    const myRecordList = recordData || [];
    let hasRecord = myRecordList.length > 0

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
    //处理收支数据 navBar
    let incomeList = [];
    let expenseList = [];
    let incomeData:any = {};
    let expenseData:any = {};
    if (myRecordList && renderContentType == 'normal') {
      myRecordList.forEach(item => {
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
        count: myRecordList.length,
        budget: this.state.budget || 0
      };
    }

    // 处理理财投资数据
    if (renderContentType == 'moneyManagement' || renderContentType == 'travelParty') {
      navBarData.incomeCount = this.state.specialDataObj.income || 0;
      navBarData.expenseCount = this.state.specialDataObj.expense || 0;
      navBarData.count = this.state.specialDataObj.count;
      hasRecord = true;
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
        { !hasRecord && <View className='index-content' /> }
        { hasRecord && <View className='index-content'>
          { renderContentType == 'travelParty' &&
          <TravelPartyContent
            nowBookRecord={this.state.specialDataObj}
            nowBookType='travelParty'
            nowBookId={this.state.bookId}
          />}
          { renderContentType == 'moneyManagement' &&
          <MoneyManagementContent
            nowBookRecord={this.state.specialDataObj}
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
            nowBookId={this.state.bookId}
          />}
        </View> }
        <View className='index-footer'>
          <TabBar
            nowBookId={this.state.bookId}
            nowBookType={this.state.bookType}
            isSpecial={this.$router.params.isSpecial}
          />
        </View>
      </View>
    )
  }
}

export default Index;
