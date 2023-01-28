import MVVM from '../Core/MVVM'; 
import compilerTextNode from '../Compiler/node/textNode/textNode';
import compilerElementNode from '../Compiler/node/elementNode/elementNode';
import compiler from '../Compiler/node/compilerFunction';
var $uid = 0
export default class arrayWatcher{
  // 未每一个数组监视器添加编号
  uid: number;
  // 函数作用域
  scope: MVVM;
  // 回调函数
  cb: Function;
  // 表达式
  exp: string;
  // 需要使用m-for的节点
  node: Node;
  // 获取每一个节点的函数
  getFor: Function;
  // compiler: Function;
  constructor(exp: string, scope: MVVM, node: Node, getFor: Function, cb: Function) {
    this.uid = $uid++;
    this.scope = scope;
    this.cb = cb;
    this.exp = exp
    this.node = node;
    this.getFor = getFor;
    // 更新数据视图
    this.update()
  }

  update() {
    // 获取每一个节点的表达
    let v_For = this.getFor.bind(this.scope)(this.exp, this.scope, this.node)
    // 在递归编译
    compiler(v_For, this.scope)
    // 执行回调函数
    this.cb && this.cb(v_For);
  }

}