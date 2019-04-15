import Taro, { Component, Config } from '@tarojs/taro'
import {View, Text, Picker} from '@tarojs/components'
import {AtButton, AtForm, AtToast} from "taro-ui";
import { NewWishProps, NewWishState } from './newWish.interface'
import './newWish.scss'
import ContentInput from "../../components/ContentInput/ContentInput";
import {globalData, wishCategoryTranslate} from "../../utils/common";
import {MAINHOST} from "../../config";
// import { } from '../../components'

class NewWish extends Component<NewWishProps,NewWishState > {
  config:Config = {
    navigationBarTitleText: '添加愿望'
  }
  constructor(props: NewWishProps) {
    super(props)
    this.state = {
      wishName: '',
      endTime: '',
      wishLevelOneCategory: globalData.wishLevelOneCategory,
      wishLevelOneCategoryCheck: '',
      showLevelTwoCategory: false,
      wishLevelTwoCategory: [],
      wishLevelTwoCategoryCheck: '',
      money: 0,
      note: '',
      weight: 0,
      is_finished: false,
      hasError: false,
      hasErrorMsg: '新建愿望错误',
      hasErrorIcon: 'close-circle',
    }
  }

  /**
   * 获取wish信息
   * @param wishId
   */
  async getWish(wishId) {
    let result:any = await Taro.request({
      method: "GET",
      url: `${MAINHOST}/api/getWishList`,
      data: {
        wish_id: wishId
      },
    })
    if (result.data.results) {
      result = result.data.results[0]
      let levelTwoCategory = wishCategoryTranslate(result.wish_first_category)
      this.setState({
        wishName: result.wish_name,
        endTime: result.end_time.split('T')[0],
        wishLevelOneCategoryCheck: result.wish_first_category,
        showLevelTwoCategory: true,
        wishLevelTwoCategory: globalData.wishLevelTwoCategory[levelTwoCategory],
        wishLevelTwoCategoryCheck: result.wish_second_category,
        money: result.money,
        note: result.note,
        weight: result.weight,
        is_finished: result.is_finished,
      })
    }
  }

  /**
   * 删除愿望
   * @param wishId
   */
  async deleteWish(wishId) {
    const result:any = await Taro.request({
      method: "DELETE",
      url: `${MAINHOST}/api/changeWish/${wishId}`,
    })
    if(result.data.detail) {
      this.setState({
        hasError: true,
        hasErrorMsg: '暂无法删除该愿望',
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
   * 创建愿望
   * @param createData
   */
  async createWish(createData) {
    const result = await Taro.request({
      method: "POST",
      url: `${MAINHOST}/api/createWish`,
      data: createData,
    })
    if (result.data.wish_id) {
      this.setState({
        hasError: true,
        hasErrorMsg: '创建成功',
        hasErrorIcon: 'check-circle',
      }, () => {
        setTimeout(() => {
          Taro.navigateBack({
            delta: 1
          })
        }, 500)
      })
    }
  }

  /**
   * 修改愿望信息
   * @param updateData
   */
  async updateWish(updateData) {
    const wishId = decodeURIComponent(this.$router.params.wish_id)
    const result = await Taro.request({
      method: "PUT",
      url: `${MAINHOST}/api/changeWish/${wishId}`,
      data: updateData,
    })
    if (result.data.wish_id) {
      this.setState({
        hasError: true,
        hasErrorMsg: '修改成功',
        hasErrorIcon: 'check-circle',
      }, () => {
        setTimeout(() => {
          Taro.navigateBack({
            delta: 1
          })
        }, 500)
      })
    }
  }

  /**
   * 提交愿望
   */
  async onSubmit() {
    const uid = Taro.getStorageSync('uid')
    const wishId = decodeURIComponent(this.$router.params.wish_id) || ''
    const uploadData = {
      uid: uid,
      wish_name: this.state.wishName,
      end_time: this.state.endTime + ' 00:00',
      wish_first_category: this.state.wishLevelOneCategoryCheck,
      wish_second_category: this.state.wishLevelTwoCategoryCheck,
      money: this.state.money,
      note: this.state.note,
      weight: this.state.weight,
      is_finished: this.state.is_finished,
    }
    for (const item of Object.keys(uploadData)) {
      // 判断是否都填写完成
      if (uploadData[item] === '') {
        this.setState({
          hasError: true,
          hasErrorMsg: '请完善愿望信息',
          hasErrorIcon: 'alert-circle',
        }, () => {
          setTimeout(() => {
            this.setState({
              hasError: false,
              hasErrorMsg: '新建愿望错误',
              hasErrorIcon: 'close-circle',
            })
          }, 800)
        })
        return;
      }
    }
    // 判断是否有wish_id，有则为更新，无则为创建
    if (wishId && wishId !== 'undefined') {
      await this.updateWish(uploadData)
    } else {
      await this.createWish(uploadData)
    }
  }

  /**
   * 删除或重置愿望
   */
  async onReset() {
    const wishId = decodeURIComponent(this.$router.params.wish_id)
    if(wishId) {
      await this.deleteWish(wishId)
    } else {
      this.setState({
        wishName: '',
        endTime: '',
        wishLevelOneCategory: globalData.wishLevelOneCategory,
        wishLevelOneCategoryCheck: '',
        showLevelTwoCategory: false,
        wishLevelTwoCategory: [],
        wishLevelTwoCategoryCheck: '',
        money: 0,
        note: '',
        weight: 0,
        is_finished: false,
      })
    }
  }

  /**
   * 接收子组件信息，修改输入框信息
   * @param inputName
   * @param inputContent
   */
  onInputChange(inputName, inputContent) {
    if(inputName == 'wishName') {
      this.setState({
        wishName: inputContent
      })
    } else if(inputName == 'money') {
      this.setState({
        money: inputContent
      })
    } else if(inputName == 'note') {
      this.setState({
        note: inputContent
      })
    } else if(inputName == 'weight') {
      this.setState({
        weight: inputContent
      })
    }
  }

  /**
   * 修改时间
   * @param e
   */
  onDateChange = e => {
    this.setState({
      endTime: e.detail.value
    })
  }

  /**
   * 一级类目修改
   * @param e
   */
  onWishLevelOneCategoryChange = e => {
    const nowCategory = this.state.wishLevelOneCategory[e.detail.value];
    // 转义一级类目
    let levelTwoCategory = wishCategoryTranslate(nowCategory)
    this.setState({
      wishLevelOneCategoryCheck: nowCategory,
      wishLevelTwoCategory: globalData.wishLevelTwoCategory[levelTwoCategory],
      showLevelTwoCategory: true,
    }, () => {
      console.log(this.state.wishLevelOneCategoryCheck)
    })
  }

  /**
   * 修改二级类目信息
   * @param e
   */
  onWishLevelTwoCategoryChange = e => {
    this.setState({
      wishLevelTwoCategoryCheck: this.state.wishLevelTwoCategory[e.detail.value],
    }, () => {
      console.log(this.state.wishLevelTwoCategoryCheck)
    })
  }

  async componentDidMount() {
    const wishId = decodeURIComponent(this.$router.params.wish_id)
    if(wishId && wishId !== 'undefined') {
      // 如果存在wishId 则获取wish信息后渲染
      await this.getWish(wishId)
    }
  }

  render() {
    // @ts-ignore
    const pickValue = this.state.wishLevelOneCategory.reduce((previousValue, currentValue, currentIndex) => {
      if(this.state.wishLevelOneCategoryCheck == currentValue) {
        return currentIndex
      }
    });

    let pickSecondValue:any = '';
    if (this.state.wishLevelTwoCategory.length > 0) {
      // @ts-ignore
      pickSecondValue = this.state.wishLevelTwoCategory.reduce((previousValue, currentValue, currentIndex) => {
        if(this.state.wishLevelTwoCategoryCheck == currentValue) {
          return currentIndex
        }
      });
    }

    return (
      <View className='newWish-wrap'>
        <AtToast
          isOpened={this.state.hasError}
          text={this.state.hasErrorMsg}
          icon={this.state.hasErrorIcon}
          hasMask
        />
        <AtForm
          className='newWish-content'
          onSubmit={this.onSubmit.bind(this)}
          onReset={this.onReset.bind(this)}
        >
          <View className='iconfont icon-signature' />
          <ContentInput
            value={this.state.wishName}
            onInput={this.onInputChange.bind(this)}
            inputName='wishName'
            placeholder='名称'
          />
          <Picker
            mode='date'
            value={this.state.endTime}
            onChange={this.onDateChange.bind(this)}
          >
            <View className='picker-wrapper'>
              到期时间
              <Text
                className='picker-content'
              >{this.state.endTime}</Text>
              <View className='at-icon at-icon-chevron-right' />
            </View>
          </Picker>
          <Picker
            mode='selector'
            range={this.state.wishLevelOneCategory}
            onChange={this.onWishLevelOneCategoryChange}
            value={pickValue}
          >
            <View className='picker-wrapper'>
              愿望类别
              <Text
                className='picker-content'
              >{this.state.wishLevelOneCategoryCheck}</Text>
              <View className='at-icon at-icon-chevron-right' />
            </View>
          </Picker>
          {this.state.showLevelTwoCategory &&
          <Picker
            mode='selector'
            range={this.state.wishLevelTwoCategory}
            onChange={this.onWishLevelTwoCategoryChange}
            value={pickSecondValue}
          >
            <View className='picker-wrapper'>
              子类目
              <Text
                className='picker-content'
              >{this.state.wishLevelTwoCategoryCheck}</Text>
              <View className='at-icon at-icon-chevron-right' />
            </View>
          </Picker>
          }
          <ContentInput
            value={this.state.money.toString()}
            onInput={this.onInputChange.bind(this)}
            inputName='money'
            placeholder='预算(元)'
          />
          <ContentInput
            value={this.state.note}
            onInput={this.onInputChange.bind(this)}
            inputName='note'
            placeholder='备注'
          />
          <ContentInput
            value={this.state.weight.toString()}
            onInput={this.onInputChange.bind(this)}
            inputName='weight'
            placeholder='权重(0-100)'
          />
          <View className='button-wrapper at-row'>
            <View className='button-item at-col'>
              <AtButton
                type='primary'
                formType='submit'
                className='form-button submit-button'
              >
                <View className='at-icon at-icon-check' />
              </AtButton>
            </View>
            <View className='button-item at-col'>
              <AtButton
                formType='reset'
                type='secondary'
                className='form-button'
              >
                <View className='at-icon at-icon-trash' />
              </AtButton>
            </View>
          </View>
        </AtForm>
      </View>
    )
  }
}

export default NewWish
