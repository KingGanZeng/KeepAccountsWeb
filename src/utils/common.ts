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

export const objArrReduce = arr => {
  let hashMap = {} // 用于存储同一天的消费
  const newArr = arr.reduce((preVal, curVal) => {
    if (hashMap[curVal.date]) {
      const tmpObj = {
        type: 'food',
        money: 200,
      }
      hashMap[curVal.date].push(tmpObj)
    }
    hash[curVal.id] ? '' : hash[curVal.id] = true && preVal.push(curVal);
    return preVal
  }, [])
};

export const globalData: any = {}; // 全局公共变量
