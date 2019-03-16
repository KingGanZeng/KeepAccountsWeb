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
      type: curItem.record_type,
      money: curItem.money,
      name: curItem.username,
      category: curItem.category
    };
    totalMoney += curItem.money;
    if (hashMap[curItem.date]) {
      let originObj = hashMap[curItem.date];
      let total = originObj.total;
      total = total + curItem.money;
      // 数据填充
      originObj.rowArr.push(tmpObj);
      originObj.total = total;
      // 数据重装回hashMap
      hashMap[curItem.date] = originObj;
    } else {
      hashMap[curItem.date] = {
        date: curItem.date,
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

export const bookNameTranslate = (language, bookName) => {
  if (language === 'English') {
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
    } else if(bookName === 'moneyManagement') {
      return '租房居住'
    } else if(bookName === 'others') {
      return '借还记录'
    }
  } else if (language === 'Chinese') {
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
 * 万元换算
 * @param money
 */
export const moneyFormatter = (money) => {
  if (money > 10000) {
    money = money.toFixed(0)
    console.log(money, money/10000)
    return `${(money/10000).toFixed(0)}.${((money-money/10000*10000)/1000).toFixed(0)}${((money-money/1000*1000)/100).toFixed(0)}${((money-money/100*100)/10).toFixed(0)}`
  } else {
    return money.toFixed(2)
  }
}

export const globalData: any = {}; // 全局公共变量
