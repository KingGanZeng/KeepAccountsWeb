
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
import { AtInput, AtForm, AtButton } from 'taro-ui'
import { NewBookProps, NewBookState } from './newBook.interface'
import './newBook.scss'
// import { } from '../../components'


@connect(({ newBook }) => ({
  ...newBook,
}))

class NewBook extends Component<NewBookProps,NewBookState > {
  config:Config = {
    navigationBarTitleText: '新建/修改账本'
  }
  constructor(props: NewBookProps) {
    super(props)
    const defBookType = decodeURIComponent(this.$router.params.booktype)
    this.state = {
      peopleNum: 1,
      bookName: '我的账本',
      bookType: defBookType,
      loading: false,
    }
  }

  async componentDidMount() {
    if (this.$router.params.book_id) {
      await this.getBookInfo()
    }
  }

  handleChange(valueName, value) {
    this.setState({
      [valueName]: value
    })
  }

  /**
   * 创建新账本
   * @param {string} user_name 用户名
   * @param {string} book_name 账本名
   * @param {string} book_type 账本种类
   * @param {number} people_num 参与人数(非必填)
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
        people_num: this.state.peopleNum
      }
    })
  }

  /**
   * 编辑账本时获取账本信息
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

  async onSubmit () {
    this.setState({
      loading: true
    })
    await this.createBook()
    console.log("提交数据完成", this.props.submitSuccess);
    setTimeout(
      () => {
        Taro.redirectTo({
          url: '/pages/accountBook/accountBook'
        })
      },
      300
    )
  }

  onReset () {
    this.setState({
      peopleNum: 1,
      bookName: '',
    })
    console.log("重置数据", this.state);
  }

  render() {
    return (
      <View className='newBook-container'>
        <AtForm
          className='newBook-wrap'
          onSubmit={this.onSubmit.bind(this)}
          onReset={this.onReset.bind(this)}
        >
          <AtInput
            name='bookName'
            title='账本名称'
            type='text'
            value={this.state.bookName}
            placeholder={this.state.bookName}
            onChange={this.handleChange.bind(this, 'bookName')}
          />
          <AtInput
            name='peopleNum'
            title='参与人数'
            type='number'
            className='input-margin-bottom'
            value={this.state.peopleNum}
            placeholder={this.state.peopleNum}
            onChange={this.handleChange.bind(this, 'peopleNum')}
          />
          <AtButton
            formType='submit'
            type='primary'
            loading={this.state.loading}
            circle='true'
            className='form-button'
          >提交</AtButton>
          <AtButton
            formType='reset'
            type='secondary'
            circle='true'
            className='form-button'
          >重置</AtButton>
        </AtForm>
      </View>
    )
  }
}

export default NewBook
