import Watcher from "../../../../../Watcher/Watcher";
import MVVM from "../../../../../Core/MVVM";
export default function textHelp(attrValue: string, context: MVVM, node: HTMLElement) {
  // 添加监视 当数据变化的时候 节点的内容等于新的数据
  new Watcher(attrValue, context, (newValue: string) => {
    node.textContent = newValue;
  });
}
