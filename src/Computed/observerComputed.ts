import Dep from "../Dep/Dep";
import MVVM from "../Core/MVVM";
var uid = 0;
export default class ObserverComputed {
  // 监听的对象函数计算
  computed: object;
  // 函数作用域
  scope: MVVM;
  constructor(computed: object, scope: MVVM) {
    this.computed = computed;
    this.scope = scope
    // 对每一个计算属性进行劫持
    this.walk(this.computed)
  }

  walk(computed: object) {
    if (!computed || typeof computed !== "object") {
      return;
    }
    Object.keys(computed).forEach((key) => {
      // 劫持每一个计算属性
      this.defineReactive(computed, key, computed[key as keyof typeof computed], this.scope);
    });
  }

  defineReactive(computed: object, key: string, exp: any, scope: MVVM) {
    // 定义数据的值
    Object.defineProperty(exp, "val", {
      value: "",
      writable: true
    })
    // 增加一个污值 当污值为false的时候需要更新值 污值为true的时候不需要更新
    Object.defineProperty(exp, "dirty", {
      value: true,
      writable: true
    })
    // 增加一个编号以便发布订阅
    Object.defineProperty(exp, "uid", {
      value: uid++,
      writable: true,
    })
    Object.defineProperty(computed, key, {
      // 可遍历
      enumerable: true,
      // writable: false,
      // 不可再配置
      configurable: false,
      get: () => {
        // 如果污值为true就要修改值否则直接返回原来的值
        if (exp.dirty) {
          // 先把污值设置为false
          exp.dirty = false
          // 指向当前函数
          Dep.targetFunction = exp;
          // 获取新值
          exp.val = exp.bind(scope)()
          // 将Dep指空
          Dep.targetFunction = null;
          // 返回新值
          return exp.val
        } else {
          return exp.val
        }
      },
      // 不可直接需要值本身
      set: (newval) => {
        console.log("No writable");
      }
    })
  }
}

