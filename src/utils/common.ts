/**
 * 公共方法函数
 */

/** 时间格式的转换 */
export const formatTime = time => {
  const year = new Date(time).getFullYear();
  const month = new Date(time).getMonth();
  const date = new Date(time).getDate();
  const hours = new Date(time).getHours();
  const minutes = new Date(time).getMinutes();
  const seconds = new Date(time).getSeconds();
  return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`
};

/**
 * 对month的补0处理
 * @param month
 */
export const addZero = month => {
  return parseInt(month, 10) < 10 && month.toString().indexOf('0') < 0 ?
    `0${month}` : month
};

/**
 * 收支信息预处理
 * @param arr
 */
export const objArrReduce = arr => {
  let hashMap = {}; // 用于存储同一天的消费
  let totalMoney = 0;
  arr.forEach((curItem) => {
    const tmpObj = {
      recordId: curItem.record_id,
      date: curItem.create_timestamp,
      type: curItem.record_type,
      money: parseFloat(curItem.money),
      name: curItem.username,
      category: curItem.category,
      note: curItem.note,
    };
    totalMoney += parseFloat(curItem.money);
    if (hashMap[curItem.create_timestamp]) {
      let originObj = hashMap[curItem.create_timestamp];
      let total = originObj.total;
      total = total + curItem.money;
      // 数据填充
      originObj.rowArr.push(tmpObj);
      originObj.total = total;
      // 数据重装回hashMap
      hashMap[curItem.create_timestamp] = originObj;
    } else {
      hashMap[curItem.create_timestamp] = {
        date: curItem.create_timestamp,
        rowArr: [tmpObj],
        total: curItem.money,
      }
    }
  });
  return {
    recordList: hashMap,
    moneyAll: totalMoney
  };
};

export const bookNameTranslate = (toLanguage, bookName) => {
  if (toLanguage === 'Chinese') {
    if(bookName === 'dayLife') {
      return '日常开销';
    } else if(bookName === 'travelParty') {
      return '出游聚会'
    } else if(bookName === 'homeDecoration') {
      return '居家装修'
    } else if(bookName === 'socialRelation') {
      return '人情往来'
    } else if(bookName === 'moneyManagement') {
      return '投资理财'
    } else if(bookName === 'rent') {
      return '租房居住'
    } else if(bookName === 'others') {
      return '借还记录'
    }
  } else if (toLanguage === 'English') {
    if(bookName === '日常开销') {
      return 'dayLife';
    } else if(bookName === '出游聚会') {
      return'travelParty'
    } else if(bookName === '居家装修') {
      return 'homeDecoration'
    } else if(bookName === '人情往来') {
      return 'socialRelation'
    } else if(bookName === '投资理财') {
      return 'moneyManagement'
    } else if(bookName === '租房居住') {
      return 'rent'
    } else if(bookName === '借还记录') {
      return 'others'
    }
  }
};

/**
 * 解析小数点后位数
 * @param integer
 */
const getDigit = (integer) => {
  let digit = -1;
  while (integer >= 1) {
    digit++;
    integer = integer / 10;
  }
  return digit;
};

/**
 * 添加万
 * @param integer
 * @param number
 * @param mutiple
 * @param decimalDigit
 */
const addWan = (integer, number, mutiple, decimalDigit) => {
  const digit = getDigit(integer);
  if (digit > 3) {
    let remainder = digit % 8;
    if (remainder >= 5) {   // ‘十万’、‘百万’、‘千万’显示为‘万’
      remainder = 4;
    }
    return Math.round(number / Math.pow(10, remainder + mutiple - decimalDigit)) / Math.pow(10, decimalDigit) + '万';
  } else {
    return Math.round(number / Math.pow(10, mutiple - decimalDigit)) / Math.pow(10, decimalDigit);
  }
};

/**
 * 万元换算
 * @param number
 * @param decimalDigit
 */
export const moneyFormatter = (number, decimalDigit) => {
    decimalDigit = decimalDigit == null ? 2 : decimalDigit;
    const integer = Math.floor(number);
    const digit = getDigit(integer);
    // ['个', '十', '百', '千', '万', '十万', '百万', '千万'];
    const unit:any = [];
    if (digit > 3) {
      const multiple = Math.floor(digit / 8);
      if (multiple >= 1) {
        const tmp = Math.round(integer / Math.pow(10, 8 * multiple));
        unit.push(addWan(tmp, number, 8 * multiple, decimalDigit));
        for (let i = 0; i < multiple; i++) {
          unit.push('亿');
        }
        return unit.join('');
      } else {
        return addWan(integer, number, 0, decimalDigit);
      }
    } else {
      return number;
    }
}

export const globalData: any = {
  categoryList: {
    dayLife: {
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
    },
    travelParty: {
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
    },
    homeDecoration: {
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
    },
    socialRelation: {
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
    },
    moneyManagement: {
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
    },
    ent: {
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
    },
    others: {
      expense: [
        {title: '借出', icon: 'icon-weather_sunny_big', bgColor: 'background-color:rgb(236,100,94)'},
      ],
      income: [
        {title: '借入', icon: 'icon-weather_rain_storm_big', bgColor: 'background-color:rgb(134,192,67)'},
      ]
    }
  }
}; // 全局公共变量
