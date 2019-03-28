
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
import { AtImagePicker, AtInput, AtButton } from 'taro-ui'
import { NewTravelProps, NewTravelState } from './newTravel.interface'
import './newTravel.scss'
import {MAINHOST} from "../../config";

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
      budget: 0,
      username: '',
      uid: '',
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

  getBookInfo() {

  }

  /**
   * 生成新账本并跳转
   */
  async jumpToNewBook() {
    let result:any = await Taro.request({
      method: 'POST',
      url: `${MAINHOST}/api/createBook`,
      data: {
        username: this.state.username,
        uid: this.state.uid,
        book_name: this.state.titleInput,
        book_type: 'travelParty',
        budget: this.state.budget,
        imageFile: this.state.imageFile.url,
      }
    });
    result = result.data;
    if (result.results.length > 0) {
      result = result.results[0]
      Taro.navigateTo({
        url: "/pages/index/index?bookId=" + result.book_id +
          '&bookName=' + result.book_name +
          '&bookType=' + result.book_type
      })
    }
  }

  // 页面挂载时执行
  componentDidMount() {
    const username = Taro.getStorageSync('username');
    const uid = Taro.getStorageSync('uid');
    this.setState({
      uid: uid,
      username: username,
    }, () => {
      if (this.$router.params.bookId) {
        this.getBookInfo()
      }
    });
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
