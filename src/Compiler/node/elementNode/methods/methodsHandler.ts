import MVVM from "../../../../Core/MVVM";
import Watcher from "../../../../Watcher/Watcher";
function methodsHandle(attrName: string, attrValue: string, context: MVVM, node: HTMLElement) {
  // 参数数组
  let para: Array<unknown> = []
  // 如果表达式中有括号说明有参数
  if (attrValue.indexOf("(") !== -1) {
    let argu;
    [attrValue, argu] = attrValue.split("(");
    [argu,] = argu.split(")");
    // 将参数用逗号隔开
    argu = argu.split(/,(?![^{}]*})/g);
    // 对参数进行处理 
    para = evalArguments(argu, context);
  }
  // 对方法进行编译
  compilerMethods(context, node, attrName, attrValue, para);
  node.removeAttribute(attrName)
}

function compilerMethods(scope:MVVM, node: HTMLElement, attrName:string , attrValue:string, para:Array<unknown> = []) {
  // type事件名称，例如click
  // fn对应的事件函数，例如handleClick
  // fn.bind(scope) 函数的作用域为vm
  // 获取函数的触发方式
  let type = attrName.slice(1);
  // 获取在methods中的函数
  let fn = scope[(attrValue as keyof typeof scope)];
  // 给节点添加函数事件
  node.addEventListener(type, function (e) {
    para.forEach((p, index) => {
      if (p === "$event") { para[index] = e }
    });
    (fn as Function).bind(scope)(...para);
  });
}
function evalArguments(argus:Array<string>,context:MVVM) {
  let para:Array<unknown> = []
  argus.forEach(a => {
    a = a.trim()
    // 参数是事件本身的情况
    if (a === "$event") { para.push("$event"); }
    // 参数是data中的数据的情况
    else if (Watcher.computeExpression(a, context)) {
      para.push(Watcher.computeExpression(a, context))
    }
    else {
      // 参数是一个对象的情况
      if (a[0] == '{' && a[a.length - 1] == '}') {
        a = eval("(" + a + ")");
        para.push(eval(a));
      }
      else para.push(eval(a));
    }
  })
  return para;
}
export default methodsHandle;