
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
import {AtImagePicker, AtInput, AtButton, AtToast} from 'taro-ui'
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
      sBookId: decodeURIComponent(this.$router.params.bookId) || '',
      hasBookId: false,
      imageFile: [],
      titleInput: '',
      budget: 0,
      bookType: '',
      username: '',
      uid: '',
      hasError: false,
      hasErrorMsg: '新建记录错误',
      hasErrorIcon: 'close-circle',
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

  /**
   * 获取账本信息
   */
  async getBookInfo() {
    let result:any;
    result = await Taro.request({
      method: 'GET',
      url: `${MAINHOST}/api/getBookList`,
      data: {
        uid: this.state.uid,
        book_id: parseInt(this.$router.params.bookId)
      }
    });
    if (result.data.results.length > 0) {
      result = result.data.results[0];
      this.setState({
        hasBookId: true,
        bookType: result.book_type,
        imageFile: {
          url: result.image_url,
        },
        titleInput: result.book_name,
        budget: parseFloat(result.budget), // 账本预算
      }, () => {
        console.log("数据获取完毕")
      })
    }
  }

  /**
   * 修改账本信息
   */
  async changeBook() {
    const bookId = decodeURIComponent(this.$router.params.bookId);
    const result = await Taro.request({
      method: 'PUT',
      url: `${MAINHOST}/api/bookChangeApi/${bookId}`,
      data: {
        username: this.state.username,
        uid: this.state.uid,
        book_name: this.state.titleInput,
        book_type: this.state.bookType,
        budget: this.state.budget,
        image_url: this.state.imageFile.url
      }
    });
    // @ts-ignore
    if(result.data.book_id) {
      this.setState({
        hasError: true,
        hasErrorMsg: '修改成功',
        hasErrorIcon: 'check-circle',
      }, () => {
        // 跳转回账本页面
        setTimeout(() => {
          Taro.redirectTo({
            url: '/pages/accountBook/accountBook'
          })
        }, 800)
      })
    } else {
      this.setState({
        hasError: true,
        hasErrorMsg: '修改失败',
      })
    }
  }

  async deleteBook() {
    const bookId = decodeURIComponent(this.$router.params.bookId);
    const result = await await Taro.request({
      method: 'DELETE',
      url: `${MAINHOST}/api/bookChangeApi/${bookId}`,
    });
    if(result.data.detail) {
      this.setState({
        hasError: true,
        hasErrorMsg: '暂无法删除该记录',
      })
    } else {
      this.setState({
        hasError: true,
        hasErrorMsg: '删除成功',
        hasErrorIcon: 'check-circle',
      }, () => {
        // 跳转回账本页面
        setTimeout(() => {
          Taro.navigateBack({
            delta: 1
          })
        }, 800)
      })
    }
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
    if (result.book_id) {
      const addToMain = await Taro.request({
        method: 'POST',
        url: `${MAINHOST}/api/addSpecialBookItem`,
        data: {
          s_book_id: this.state.sBookId,
          book_id: result.book_id
        }
      });
      if (addToMain.data.hasAdd) {
        Taro.navigateBack({ // 返回账本首页
          delta: 1
        })
      }
    }
  }

  // 页面挂载时执行
  componentWillMount() {
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
        <AtToast
          isOpened={this.state.hasError}
          text={this.state.hasErrorMsg}
          icon={this.state.hasErrorIcon}
          hasMask
        />
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
        { this.state.hasBookId && <View className='button-wrapper'>
          <AtButton
            type='primary'
            onClick={this.changeBook}
          >确认修改</AtButton>
          <AtButton
            type='primary'
            onClick={this.deleteBook}
          >删除账本</AtButton>
        </View>}
        { !this.state.hasBookId && <View className='button-wrapper'>
          <AtButton
            type='primary'
            onClick={this.jumpToNewBook}
          >确定</AtButton>
        </View> }
      </View>
    )
  }
}

export default NewTravel
