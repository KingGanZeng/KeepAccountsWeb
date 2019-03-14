import Taro, { Component } from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'
import { NavBarProps, NavBarState } from './NavBar.interface'
import './NavBar.scss'
import { addZero } from '../../utils/common'

class NavBar extends Component<NavBarProps,NavBarState > {
  constructor(props: NavBarProps) {
    super(props);
    this.state = {
      date: this.props.yearMonthStr,
      income: this.props.navBarData.incomeCount,
      expense: this.props.navBarData.expenseCount,
    }
  }
  static options = {
    addGlobalClass: true
  };
  static defaultProps:NavBarProps = {
    yearMonthStr: '2019-02',
    navBarData: {
      incomeCount: 0,
      expenseCount: 0,
    }
  };

  /**
   * 日期选择器
   * @param e
   */
  onDateChange = e => {
    this.setState({
      date: e.detail.value
    }, () => {
      this.props.onDateState(this.state.date)
    })
  };

  /**
   * 账本编辑按钮事件
   */
  jumpToEdit() {
    const bookId = this.$router.params.bookId;
    const bookType = this.$router.params.bookType;
    Taro.navigateTo({
      url: '/pages/newBook/newBook?book_id=' + bookId + '&book_type=' + bookType
    })
  }

  render() {
    // 设置时间
    const bookYear = this.state.date.split('-')[0];
    let bookMonth= this.state.date.split('-')[1];
    bookMonth = addZero(bookMonth);

    return (
      <View className='fx-NavBar-wrap'>
        <View className='at-row'>
          <View
            className='book-name at-col'
            onClick={this.jumpToEdit}
          >
            默认账本
            <View className='at-icon at-icon-edit' />
          </View>
          <View className='choose-date at-col border-shadow'>
            <Picker
              mode='date'
              fields='month'
              onChange={this.onDateChange}
              value={this.state.date}
            >
              <View className='at-row'>
                <View className='at-col at-col-1 at-col--auto'>
                  <View className='at-icon at-icon-calendar' />
                </View>
                <View className='at-col at-col-1 at-col--auto navBar-year'>{bookYear}年</View>
                <View className='at-col at-col-1 at-col--auto navBar-month'>{bookMonth}月</View>
              </View>
            </Picker>
          </View>
        </View>
        <View className='at-row footer-wrapper'>
          <View className='at-col navBar-footer half-border-right border-test'>
            <View className='footer-title'>收入</View>
            <View className='footer-content book-expense'>{this.state.income.toFixed(2)}元</View>
          </View>
          <View className='at-col navBar-footer half-border-right border-test'>
            <View className='footer-title'>支出</View>
            <View className='footer-content book-income'>{this.state.expense.toFixed(2)}元</View>
          </View>
          <View className='at-col navBar-footer'>
            <View className='footer-title'>结余</View>
            <View className='footer-content'>{(this.state.income-this.state.expense).toFixed(2)}元</View>
          </View>
        </View>
      </View>
    );
  }
}

export default NavBar
