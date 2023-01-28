import MVVM from "../../../../../Core/MVVM";
import arrayWatcher from "../../../../../Watcher/arrayWatcher";
export default function forHelp(attrValue: string, context: MVVM, node: HTMLElement, fragement: DocumentFragment,) {
  // 获取需要编译的节点的父节点
  let par = (node as any).par || node.parentElement
  // 对m-for的表达式进行解析分离出 迭代对象 
  let reg = /^(\(\s*(\S+?)\s*,\s*(\S+?)\s*\)|(\S+?))\s+in\s+(.+)$/;
  let match = attrValue.match(reg);
  // 迭代对象
  let vFor = match![5];
  // 获取一个新的完成的一组对象是由for循环而来
  let v_For = getFor(attrValue, context, node) 
  // 暂时储存这个循环
  let store = v_For
  // 如果迭代对象是数组那就需要观察push pop等等函数
  if (typeof context[vFor] === 'object' && context[vFor][0] !== undefined) {
    // 添加一个监视 监视这些函数
    context[vFor].__proto__.dep.addSub(new arrayWatcher(attrValue, context, node, getFor, (newFor) => {
      // 当数组变化的时候就重新获取一个新的循环节点然后插入页面
      if (par.contains(store) && newFor) {
        par.replaceChild(newFor, store)
      }
      // 一开始就是将循环节点将原来的节点替换
      else if (par.contains(node) && newFor) {
        par.contains(node) && par.replaceChild(newFor, node)
      }
      else if (fragement.contains(node) && newFor) {
        fragement.contains(node) && fragement.replaceChild(newFor, node)
      }
      // 存储新的循环节点
      store = newFor
    }))
  }
  // 如果是对象就只需要一次获取循环节点
  else {
    fragement.replaceChild(v_For, node)
  }
}

function getFor(attrValue: string, context: MVVM, node: HTMLElement) {
  const reg = /^(\(\s*(\S+?)\s*,\s*(\S+?)\s*\)|(\S+?))\s+in\s+(.+)$/;
  const match = attrValue.match(reg);
  
  // 迭代对象
  let vFor = match![5];
  // item的名字
  let vForItem = match![2] || match![4];
  // index的名字
  let vForIndex = match![3];
  // 删除m-for这个属性
  node.removeAttribute("m-for")
  let fragementTemp = document.createDocumentFragment();
  // 迭代对象是数组或者对象的时候
  if (context[vFor] && typeof context[vFor] == "object") {
    let i = 0;
    for (let key in context[vFor]) {
      if (context[vFor].length && i >= context[vFor].length) { break; } 
      // 克隆节点
      let nodeNow = node.cloneNode(true);
      // 修改节点内部的item的值和index 的值
      compilerForItem(vForItem, key, nodeNow as Element, vFor);
      if (vForIndex) { compilerForIndex(vForIndex, i, nodeNow as Element); }
      // 把这个节点加入循环中
      fragementTemp.appendChild(nodeNow)
      i++
    }
  }
  // 循环对象是数字
  else if (context[vFor] && typeof eval(vFor) == "number") {
    for (let i = 1; i <= eval(vFor); i++) {
      // 克隆节点
      let nodeNow = node.cloneNode(true);
      // 修改节点内部的item的值和index 的值
      compilerForIndex(vForItem, i, nodeNow as Element); 
      if (vForIndex) { compilerForIndex(vForIndex, i - 1, nodeNow as Element); }
      // 把这个节点加入循环中
      fragementTemp.appendChild(nodeNow)
    }
  }

  // 创建一个节点将循环节点看作一个整体放入以便修改
  let v_for = document.createElement("v_for")
  v_for.appendChild(fragementTemp)
  return v_for
}

function compilerForItem(item:string, target: Array<any> | object | number | string, node: Element, array: string) {
  // 编译item
  const regItem = eval("/\{\{([^\}]*?(" + item + ")[^\{]*?)\}\}/g");
  // 找到innerHTML中的item表达式
  let matchedItem = regItem.exec(node.innerHTML)
  if (matchedItem !== null) {
    let re = eval("/" + matchedItem[2] + "/g")
    // 进行全局替换将item表达式替换为迭代对象的内容
    node.innerHTML = node.innerHTML.replace(re, array + '[' + target + ']');
    
  }
}


function compilerForIndex(item: string, target: Array<any> | object | number, node: Element) {
  // 找到innerHTML中的index表达式
  const regItem = eval("/\{\{([^\}]*?(" + item + ")[^\{]*?)\}\}/g");
  let matchedItem = regItem.exec(node.innerHTML)
  if (matchedItem !== null) {
    matchedItem[1] = matchedItem[1].replace(item, "'" + target + "'")
    let re = eval("/" + matchedItem[0] + "/g")
    let ans = eval(matchedItem[1]);
    // 进行全局替换将item表达式替换为迭代对象的内容
    node.innerHTML = node.innerHTML.replace(re, ans);
    
  }
}