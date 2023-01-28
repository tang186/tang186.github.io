
export default class Dep{
  // targetFunction和targetobject
  static [x: string]: any; 
  // 需要进行的发布
  subs: Array<any>;
  constructor() {
    this.subs = [];
  }

  addSub(target: any) {
    // 因为计算属性和数据变化可能用同一个数据所以需要对编号进行处理
    while (this.subs[target.uid] !== undefined && target !== this.subs[target.uid]) { target.uid++; }
    // 加入数组
    this.subs[target.uid] = target;
  }

  notify() {
    for (let uid in this.subs) {
      // 当对象是数据的时候就执行更新函数
      if (typeof this.subs[uid] == "object") { this.subs[uid].update(); }
      else {
        // 当对象是计算属性的时候就将它的污值改为true以便更新数据
        this.subs[uid].dirty = true;
      }
    }
  }
}