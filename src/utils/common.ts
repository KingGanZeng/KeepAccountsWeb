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
    if(bookName == 'dayLife') {
      return '日常'
    } else if(bookName === 'travelParty') {
      return '旅游'
    } else if(bookName === 'homeDecoration') {
      return '装修'
    } else if(bookName === 'socialRelation') {
      return '聚会'
    } else if(bookName === 'moneyManagement') {
      return '理财'
    } else if(bookName === 'rent') {
      return '租房'
    } else if(bookName === 'car') {
      return '汽车'
    } else if(bookName === 'child') {
      return '育儿'
    } else if(bookName === 'others') {
      return '生意'
    }
  } else if (toLanguage === 'English') {
    if(bookName === '日常') {
      return 'dayLife'
    } else if(bookName === '旅游') {
      return 'travelParty'
    } else if(bookName === '装修') {
      return 'homeDecoration'
    } else if(bookName === '聚会') {
      return 'socialRelation'
    } else if(bookName === '理财') {
      return 'moneyManagement'
    } else if(bookName === '租房') {
      return 'rent'
    } else if(bookName === '汽车') {
      return 'car'
    } else if(bookName === '育儿') {
      return 'child'
    } else if(bookName === '生意') {
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

/**
 * 格式化django返回时间
 * @param djangoTime
 */
export const dateFormatter = (djangoTime) => {
  const now = new Date();
  const date = djangoTime.split('T')[0];
  const input = date ? date.split('-') : [];
  const y = now.getFullYear().toString();
  let m = now.getMonth().toString();
  let d = now.getDate().toString();
  m = addZero(m+1);
  d = addZero(d);
  if(input[0] == y && input[1] == m && input[2] == d) {
    return `今天(${m}.${d})`
  } else {
    return `${addZero(input[1])}.${addZero(input[2])}`
  }
}

/**
 * 随机生成书字符串
 * @param randomFlag 是否任意长度
 * @param min 任意长度最小位[固定位数]
 * @param max 任意长度最大位
 * 生成3-32位随机串：randomWord(true, 3, 32)
 * 生成43位随机串：randomWord(false, 43)
 */
export const randomWord = (randomFlag, min, max) => {
  let str = "",
    range = min,
    arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  // 随机产生
  if(randomFlag){
    range = Math.round(Math.random() * (max-min)) + min;
  }
  for(var i=0; i<range; i++){
    const pos = Math.round(Math.random() * (arr.length-1));
    str += arr[pos];
  }
  return str;
}

/**
 * 转义一级类目
 * @param nowCategory
 */
export const wishCategoryTranslate = (nowCategory) => {
  let levelTwoCategory:any = '';
  if (nowCategory === '旅游')  {
    levelTwoCategory = 'travel'
  } else if (nowCategory === '聚会') {
    levelTwoCategory = 'party'
  } else if (nowCategory === '装修') {
    levelTwoCategory = 'decoration'
  } else if (nowCategory === '汽车') {
    levelTwoCategory = 'car'
  } else if (nowCategory === '育儿') {
    levelTwoCategory = 'childRearing'
  }
  return levelTwoCategory;
}

export const globalData: any = {
  wishLevelOneCategory: ['旅游', '聚会', '装修', '汽车', '育儿'],
  wishLevelTwoCategory: {
    travel: ['国内游', '出国游'],
    party: ['美食', '购物', '娱乐'],
    decoration: ['家具', '家装设计'],
    car: ['养车', '购车'],
    childRearing: ['母婴产品', '兴趣班'],
  },
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
        {title: '纪念品', icon: 'icon-kouhong', bgColor: 'background-color:rgb(236,100,94)'},
        {title: '旅行团费', icon: 'icon-tubiao_ditu', bgColor: 'background-color:rgb(134,192,67)'},
        {title: '过路费', icon: 'icon-icon-test3', bgColor: 'background-color:rgb(89,175,193)'},
        {title: '帮忙代购', icon: 'icon-huodong', bgColor: 'background-color:rgb(236,100,94)'},
        {title: '应急药箱', icon: 'icon-yiyuan', bgColor: 'background-color:rgb(236,100,94)'},
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
    moneyManagementInner: {
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
    rent: {
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
    car: {
      expense: [
        {title: '保修', icon: 'icon-3genghuanzhouqi', bgColor: 'background-color:rgb(134,192,67)'},
        {title: '服务费', icon: 'icon-1fuwu', bgColor: 'background-color:rgb(236,100,94)'},
        {title: '空调滤芯', icon: 'icon-2kongdiaolvxin', bgColor: 'background-color:rgb(236,100,94)'},
        {title: '轮胎维修更换', icon: 'icon-2luntai', bgColor: 'background-color:rgb(89,175,193)'},
        {title: '空调滤芯空调滤芯', icon: 'icon-2kongqilvxin', bgColor: 'background-color:rgb(77,135,237)'},
        {title: '机油滤芯', icon: 'icon-2jiyoulvxin', bgColor: 'background-color:rgb(162,135,242)'},
        {title: '加油', icon: 'icon-2jiyou', bgColor: 'background-color:rgb(134,192,67)'},
        {title: '火花塞更换', icon: 'icon-2huohuasai', bgColor: 'background-color:rgb(89,175,193)'},
        {title: '防冻液', icon: 'icon-2fangdongye', bgColor: 'background-color:rgb(89,175,193)'},
        {title: '电瓶', icon: 'icon-2dianping', bgColor: 'background-color:rgb(77,135,237)'},
        {title: '刹车油', icon: 'icon-2shacheyou', bgColor: 'background-color:rgb(162,135,242)'},
        {title: '变速箱油', icon: 'icon-2biansuxiangyou', bgColor: 'background-color:rgb(236,100,94)'},
      ],
      income: [
        {title: '退款', icon: 'icon-wukong1', bgColor: 'background-color:rgb(236,100,94)'},
        {title: '退税', icon: 'icon-zuanjie', bgColor: 'background-color:rgb(236,100,94)'},
        {title: '其他收入', icon: 'icon-icon-', bgColor: 'background-color:rgb(236,100,94)'},
      ],
    },
    child: {
      expense: [
        {title: '奶粉', icon: 'icon-naiping-muying', bgColor: 'background-color:rgb(77,135,237)'},
        {title: '纸尿裤', icon: 'icon-zhiniaoku-muying', bgColor: 'background-color:rgb(162,135,242)'},
        {title: '婴儿床', icon: 'icon-yingerchuang-muying', bgColor: 'background-color:rgb(134,192,67)'},
        {title: '婴儿车', icon: 'icon-yingerche-muying', bgColor: 'background-color:rgb(89,175,193)'},
        {title: '益智玩具', icon: 'icon-yizhiwanju-muying', bgColor: 'background-color:rgb(134,192,67)'},
        {title: '衣服', icon: 'icon-yifu-muying', bgColor: 'background-color:rgb(89,175,193)'},
        {title: '玩具', icon: 'icon-wanou-muying', bgColor: 'background-color:rgb(89,175,193)'},
        {title: '电瓶', icon: 'icon-2dianping', bgColor: 'background-color:rgb(77,135,237)'},
        {title: '医疗相关', icon: 'icon-yiliaoqixie-muying', bgColor: 'background-color:rgb(162,135,242)'},
        {title: '日常护理', icon: 'icon-richanghuli-muying', bgColor: 'background-color:rgb(236,100,94)'},
        {title: '辅食', icon: 'icon-nanbaobao-muying', bgColor: 'background-color:rgb(134,192,67)'},
      ],
      income: [
        {title: '退款', icon: 'icon-wukong1', bgColor: 'background-color:rgb(236,100,94)'},
        {title: '退税', icon: 'icon-zuanjie', bgColor: 'background-color:rgb(236,100,94)'},
        {title: '其他收入', icon: 'icon-icon-', bgColor: 'background-color:rgb(236,100,94)'},
      ],
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
