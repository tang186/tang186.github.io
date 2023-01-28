import compilerTextNode from "./textNode/textNode";
import compilerElementNode from "./elementNode/elementNode";
import MVVM from "../../Core/MVVM";
export default function compiler(fragment: DocumentFragment | ChildNode, scope: MVVM) {
    
  if (fragment && fragment.childNodes && fragment.childNodes.length) {
    for (let i = 0; i < fragment.childNodes.length; i++) {
      // nodeType=1 元素节点, 元素节点需要解析指令,需要递归调用compile
      if (fragment.childNodes[i].nodeType === 1) {     
        // 元素节点用元素节点函数编译
        compilerElementNode(fragment.childNodes[i] as HTMLElement, scope, fragment as DocumentFragment);
        compiler(fragment.childNodes[i], scope);
      } else if (fragment.childNodes[i].nodeType === 3) {
        // nodeType=3 文本节点， 文本节点直接渲染  用文本节点函数编译
        compilerTextNode(fragment.childNodes[i],scope);
      }
    }
  }
}