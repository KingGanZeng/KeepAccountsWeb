
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtListItem } from "taro-ui"
import { connect } from '@tarojs/redux'
import { Request } from '../../utils/request'
import { IndexProps, IndexState } from './index.interface'
import Tips from '../../utils/tips'
import './index.scss'
import { TabBar } from '../../components/TabBar/TabBar'
import { NavBar } from '../../components/NavBar/NavBar'
import { Content } from '../../components/Content/Content'

@connect(({ index }) => ({
    ...index,
}))

class Index extends Component<IndexProps,IndexState > {
  config:Config = {
    navigationBarTitleText: '我的账本'
  }
  constructor(props: IndexProps) {
    super(props)
    this.state = {
      current: 0,
      dateSel: '2018-04',
      month: 0,
      day: 0
    }
  }

  /**
   * 编辑账本
   */
  editBook () {
    const bookId = this.$router.params.myBookId
    const booktype = this.$router.params.booktype
    Taro.navigateTo({
      url: '/pages/newBook/newBook?book_id=' + bookId + '&booktype=' + booktype
    })
  }

  /**
   * 切换账本
   */
  changeBook () {
    Taro.navigateTo({
      url: '/pages/accountBook/accountBook'
    })
  }

  /**
   * 时间选择器
   * @param e
   */
  onDateChange = e => {
    console.log(e.detail.value)
    this.setState({
      dateSel: e.detail.value
    })
    const y = e.detail.value.split('-')[0]
    const m = e.detail.value.split('-')[1]
    Tips.loading()
    const book_name = this.$router.params.myBook
    this.getBannerData(m, y, book_name)
    this.getBookData(m, y, book_name)
    Tips.loaded()
    this.render()
  }


  // 获取banner数据
  async getBannerData(month: number, year: number, book_id: number) {
    return await this.props.dispatch({
      type: 'index/getBannerData',
      payload: {
        month: month,
        year: year,
        user_name: 'zenggan',
        book_id: book_id
      }
    })
  }

  // 获取账单数据
  async getBookData(month: number, year: number, book_id: number) {
    return await this.props.dispatch({
      type: 'index/getBookData',
      payload: {
        user_name: 'zenggan',
        month: month,
        year: year,
        book_id: book_id
      }
    })
  }

  // 获取系统当前时间并请求参数
  getAndSetDate() {
    const myDate = new Date()
    const y = myDate.getFullYear()
    const m = myDate.getMonth() + 1
    const d = myDate.getDate()
    this.setState({
      month: m,
      day: d
    })
    this.setState({
      dateSel: `${y}-${m}`
    })
    Tips.loading()
    const book_id = this.$router.params.myBookId
    this.getBannerData(m, y, book_id)
    this.getBookData(m, y, book_id)
    Tips.loaded()
  }

  // 页面挂载时执行
  componentDidMount() {
    Request.login()
    this.getAndSetDate()
  }

  render() {
    const { bannerData, bookData } = this.props
    // 设置账本信息
    let bookName = '我的账本'
    if (this.$router.params.myBookName) {
      bookName = decodeURIComponent(this.$router.params.myBookName)
    }
    // 设置时间
    const bookYear = this.state.dateSel.split('-')[0]
    const bookMonth= this.state.dateSel.split('-')[1]

    // 处理banner数据
    let expense = '0.00'
    let income = '0.00'
    if(bannerData) {
      expense = (bannerData.expense || 0).toFixed(2)
      income = (bannerData.income || 0).toFixed(2)
    }

    //处理收支数据
    let incomeList = []
    let expenseList = []
    if(bookData) {
      bookData.forEach(item => {
        if(item.income_expenses === 'income') {
          const tmpObj = {
            title: item.note,
            note: `收入${item.number}元`,
            date: item.date
          }
          incomeList.push(tmpObj)
        } else {
          const tmpObj = {
            title: item.note,
            note: `支出${item.number}元`,
            date: item.date
          }
          expenseList.push(tmpObj)
        }
      })
    }
    let incomeRender = incomeList.map(item => {
      return <AtListItem
        key={item.date}
        title={item.title}
        note={item.note}
        arrow='right'
        thumb='https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png'
      />
    })
    let expenseRender = expenseList.map(item => {
      return <AtListItem
        key={item.date}
        title={item.title}
        note={item.note}
        arrow='right'
        thumb='http://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png'
      />
    })

    return (
      <View className='index-wrapper'>
        <View className='index-header'>
          <NavBar />
        </View>
        <View className='index-content'>
            <Content />
        </View>
        <View className='index-footer'>
          <TabBar />
        </View>
        {/*<View className='at-row at-row__justify--between header-container'>*/}
          {/*<View className='at-col at-col-5 book-name'>*/}
            {/*{bookName}*/}
            {/*<View*/}
              {/*className='edit-book at-icon at-icon-edit'*/}
              {/*onClick={this.editBook}*/}
            {/*/>*/}
          {/*</View>*/}
          {/*<View*/}
            {/*className='at-col at-col-3'*/}
            {/*onClick={this.changeBook}*/}
          {/*>*/}
            {/*<View className='change-book-button'>切换账本</View>*/}
          {/*</View>*/}
        {/*</View>*/}
        {/*<View className='content-container'>*/}
          {/*<View className='content-header at-row'>*/}
            {/*<View className='at-col-4'>*/}
              {/*<Picker*/}
                {/*mode='date'*/}
                {/*fields='month'*/}
                {/*onChange={this.onDateChange}*/}
              {/*>*/}
                {/*<View className='at-icon at-icon-calendar content-item-icon'></View>*/}
                {/*<View className='content-header-year'>{bookYear}年</View>*/}
                {/*<View className='content-header-month'>{bookMonth}月</View>*/}
              {/*</Picker>*/}
            {/*</View>*/}
            {/*<View className='at-col-4'>*/}
              {/*<View className='at-icon at-icon-credit-card content-item-icon'></View>*/}
              {/*<View className='content-expense'>支出</View>*/}
              {/*<View className='content-expense-number'>¥ {expense}</View>*/}
            {/*</View>*/}
            {/*<View className='at-col-4'>*/}
              {/*<View className='at-icon at-icon-money content-item-icon'></View>*/}
              {/*<View className='content-income'>收入</View>*/}
              {/*<View className='content-income-number'>¥ {income}</View>*/}
            {/*</View>*/}
          {/*</View>*/}
          {/*<View className='content-wrapper'>*/}
            {/*<Text className='content-title'>收入</Text>*/}
            {/*<AtList className='content-list'>*/}
              {/*{incomeList.length > 0*/}
                {/*? incomeRender*/}
                {/*: <Text className='no-data'>暂无数据</Text>*/}
              {/*}*/}
            {/*</AtList>*/}
          {/*</View>*/}
          {/*<View className='content-wrapper'>*/}
            {/*<Text className='content-title'>支出</Text>*/}
            {/*<AtList className='content-list'>*/}
              {/*{expenseList.length > 0*/}
                {/*? expenseRender*/}
                {/*: <Text className='no-data'>暂无数据</Text>*/}
              {/*}*/}
            {/*</AtList>*/}
          {/*</View>*/}
        {/*</View>*/}
      </View>
    )
  }
}

export default Index
