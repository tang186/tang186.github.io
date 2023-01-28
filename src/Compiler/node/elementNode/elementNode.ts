import MVVM from "../../../Core/MVVM";
import methodsHandle from "./methods/methodsHandler"
import attributesHandler from "./attributesHandler/attributesHandler";
function compilerElementNode(node: HTMLElement, context: MVVM, fragement: DocumentFragment) {
  let attrs: Array<Attr> = [];
  // 获取元素节点的舒徐
  if (node && node.attributes) { attrs = [...node.attributes] ; }
  attrs.forEach(attr => {
    let { name: attrName, value: attrValue } = attr;
    // 如果属性的名字是以m-开头的说明是需要处理的
    if (attrName.indexOf("m-") === 0) {
      // dirName 为提取“m-”后面的内容
      let dirName = attrName.slice(2);
      // 对于每个m-开头的属性处理
      attributesHandler(dirName, attrValue, context, node, fragement)
      node.removeAttribute(attrName)
    }
    else if (attrName.indexOf("@") === 0) {
      // 如果属性以@开头的说明是绑定的函数需要处理
      methodsHandle(attrName, attrValue, context, node)
      node.removeAttribute(attrName)
    }

  })
  // node.removeAttribute(attr.name)
}

export default compilerElementNode;