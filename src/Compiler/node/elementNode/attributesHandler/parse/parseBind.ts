import Watcher from "../../../../../Watcher/Watcher";
import MVVM from "../../../../../Core/MVVM";
export default function bindHelp(dirName:string, attrValue: string, context: MVVM, node: HTMLElement) {
  let att = dirName.slice(5)
  // 给节点设置属性 每次数据变化的时候改变属性
  new Watcher(attrValue, context, (newValue: string) => {
    node.setAttribute(att, newValue);
  });
}