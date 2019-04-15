import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { WishProps, WishState } from './wish.interface'
import './wish.scss'
import {MAINHOST} from "../../config";
import {AtModal, AtToast} from "taro-ui";

class Wish extends Component<WishProps,WishState > {
  config:Config = {
    navigationBarTitleText: '我的心愿'
  }
  constructor(props: WishProps) {
    super(props)
    this.state = {
      wishList: [],
      hasError: false,
      hasErrorMsg: '修改成功',
      hasErrorIcon: 'check-circle',
      modalOpenState: false,
      modalContent: '',
      nowEditWishItem: {},
      nowIndex: 0,
    }
  }

  async getWishes() {
    const uid = Taro.getStorageSync('uid')
    let result:any = await Taro.request({
      method: "GET",
      url: `${MAINHOST}/api/getWishList`,
      data: {
        uid: uid
      },
    })
    if (result.data) {
      this.setState({
        wishList: result.data.results
      })
    }
  }

  async changeWishState(wishId, finishState) {
    const uid = Taro.getStorageSync('uid')
    const result = await Taro.request({
      method: "PUT",
      url: `${MAINHOST}/api/changeWish/${wishId}`,
      data: {
        uid: uid,
        wish_name: this.state.nowEditWishItem.wish_name,
        end_time: this.state.nowEditWishItem.end_time,
        wish_first_category: this.state.nowEditWishItem.wish_first_category,
        wish_second_category: this.state.nowEditWishItem.wish_second_category,
        money: this.state.nowEditWishItem.money,
        note: this.state.nowEditWishItem.note,
        weight: this.state.nowEditWishItem.weight,
        is_finished: finishState
      },
    })
    if (result.data.wish_id) {
      this.setState({
        hasError: true,
        hasErrorMsg: '修改成功',
        hasErrorIcon: 'check-circle',
      })
      return true;
    } else {
      this.setState({
        hasError: true,
        hasErrorMsg: '修改失败',
        hasErrorIcon: 'close-circle',
      })
      return false;
    }
  }

  /**
   * 修改wish状态，弹出窗确认
   * @param wishItem
   */
  handleWishStateChange(wishItem, index) {
    const hasFinished = !wishItem.is_finished ? '已完成' : '未完成'
    this.setState({
      modalOpenState: true,
      modalContent: `确认修改【${wishItem.wish_name}】的完成状态为【${hasFinished}】`,
      nowEditWishItem: wishItem,
      nowIndex: index,
    })
  }

  /**
   * 弹出框取消事件
   */
  handleChangeFinishCancel() {
    this.setState({
      modalOpenState: false,
      modalContent: '',
    })
  }

  /**
   * 弹出框确认事件，修改状态
   */
  async handleChangeFinishConfirm() {
    const tmpWish = this.state.wishList;
    tmpWish[this.state.nowIndex].is_finished = !this.state.nowEditWishItem.is_finished;
    const result = await this.changeWishState(this.state.nowEditWishItem.wish_id, tmpWish[this.state.nowIndex].is_finished)
    if (result) {
      this.setState({
        wishList: tmpWish,
        modalOpenState: false,
        modalContent: '',
      })
    } else {
      this.setState({
        modalOpenState: false,
        modalContent: '',
      })
    }
  }

  /**
   * 跳转到愿望编辑页面
   */
  handleWishEdit(wishItem) {
    Taro.navigateTo({
      url: '/pages/newWish/newWish?' +
        'wish_id=' + wishItem.wish_id
    })
  }

  /**
   * 跳转到添加愿望界面
   */
  jumpToNewWish() {
    Taro.navigateTo({
      url: '/pages/newWish/newWish'
    })
  }

  async componentDidShow() {
    await this.getWishes()
  }

  render() {
    const wishes = this.state.wishList
    const wishView = wishes.map((wish, index) => {
      const isFinished = wish.is_finished ? 'finished-active' : '';
      const itemClass = `finished-check-box ${isFinished}`
      return (
        <View
          className='wish-item'
          key={index}
        >
          <View className='wish-header at-row'>
            <View
              className='at-col at-col-1 wish-state'
              onClick={this.handleWishStateChange.bind(this, wish, index)}
            >
              <View className={itemClass}>
                {wish.is_finished && <View className='at-icon at-icon-check' />}
              </View>
            </View>
            <View
              className='at-col at-col-7 wish-name'
            >{wish.wish_name}</View>
            <View
              className='at-col at-col-4 wish-weight'
            >权重:{wish.weight}%</View>
          </View>
          <View
            className='wish-content'
            onClick={this.handleWishEdit.bind(this, wish)}
          >
            <View className='wish-category-wrapper'>
              类型：{wish.wish_first_category}-{wish.wish_second_category}
            </View>
            <View className='wish-end-time'>
              截止日期：{wish.end_time.split('T')[0]}
            </View>
          </View>
        </View>
      )
    })

    return (
      <View className='wish-wrap'>
        <AtToast
          isOpened={this.state.hasError}
          text={this.state.hasErrorMsg}
          icon={this.state.hasErrorIcon}
          hasMask
        />
        <AtModal
          isOpened={this.state.modalOpenState}
          title='确认修改完成状态'
          cancelText='取消'
          confirmText='确认'
          onClose={this.handleChangeFinishCancel}
          onCancel={this.handleChangeFinishCancel}
          onConfirm={this.handleChangeFinishConfirm}
          content={this.state.modalContent}
        />
        {wishes.length > 0 &&
        <View className='wish-container'>
          {wishView}
        </View>
        }
        <View className='single-button-footer'>
          <View
            className='single-button'
            onClick={this.jumpToNewWish}
          >添加愿望</View>
        </View>
      </View>
    )
  }
}

export default Wish
