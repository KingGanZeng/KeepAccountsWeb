import Taro, { Component } from '@tarojs/taro'
import { View,  Picker } from '@tarojs/components'
import { AtModal, AtModalContent, AtInput } from "taro-ui"
import { addZero } from "../../utils/common";
import { CategoryListProps, CategoryListState } from './CategoryList.interface'
import './CategoryList.scss'
import '../../assets/iconfont/iconfont.scss'

class CategoryList extends Component<CategoryListProps,CategoryListState > {
  constructor(props: CategoryListProps) {
    super(props)
    const nowDate = new Date();
    const year = nowDate.getFullYear();
    const month = addZero((nowDate.getMonth()+1).toString());
    const day = addZero((nowDate.getDate()).toString());
    this.state = {
      openState: false,
      bookType: this.props.nowBookType,
      bookId: this.props.nowBookId,
      type: this.props.nowType,
      actionTitle: '',
      actionIcon: 'at-icon-add',
      actionIconBackgroundColor: 'background: #394660',
      date: `${year}-${month}-${day}`,
      money: '',
      note: '',
    }
  }
  static options = {
    addGlobalClass: true
  }
  static defaultProps:CategoryListProps = {
    nowBookType: 'dayLife',
    nowBookId: 0,
    nowType: 'income',
  }

  // 日常开销图标
  static dayLife = {
    income: [
      {title: '礼物', icon: 'icon-xuyuanxing', bgColor: 'background-color:#ff5a5b'},
      {title: '礼物', icon: 'icon-xuyuanxing', bgColor: 'background-color:#51ffa4'},
      {title: '礼物', icon: 'icon-xuyuanxing', bgColor: 'background-color:#cabe16'},
      {title: '礼物', icon: 'icon-xuyuanxing', bgColor: 'background-color:#ff5a5b'},
      {title: '礼物', icon: 'icon-xuyuanxing', bgColor: 'background-color:#51ffa4'},
      {title: '礼物', icon: 'icon-xuyuanxing', bgColor: 'background-color:#51BDFE'},
      {title: '礼物', icon: 'icon-xuyuanxing', bgColor: 'background-color:#51BDFE'},
      {title: '礼物', icon: 'icon-xuyuanxing', bgColor: 'background-color:#cabe16'},
      {title: '礼物', icon: 'icon-xuyuanxing', bgColor: 'background-color:#ff5a5b'},
      {title: '礼物', icon: 'icon-xuyuanxing', bgColor: 'background-color:#cabe16'},
      {title: '礼物', icon: 'icon-xuyuanxing', bgColor: 'background-color:#51ffa4'},
      {title: '礼物', icon: 'icon-xuyuanxing', bgColor: 'background-color:#51BDFE'},
    ],
    expense: [
      {title: '礼物', icon: 'icon-xuyuanxing', bgColor: 'background-color:#ff5a5b'},
      {title: '礼物', icon: 'icon-xuyuanxing', bgColor: 'background-color:#51ffa4'},
      {title: '礼物', icon: 'icon-xuyuanxing', bgColor: 'background-color:#cabe16'},
    ]
  }

  // 旅游出行图标
  static travelParty = {
    income: [
      {title: '出游', icon: 'icon-xuyuanxing', bgColor: 'background-color:#ff5a5b'},
      {title: '礼物', icon: 'icon-xuyuanxing', bgColor: 'background-color:#51ffa4'},
      {title: '礼物', icon: 'icon-xuyuanxing', bgColor: 'background-color:#cabe16'},
      {title: '礼物', icon: 'icon-xuyuanxing', bgColor: 'background-color:#51BDFE'},
    ],
    expense: [
      {title: '出游', icon: 'icon-xuyuanxing', bgColor: 'background-color:#ff5a5b'},
      {title: '礼物', icon: 'icon-xuyuanxing', bgColor: 'background-color:#cabe16'},
    ]
  }

  // 居家装修图标
  static homeDecoration = {
    income: [
      {title: '居家', icon: 'icon-xuyuanxing', bgColor: 'background-color:#ff5a5b'},
      {title: '礼物', icon: 'icon-xuyuanxing', bgColor: 'background-color:#51ffa4'},
      {title: '礼物', icon: 'icon-xuyuanxing', bgColor: 'background-color:#cabe16'},
      {title: '礼物', icon: 'icon-xuyuanxing', bgColor: 'background-color:#51BDFE'},
    ],
    expense: [
      {title: '出游', icon: 'icon-xuyuanxing', bgColor: 'background-color:#ff5a5b'},
      {title: '礼物', icon: 'icon-xuyuanxing', bgColor: 'background-color:#cabe16'},
    ]
  }

  // 人情往来图标
  static socialRelation = {
    income: [
      {title: '人情', icon: 'icon-xuyuanxing', bgColor: 'background-color:#ff5a5b'},
      {title: '礼物', icon: 'icon-xuyuanxing', bgColor: 'background-color:#51ffa4'},
      {title: '礼物', icon: 'icon-xuyuanxing', bgColor: 'background-color:#cabe16'},
      {title: '礼物', icon: 'icon-xuyuanxing', bgColor: 'background-color:#51BDFE'},
    ],
    expense: [
      {title: '出游', icon: 'icon-xuyuanxing', bgColor: 'background-color:#ff5a5b'},
      {title: '礼物', icon: 'icon-xuyuanxing', bgColor: 'background-color:#cabe16'},
    ]
  }

  // 投资理财图标
  static moneyManagement = {
    income: [
      {title: '人情', icon: 'icon-xuyuanxing', bgColor: 'background-color:#ff5a5b'},
      {title: '礼物', icon: 'icon-xuyuanxing', bgColor: 'background-color:#51ffa4'},
      {title: '礼物', icon: 'icon-xuyuanxing', bgColor: 'background-color:#cabe16'},
      {title: '礼物', icon: 'icon-xuyuanxing', bgColor: 'background-color:#51BDFE'},
    ],
    expense: [
      {title: '出游', icon: 'icon-xuyuanxing', bgColor: 'background-color:#ff5a5b'},
      {title: '礼物', icon: 'icon-xuyuanxing', bgColor: 'background-color:#cabe16'},
    ]
  }

  // 租房图标
  static rent = {
    income: [
      {title: '礼物', icon: 'icon-xuyuanxing', bgColor: 'background-color:#51BDFE'},
    ],
    expense: [
      {title: '出游', icon: 'icon-xuyuanxing', bgColor: 'background-color:#ff5a5b'},
      {title: '礼物', icon: 'icon-xuyuanxing', bgColor: 'background-color:#cabe16'},
    ]
  }

  // 租房图标
  static others = {
    income: [
      {title: '礼物', icon: 'icon-xuyuanxing', bgColor: 'background-color:#cabe16'},
      {title: '礼物', icon: 'icon-xuyuanxing', bgColor: 'background-color:#51BDFE'},
    ],
    expense: [
      {title: '出游', icon: 'icon-xuyuanxing', bgColor: 'background-color:#ff5a5b'},
      {title: '礼物', icon: 'icon-xuyuanxing', bgColor: 'background-color:#cabe16'},
    ]
  }

  /**
   * 创建新记账
   * @param item
   */
  createRecord = (item) => {
    this.setState({
      actionTitle: item.title,
      actionIcon: item.icon,
      actionIconBackgroundColor: item.bgColor,
      openState: true,
    })
  }

  /**
   * 弹出框取消
   */
  cancelAction() {
    const nowDate = new Date();
    const year = nowDate.getFullYear();
    const month = addZero((nowDate.getMonth()+1).toString());
    const day = addZero((nowDate.getDate()).toString());
    this.setState({
      actionTitle: '',
      date: `${year}-${month}-${day}`,
      money: '',
      openState: false,
    })
  }

  /**
   * 弹出框确认
   */
  confirmAction() {
    console.log(this.state)
    this.setState({
      openState: false,
    }, () => {
      Taro.navigateBack();
    })
  }

  /**
   * 输入框
   */
  handleChange = (type, input) => {
    if (type == 'money') {
      this.setState({
        money: input
      })
    } else {
      this.setState({
        note: input
      })
    }
  }

  /**
   * 切换时间
   * @param e
   */
  onDateChange = e => {
    this.setState({
      date: e.detail.value
    })
  }

  render() {
    const time = new Date()
    const h = time.getHours()
    const m = time.getMinutes()
    // 生成图标列表
    let iconArr:any;
    if(this.state.bookType === 'dayLife') {
      iconArr = CategoryList.dayLife
    } else if(this.state.bookType === 'travelParty') {
      iconArr = CategoryList.travelParty
    } else if(this.state.bookType === 'homeDecoration') {
      iconArr = CategoryList.homeDecoration
    } else if(this.state.bookType === 'socialRelation') {
      iconArr = CategoryList.socialRelation
    } else if(this.state.bookType === 'moneyManagement') {
      iconArr = CategoryList.moneyManagement
    } else if(this.state.bookType === 'rent') {
      iconArr = CategoryList.rent
    } else if(this.state.bookType === 'others') {
      iconArr = CategoryList.others
    }
    const thisType = this.state.type;
    console.log(this.state)
    const iconContent = iconArr[thisType].map(item => {
      return (
        <View
          className='at-col at-col-3 choice-wrapper'
          onClick={this.createRecord.bind(this, item)}
          key={item.icon}
        >
          <View
            className='icon-wrapper'
            style={item.bgColor}
          >
            <View className={'iconfont ' + item.icon} />
          </View>
          <View className='icon-info'>
            {item.title}
          </View>
        </View>
      )
    })

    return (
      <View className='fx-CategoryList-wrap'>
        <View className='at-row at-row--wrap'>
          {iconContent}
        </View>
        <AtModal
          isOpened={this.state.openState}
          closeOnClickOverlay
        >
          <AtModalContent>
            <View className='header-wrapper'>
              <View className={'now-time '+this.state.type}>{h}:{addZero(m)}</View>
             <View className='header-icon-wrapper' onClick={this.cancelAction}>
               <View className='at-icon at-icon-close' />
             </View>
            </View>
            <View className='action-icon-wrapper' style={this.state.actionIconBackgroundColor}>
              <View className={ this.state.actionIcon + ' icon-item at-icon'} />
            </View>
            <View className={'action-title ' + this.state.type}>{this.state.actionTitle}</View>
            <View className='date-wrapper'>
              <Picker
                mode='date'
                value={this.state.date}
                onChange={this.onDateChange.bind(this)}
              >
                <View className='action-date'>{this.state.date}</View>
              </Picker>
            </View>
            <View className='money-wrapper'>
              <AtInput
                name='money'
                type='number'
                placeholder='￥0.00'
                value={this.state.money}
                border={false}
                onChange={this.handleChange.bind(this, 'money')}
              />
            </View>
            <View className='note-wrapper'>
              <AtInput
                name='note'
                placeholder='输入备注'
                value={this.state.note}
                maxLength={15}
                border={false}
                onChange={this.handleChange.bind(this, 'note')}
              />
            </View>
            <View
              className={'action-button ' + this.state.type}
              onClick={this.confirmAction}
            >确定</View>
          </AtModalContent>
        </AtModal>
      </View>
    )
  }
}

export default CategoryList
