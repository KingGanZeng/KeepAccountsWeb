import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { CategoryListProps, CategoryListState } from './CategoryList.interface'
import './CategoryList.scss'
import '../../assets/iconfont/iconfont.scss'

class CategoryList extends Component<CategoryListProps,CategoryListState > {
  constructor(props: CategoryListProps) {
    super(props);
    this.state = {
      openState: false,
      bookType: this.props.nowBookType,
      bookId: this.props.nowBookId,
      type: this.props.nowType,
    }
  }
  static options = {

    addGlobalClass: true
  };
  static defaultProps:CategoryListProps = {
    nowBookType: 'dayLife',
    nowBookId: 0,
    nowType: 'income',
  };

  static dayLife = {
    expense: [
      {title: '餐饮买菜', icon: 'icon-zhou', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '零食饮料', icon: 'icon-qiubingqilin', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '交通', icon: 'icon-jiayouzhan', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '衣服鞋帽', icon: 'icon-jiake', bgColor: 'background-color:rgb(134,192,67)'},
      {title: '日用品', icon: 'icon-jingzi', bgColor: 'background-color:rgb(89,175,193)'},
      {title: '通讯网费', icon: 'icon-Call', bgColor: 'background-color:rgb(77,135,237)'},
      {title: '休闲娱乐', icon: 'icon-music', bgColor: 'background-color:rgb(162,135,242)'},
      {title: '医疗', icon: 'icon-Medical-Bag', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '教育学习', icon: 'icon-xueshimao', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '烟酒', icon: 'icon-iconfontbaijiu', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '家居', icon: 'icon-canzhuo', bgColor: 'background-color:rgb(134,192,67)'},
      {title: '护肤彩妆', icon: 'icon-kouhong', bgColor: 'background-color:rgb(89,175,193)'},
      {title: '住房', icon: 'icon-xiyiji', bgColor: 'background-color:rgb(77,135,237)'},
      {title: '数码', icon: 'icon-xingzhuang', bgColor: 'background-color:rgb(162,135,242)'},
      {title: '宠物', icon: 'icon-chongwugou', bgColor: 'background-color:rgb(236,100,94)'},
    ],
    income: [
      {title: '工资', icon: 'icon-wukong1', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '生活费', icon: 'icon-webduanmobancaozuo_yulan', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '红包', icon: 'icon-jiufuqianbaoicon14', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '兼职外快', icon: 'icon-huodong', bgColor: 'background-color:rgb(134,192,67)'},
      {title: '投资收入', icon: 'icon-50', bgColor: 'background-color:rgb(89,175,193)'},
      {title: '奖金', icon:'icon-zuanjie', bgColor: 'background-color:rgb(77,135,237)'},
      {title: '福利', icon: 'icon-43', bgColor: 'background-color:rgb(162,135,242)'},
      {title: '其他收入', icon: 'icon-icon-', bgColor: 'background-color:rgb(236,100,94)'},
    ]
  };



  static travelParty = {
    expense: [
      {title: '餐饮', icon: 'icon-icon-test', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '零食饮料', icon: 'icon-qiubingqilin', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '住宿', icon: 'icon-Hotel', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '交通', icon: 'icon-icon-test4', bgColor: 'background-color:rgb(134,192,67)'},
      {title: '景点门票', icon: 'icon-icon-test1', bgColor: 'background-color:rgb(89,175,193)'},
      {title: '演艺演出', icon: 'icon-icon-test2', bgColor: 'background-color:rgb(77,135,237)'},
      {title: '休闲娱乐', icon: 'icon-music', bgColor: 'background-color:rgb(162,135,242)'},
      {title: '购物', icon: 'icon-kouhong', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '旅行团费', icon: 'icon-tubiao_ditu', bgColor: 'background-color:rgb(134,192,67)'},
      {title: '其他杂费', icon: 'icon-icon-test3', bgColor: 'background-color:rgb(89,175,193)'},
    ],
    income: [
      {title: '退款', icon: 'icon-wukong1', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '退税', icon: 'icon-zuanjie', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '其他收入', icon: 'icon-icon-', bgColor: 'background-color:rgb(236,100,94)'},
    ]
  };



  static homeDecoration = {
    expense: [
      {title: '家装建材', icon: 'icon-zhuangxiushangjia-5', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '油漆', icon: 'icon-yingtao', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '五金水电', icon: 'icon-zhuangxiushangjia-3', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '灯饰照明', icon: 'icon-zhuangxiushangjia-4', bgColor: 'background-color:rgb(134,192,67)'},
      {title: '厨房', icon: 'icon-dianfanbao', bgColor: 'background-color:rgb(89,175,193)'},
      {title: '卫浴', icon: 'icon-zhuangxiushangjia-2', bgColor: 'background-color:rgb(77,135,237)'},
      {title: '家具', icon: 'icon-zhuangxiushangjia-', bgColor: 'background-color:rgb(162,135,242)'},
      {title: '家电', icon: 'icon-zhuangxiushangjia-1', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '软装', icon: 'icon-jingzi', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '设计费', icon: 'icon-Lasso-Tool', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '监理费', icon: 'icon-jiqiren', bgColor: 'background-color:rgb(134,192,67)'},
      {title: '人工费', icon: 'icon-chushimao', bgColor: 'background-color:rgb(89,175,193)'},
      {title: '辅助设施', icon: 'icon-huojian', bgColor: 'background-color:rgb(77,135,237)'},
      {title: '其他', icon: 'icon-tubiao_ditu', bgColor: 'background-color:rgb(162,135,242)'},
    ],
    income: [
      {title: '退款', icon: 'icon-wukong1', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '退税', icon: 'icon-zuanjie', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '其他收入', icon: 'icon-icon-', bgColor: 'background-color:rgb(236,100,94)'},
    ]
  };



  static socialRelation = {
    expense: [
      {title: '请客送礼', icon: 'icon-icon-test', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '婚嫁送礼', icon: 'icon-fenglingcao', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '生日送礼', icon: 'icon-beizidangao', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '新生满月', icon: 'icon-Punk', bgColor: 'background-color:rgb(134,192,67)'},
      {title: '周岁送礼', icon: 'icon-iconnvhai', bgColor: 'background-color:rgb(89,175,193)'},
      {title: '乔迁送礼', icon: 'icon--jiaotonggongju-', bgColor: 'background-color:rgb(77,135,237)'},
      {title: '升学送礼', icon: 'icon-education', bgColor: 'background-color:rgb(162,135,242)'},
      {title: '晋升送礼', icon: 'icon-huodong', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '白事送礼', icon: 'icon-yiyuan', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '生病送礼', icon: 'icon-Medical-Bag', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '探望领导', icon: 'icon-34', bgColor: 'background-color:rgb(134,192,67)'},
      {title: '祝寿送礼', icon: 'icon-sanmingzhi', bgColor: 'background-color:rgb(89,175,193)'},
      {title: '成人礼', icon: 'icon-Maid', bgColor: 'background-color:rgb(77,135,237)'},
      {title: '节日送礼', icon: 'icon-sanmingzhi', bgColor: 'background-color:rgb(162,135,242)'},
      {title: '其他人情', icon: 'icon-icon-', bgColor: 'background-color:rgb(236,100,94)'},
    ],
    income: [
      {title: '礼物礼金', icon: 'icon-icon-test', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '婚嫁收礼', icon: 'icon-fenglingcao', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '生日收礼', icon: 'icon-beizidangao', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '红包', icon: 'icon-jiufuqianbaoicon14', bgColor: 'background-color:rgb(134,192,67)'},
      {title: '周岁收礼', icon: 'icon-iconnvhai', bgColor: 'background-color:rgb(89,175,193)'},
      {title: '乔迁收礼', icon: 'icon--jiaotonggongju-', bgColor: 'background-color:rgb(77,135,237)'},
      {title: '升学收礼', icon: 'icon-education', bgColor: 'background-color:rgb(162,135,242)'},
      {title: '晋升收礼', icon: 'icon-huodong', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '白事收礼', icon: 'icon-yiyuan', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '探病收礼', icon: 'icon-Medical-Bag', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '祝寿收礼', icon: 'icon-sanmingzhi', bgColor: 'background-color:rgb(134,192,67)'},
      {title: '成人礼收礼', icon: 'icon-Maid', bgColor: 'background-color:rgb(89,175,193)'},
      {title: '节日收礼', icon: 'icon-sanmingzhi', bgColor: 'background-color:rgb(77,135,237)'},
      {title: '其他', icon: 'icon-icon-', bgColor: 'background-color:rgb(162,135,242)'},
    ]
  };



  static moneyManagement = {
    expense: [
      {title: '股票', icon: 'icon-iconfont-zijinmingxi', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '基金', icon: 'icon-iconfont-dezhi', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '信托', icon: 'icon-iconfont-denglumima-', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '保险', icon: 'icon-baozhang1', bgColor: 'background-color:rgb(134,192,67)'},
      {title: '理财产品', icon: 'icon-zijintuoguan1', bgColor: 'background-color:rgb(89,175,193)'},
      {title: '众筹私募', icon: 'icon-jiaoyi', bgColor: 'background-color:rgb(77,135,237)'},
      {title: '债券国债', icon: 'icon-zhengquan', bgColor: 'background-color:rgb(162,135,242)'},
      {title: 'P2P网贷', icon: 'icon-iconfonthuankuankuai', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '收藏品', icon: 'icon-iconfont-jiaoyimima-', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '期贷', icon: 'icon-iconfont-shipanjiaoyi', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '外汇', icon: 'icon-meiyuan', bgColor: 'background-color:rgb(134,192,67)'},
      {title: '黄金', icon: 'icon-jiaoyimingxiicon', bgColor: 'background-color:rgb(89,175,193)'},
      {title: '股权投资', icon: 'icon-jiaxiquanicon', bgColor: 'background-color:rgb(77,135,237)'},
      {title: '其他投资', icon: 'icon-tiyanjinicon', bgColor: 'background-color:rgb(162,135,242)'},
    ],
    income: [
      {title: '股票收入', icon: 'icon-iconfont-zijinmingxi', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '基金收入', icon: 'icon-iconfont-dezhi', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '信托收入', icon: 'icon-iconfont-denglumima-', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '保险收入', icon: 'icon-baozhang1', bgColor: 'background-color:rgb(134,192,67)'},
      {title: '理财收入', icon: 'icon-zijintuoguan1', bgColor: 'background-color:rgb(89,175,193)'},
      {title: '私募收入', icon: 'icon-jiaoyi', bgColor: 'background-color:rgb(77,135,237)'},
      {title: '期贷收入', icon: 'icon-iconfont-shipanjiaoyi', bgColor: 'background-color:rgb(162,135,242)'},
      {title: '外汇收入', icon: 'icon-meiyuan', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '黄金收入', icon: 'icon-jiaoyimingxiicon', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '股权收入', icon: 'icon-jiaxiquanicon', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '其他收入', icon: 'icon-tiyanjinicon', bgColor: 'background-color:rgb(134,192,67)'},
    ]
  };



  static rent = {
    expense: [
      {title: '水费', icon: 'icon-shuikudian', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '电费', icon: 'icon-weibiaoti-', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '餐饮买菜', icon: 'icon-zhou', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '家装报修', icon: 'icon-jingzi', bgColor: 'background-color:rgb(134,192,67)'},
      {title: '物业费', icon: 'icon-Prisoner', bgColor: 'background-color:rgb(89,175,193)'},
      {title: '煤气费', icon: 'icon-guo', bgColor: 'background-color:rgb(77,135,237)'},
      {title: '保洁费', icon: 'icon-gonggongchufang', bgColor: 'background-color:rgb(162,135,242)'},
      {title: '其他费用', icon: 'icon-icon-', bgColor: 'background-color:rgb(236,100,94)'},
    ],
    income: [
      {title: '退款', icon: 'icon-wukong1', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '退税', icon: 'icon-zuanjie', bgColor: 'background-color:rgb(236,100,94)'},
      {title: '其他收入', icon: 'icon-icon-', bgColor: 'background-color:rgb(236,100,94)'},
    ]
  };




  static others = {
    expense: [
      {title: '借出', icon: 'icon-weather_sunny_big', bgColor: 'background-color:rgb(236,100,94)'},
    ],
    income: [
      {title: '借入', icon: 'icon-weather_rain_storm_big', bgColor: 'background-color:rgb(134,192,67)'},
    ]
  };

  /**
   * 创建新记账
   * @param item
   */
  createRecord = (item) => {
    const itemInfo = {
      actionTitle: item.title,
      actionIcon: item.icon,
      actionIconBackgroundColor: item.bgColor,
      openState: true,
    };
    this.props.onModalActionState(itemInfo)
  };

  render() {
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
    console.log(this.state);
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
    });

    return (
      <View className='fx-CategoryList-wrap'>
        <View className='at-row at-row--wrap'>
          {iconContent}
        </View>
      </View>
    )
  }
}

export default CategoryList
