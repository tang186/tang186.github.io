import Dep from "../Dep/Dep";
import ArrayProto from "./arrayDefine";
export default class ObserverData {
  // 需要劫持的数据对象
  data :object
  constructor(data:object) {
    this.data = data;
    // 对每一个数据进行劫持
    this.walk(this.data);
  }

  walk(data: object) {
    // 如果当前数据对象没有数据就直接return
    if (!data || typeof data !== "object") {
      return;
    }
    Object.keys(data).forEach((key) => {
      // 当对象是数组的时候需要重定义 __proto__以便对改变数组的函数进行观察劫持 从而达到m-for的要求
      if (typeof data[key] === 'object' && data[key][0] !== undefined) {
        data[key].__proto__ = new ArrayProto(null).arrayProto
      }
      // 对每个数据劫持
      this.defineReactive(data, key, data[key as keyof typeof data]);
    });
  }

  defineReactive(data: object, key: string, value: any) {
    var dep = new Dep();
    Object.defineProperty(data, key, {
      // 可遍历
      enumerable: true,
      // 可再配置  这里主要是为了m-for的时候修改数组里面的每一个值
      configurable: true,
      // 获取数据
      get: () => {
        //  添加Watcher, 第一次触发get方法在watcher类的get方法中的computeExpression, 对应的watcher会被收集起来
        // 这里的Dep.targetObject是每一个数据
        // 这里的Dep.targetFunction是观察计算属性
        Dep.targetFunction && dep.addSub(Dep.targetFunction);
        Dep.targetObject && dep.addSub(Dep.targetObject);
        return value;
      },
      // 设置数据
      set: (newValue) => {
        value = newValue;
        // 触发Watcher中的update
        dep.notify();
      },
    });
    // 递归处理value中的对象
    this.walk(value);
  }
}