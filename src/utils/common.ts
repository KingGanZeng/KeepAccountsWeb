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
      category: curItem.category,
      note: curItem.note,
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
    } else if(bookName === 'rent') {
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

export const globalData: any = {}; // 全局公共变量
