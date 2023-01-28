import Watcher from "../../../../../Watcher/Watcher";
import MVVM from "../../../../../Core/MVVM";
import compiler from "../../../compilerFunction";
export default function ifHelp(attrValue: string, context: MVVM, node: HTMLElement, fragement: DocumentFragment) {
  // 创建一个m-if的注释占位节点
  let comment = document.createComment("m-if")
  // 获取此节点的父节点
  let par = (node as any).par || node.parentElement
  new Watcher(attrValue, context, (newValue: boolean) => {
    // 添加一个监视  当m-if为true的时候就用原来的节点替换注释节点
    // 当m-if为false的时候就用注释节点替换原来的节点
    if (par.contains(comment) && newValue) {
      par.replaceChild(node, comment)
    }
    else if (par.contains(node) && !newValue) {
      // 再替换节点之前需要编译一下这个节点
      compiler(node, context)
      par.replaceChild(comment, node)
    }
    else if (fragement.contains(node) && !newValue) {
      // 再替换节点之前需要编译一下这个节点
      compiler(node, context)
      fragement.replaceChild(comment, node)
      
    }
    node.removeAttribute("m-if")
  })
}