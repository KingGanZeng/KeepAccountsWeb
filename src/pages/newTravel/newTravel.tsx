
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
import { AtImagePicker, AtInput, AtButton } from 'taro-ui'
import { NewTravelProps, NewTravelState } from './newTravel.interface'
import './newTravel.scss'

@connect(({ newTravel }) => ({
    ...newTravel,
}))

class NewTravel extends Component<NewTravelProps,NewTravelState > {
  config:Config = {
    navigationBarTitleText: '创建旅行聚会'
  }
  constructor(props: NewTravelProps) {
    super(props)
    this.state = {
      imageFile: [],
      titleInput: '',
    }
  }

  /**
   * 照片修改时
   * @param imageFile
   */
  onImageChange(imageFile, operationType, index) {
    console.log(imageFile, operationType, index)
    this.setState({
      imageFile
    })
  }

  onFail (mes) {
    console.log(mes)
  }

  onImageClick (index, file) {
    console.log(index, file)
  }

  handleInputChange (titleInput) {
    this.setState({
      titleInput
    })
  }

  jumpToNewBook() {
    // TODO: 生成新账本
    Taro.navigateTo({
      url: "/pages/index/index?bookId=" + 2222 +
        '&bookName=' + '旅行聚会2' +
        '&bookType=' + 'homeDecoration'
    })
  }

  // 页面挂载时执行
  componentDidMount() {

  }

  render() {
    return (
      <View className='newTravel-wrap'>
        <View className='image-wrapper'>
          <AtImagePicker
            files={this.state.imageFile}
            onChange={this.onImageClick.bind(this)}
          />
        </View>
        <View className='input-wrapper'>
          <AtInput
            name='value'
            value={this.state.titleInput}
            type='text'
            placeholder='请输入旅行聚会的额名称，如:台湾环岛游'
            onChange={this.handleInputChange.bind(this)}
            clear
          />
        </View>
        <View className='button-wrapper'>
          <AtButton type='primary' onClick={this.jumpToNewBook}>确定</AtButton>
        </View>
      </View>
    )
  }
}

export default NewTravel
