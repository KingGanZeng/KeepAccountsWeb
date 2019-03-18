import Taro, { Component, Config } from '@tarojs/taro'
import { View, Picker, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtInput, AtForm, AtButton, AtSwitch } from 'taro-ui'
import { bookNameTranslate } from '../../utils/common'
import { NewBookProps, NewBookState } from './newBook.interface'
import './newBook.scss'


@connect(({ newBook }) => ({
  ...newBook,
}))

class NewBook extends Component<NewBookProps,NewBookState > {
  config:Config = {
    navigationBarTitleText: '编辑账本'
  };
  constructor(props: NewBookProps) {
    super(props);
    const defBookType = decodeURIComponent(this.$router.params.bookType);
    const defBookName = decodeURIComponent(this.$router.params.bookName);
    this.state = {
      bookType: defBookType,
      bookCategory: ['日常开销', '出游聚会', '居家装修', '人情往来', '投资理财', '租房居住', '借还记录'],
      bookCategoryChecked: bookNameTranslate('English', defBookType) || '日常开销',
      bookName: defBookName==='undefined' ? '新建账本' : defBookName,
      budget: 0, // 账本预算
      hasGroup: false,
      loading: false,
    }
  }

  /**
   * 创建新账本
   * @return Promise<*>
   *
   */
  async createBook() {
    return await this.props.dispatch({
      type: 'newBook/createBook',
      payload: {
        user_name: 'zenggan',
        book_name: this.state.bookName,
        book_type: this.state.bookType,
      }
    })
  }

  /**
   * 创建小组
   */
  async createGroup() {
    return await this.props.dispatch({
      type: 'newBook/createGroup',
      payload: {
        user_name: 'zenggan',
        uid: 'DSADW21',
      }
    })
  }

  /**
   * 获取账本信息
   */
  async getBookInfo() {
    return await this.props.dispatch({
      type: 'newBook/getBookInfo',
      payload: {
        user_name: 'zenggan',
        book_id: this.$router.params.book_id
      }
    })
  }

  /**
   * 确定提交
   */
  onSubmit () {
    if (this.state.hasGroup) {
      this.createGroup()
    }
    this.createBook();
    setTimeout(
      () => {
        Taro.redirectTo({
          url: '/pages/accountBook/accountBook'
        })
      },
      300
    )
  }

  /**
   * 重置按钮
   */
  onReset () {
    this.setState({
      bookType: 'dayLife',
      bookName: '新建账本',
      bookCategoryChecked: '日常开销',
      hasGroup: false,
    });
  }

  /**
   * 账本名称修改
   * @param valueName
   * @param value
   */
  handleChange(valueName, value) {
    let data = {};
    data[valueName] = value;
    this.setState(data)
  }

  /**
   * 切换账本类型
   * @param e
   */
  onCategoryChange = e => {
    this.setState({
      bookCategoryChecked: this.state.bookCategory[e.detail.value]
    })
  };

  /**
   * 切换小组状态
   * @param value
   */
  handleGroupChange = value => {
    this.setState({
      hasGroup: value,
    })
  };

  componentDidMount() {
    if (this.$router.params.book_id) {
      this.getBookInfo()
    }
  }

  render() {
    return (
      <View className='newBook-container'>
        <View className='iconfont icon-signature' />
        <AtForm
          className='newBook-wrap'
          onSubmit={this.onSubmit.bind(this)}
          onReset={this.onReset.bind(this)}
        >
          <View className='book-setting-label'>账本名称</View>
          <AtInput
            name='bookName'
            type='text'
            className='name-wrapper'
            maxLength={6}
            value={this.state.bookName}
            placeholder={this.state.bookName}
            onChange={this.handleChange.bind(this, 'bookName')}
            autoFocus
            border={false}
          />
          <View className='book-setting-label'>账本设置</View>
          <Picker
            mode='selector'
            range={this.state.bookCategory}
            onChange={this.onCategoryChange}
            value={0}
          >
            <View className='picker-wrapper half-border-bottom border-bottom'>
              账本类型
              <Text className='picker-content'>{this.state.bookCategoryChecked}</Text>
              <View className='at-icon at-icon-chevron-right' />
            </View>
          </Picker>
          <AtInput
            name='bookName'
            type='number'
            title='账本预算'
            className='name-wrapper'
            value={this.state.budget}
            placeholder={this.state.budget.toString()}
            onChange={this.handleChange.bind(this, 'budget')}
            autoFocus
          />
          <AtSwitch
            title='是否开启小组'
            checked={this.state.hasGroup}
            onChange={this.handleGroupChange}
            className='input-margin-bottom'
            border={false}
            color='#ff5a5b'
          />
          <View className='button-wrapper'>
            <View className='button-item'>
              <AtButton
                type='primary'
                formType='submit'
                className='form-button submit-button'
                loading={this.state.loading}
              >
                提交
              </AtButton>
            </View>
            <View className='button-item'>
              <AtButton
                formType='reset'
                type='secondary'
                className='form-button'
              >
                重置
              </AtButton>
            </View>
          </View>
        </AtForm>
      </View>
    )
  }
}

export default NewBook
