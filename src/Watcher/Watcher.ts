import MVVM from '../Core/MVVM'; 
import Dep from '../Dep/Dep'; 
var $uid = 0
export default class Watcher{
  // 为每一个监听器编号
  uid: number;
  // 当前的函数作用域
  scope: MVVM;
  // 回调函数
  cb: Function;
  // 表达式
  exp: string;
  constructor(exp: string, scope: MVVM, cb: Function) {

    this.uid = $uid;
    this.scope = scope;
    this.cb = cb;
    this.exp = exp
    // 执行一次数据视图更新
    this.update()
  }

  get() {
    // Dep.target之所以更改是为了使Dep.target永远指向当前的Watcher
    Dep.targetObject = this;
    // 计算新值
    let newValue = Watcher.computeExpression(this.exp, this.scope);
    // 在计算新值的时候添加到订阅了然后订阅的指向再指回空
    Dep.targetObject = null;
    return newValue;
  }

  update() {
    // 计算新值
    let newValue = this.get();
    // 执行回调函数
    this.cb && this.cb(newValue);
  }

  static computeExpression(exp: string, scope: MVVM) {
    // 创建函数
    // 把scope当成作用域
    // 函数内部使用with来指定作用域
    // 执行函数得到表达式的值
    // 此处会调用到data中的数据，因此会触发Observe中的get方法，dep.target被设置成this，对应的watcher被dep收集
    // scope是函数的参数 并且把scope作为作用域
    let fn = new Function("scope", "with(scope){return " + exp + "}");
    return fn(scope);
  }
}