const multipleByTen = function(num) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(num * 10)
        }, 1000)
    })
}

const getSumWrapper = async function(arrayOfNum) {
    let result = 0;
    const getSum = async function(arrayOfNum) {
        let newNum = await multipleByTen(arrayOfNum[0]);
        result += newNum;
        arrayOfNum = arrayOfNum.slice(1, arrayOfNum.length);
        if (arrayOfNum.length > 0) {
            getSum(arrayOfNum)
        } else {
            console.log(result);
            return result;
        }
    }
    newResult = getSum(arrayOfNum);
    return newResult;
}

console.log(getSumWrapper([1,2,3,4,5]))