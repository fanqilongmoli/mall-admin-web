export function random1(len) {
  let pwd = "";
  for(let idx = 0; idx < len; idx ++){
    pwd = pwd + ((Math.random() * 16) & (0x5 | 0x9)).toString(16);
  }
  return pwd;
}

//ASCII (数值+字母+特殊字符)
export function random2(len){
  //ASCII 33 ~ 126
  let pwd = "";
  for(let idx = 0; idx < len; idx ++){
    pwd = pwd + String.fromCharCode(parseInt(Math.random() * 93 + 33));
  }
  return pwd;
}

//纯数字
export function random3(len){
  let pwd = "";
  for(let idx = 0; idx < len; idx ++){
    var seed = parseInt(Math.random() * 9);
    pwd = pwd + seed;
  }
  return pwd;
}
