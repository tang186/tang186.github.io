import Watcher from "../../../../../Watcher/Watcher";
import MVVM from "../../../../../Core/MVVM";
export default function modelHelp(attrValue: string, context: MVVM, node: HTMLElement) {
  // 双向绑定  input的值等于数据的值 并且给input添加一个事件 使得input的值变化的时候也改变data中的数据
  new Watcher(attrValue, context, (newValue: string) => {
    (node as HTMLInputElement).value = newValue;
  });
  // input 事件监听
  node.addEventListener("input", (e) => {

    let newValue = (e.target! as HTMLInputElement).value
    let express = attrValue.split('.')
    // 获取数据的表达式
    return express.reduce((pre, next, currentIndex) => {
      if (currentIndex === express.length - 1) {
        // 修改data中的数据
        return pre![next] = newValue
      }
      return pre![next]
    }, context.$data)
  });
}