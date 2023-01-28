import Watcher from "../../../../../Watcher/Watcher";
import MVVM from "../../../../../Core/MVVM";
export default function showHelp(attrValue: string, context: MVVM, node: HTMLElement) {
  // 获取节点原来的display属性
  let originalDisplay = window.getComputedStyle(node)["display"]
  // 当show的值为false的时候将dispaly设置为none   show为true就是原来的属性
  new Watcher(attrValue, context, (newValue :string) => {
    node.style.display = newValue ? originalDisplay : "none"
  })
}