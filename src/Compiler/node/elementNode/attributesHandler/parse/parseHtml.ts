import Watcher from "../../../../../Watcher/Watcher";
import MVVM from "../../../../../Core/MVVM";
export default function htmlHelp(attrValue: string, context: MVVM, node: HTMLElement) {
  // 在属性变化的时候修改节点innerHTML
  new Watcher(attrValue, context, (newValue: string) => {
    node.innerHTML = newValue
  });
}