import Taro, { Component, Config } from '@tarojs/taro'
import {View, Text, Picker} from '@tarojs/components'
import { NewWishProps, NewWishState } from './newWish.interface'
import './newWish.scss'
import {AtButton, AtForm, AtToast} from "taro-ui";
import ContentInput from "../../components/ContentInput/ContentInput";
// import { } from '../../components'

class NewWish extends Component<NewWishProps,NewWishState > {
  config:Config = {
    navigationBarTitleText: '标题'
  }
  constructor(props: NewWishProps) {
    super(props)
    this.state = {
      wishName: '',
      endTime: '',
      category: '',
      categorCheck: '',
      money: 0,
      note: '',
      weight: 0,
      loading: false,
      hasError: false,
      hasErrorMsg: '新建账本错误',
      hasErrorIcon: 'close-circle',
    }
  }

  componentDidMount() {

  }

  render() {
    return (
      <View className='newWish-wrap'>
        <AtToast
          isOpened={this.state.hasError}
          text={this.state.hasErrorMsg}
          icon={this.state.hasErrorIcon}
          hasMask
        />
        <AtForm
          className='newBook-wrap'
          onSubmit={this.onSubmit.bind(this)}
          onReset={this.onReset.bind(this)}
        >
          <View className='iconfont icon-signature' />
          <ContentInput
            value={this.state.bookName}
            onInput={this.onInputChange.bind(this)}
            inputName='bookName'
            placeholder=''
          />
          <ContentInput
            value={this.state.budget.toString()}
            onInput={this.onInputChange.bind(this)}
            inputName='bookBudget'
            placeholder='账本预算(元)'
          />
          <Picker
            mode='selector'
            range={this.state.bookCategory}
            onChange={this.onCategoryChange}
            value={pickValue}
            disabled={this.state.hasBookId}
          >
            <View className='picker-wrapper'>
              账本类型
              <Text className='picker-content'>{this.state.bookCategoryChecked}</Text>
              <View className='at-icon at-icon-chevron-right' />
            </View>
          </Picker>
          <View className='button-wrapper at-row'>
            <View className='button-item at-col'>
              <AtButton
                type='primary'
                formType='submit'
                className='form-button submit-button'
                loading={this.state.loading}
              >
                {this.$router.params.bookId ? '修改' : '提交'}
              </AtButton>
            </View>
            <View className='button-item at-col'>
              <AtButton
                formType='reset'
                type='secondary'
                className='form-button'
              >
                {this.$router.params.bookId ? '删除' : '重置'}
              </AtButton>
            </View>
          </View>
        </AtForm>
      </View>
    )
  }
}

export default NewWish
