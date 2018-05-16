require('dotenv').config()
const alphabet = process.env.key
const base = alphabet.length // base is the length of the alphabet (58 in this case)

// utility function to convert base 10 integer to base 58 string
module.exports.encode = function (num){
    let encoded = '';
    while (num){
      const remainder = num % base;
      num = Math.floor(num / base);
      encoded = alphabet[remainder].toString() + encoded;
    }
    return encoded;
  }

// utility function to convert a base 58 string to base 10 integer
module.exports.decode = function (str){
    let decoded = 0;
    while (str){
      const index = alphabet.indexOf(str[0]);
      const power = str.length - 1;
      decoded += index * (Math.pow(base, power));
      str = str.substring(1);
    }
    return decoded;
  }