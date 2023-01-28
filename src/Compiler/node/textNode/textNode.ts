import Watcher from "../../../Watcher/Watcher";
import MVVM from "../../../Core/MVVM";
function compilerTextNode(node: ChildNode, context: MVVM) {
  let text = node.textContent!.trim();
  if (text) {
    // 把text转换为表达式

    let exp = parseTextExp(text);

    // 添加订阅者计算表达式的值
    new Watcher(exp, context, (newValue: string) => {
      // 将表达式的值更改为真实值
      // console.log(newValue);
      node.textContent = newValue;
    });
  }
}
function   parseTextExp(text : string) {
  // 匹配花括号里面的数组
  let regText = /\{\{(.+?)\}\}/g;
  // 分割字符串
  var pices = text.split(regText); 
  // 匹配目标字符串（也就是data中的数据）
  var matches = text.match(regText); 

  // 表达式数组
  let tokens:Array<string> = [];
  // 对item进行遍历，对非花括号包围的内容使用``包裹，对使用花括号包围的内容，使用()包裹，然后此次push进数组
  pices.forEach((item) => {
    if (matches && matches.indexOf("{{" + item + "}}") > -1) {
      // 如果是data中的数据需要优先处理所以加一个括号
      tokens.push('(' + item + ')');
    } else {
      tokens.push("`" + item + "`");
    }
  });
  return tokens.join("+");
}
export default compilerTextNode