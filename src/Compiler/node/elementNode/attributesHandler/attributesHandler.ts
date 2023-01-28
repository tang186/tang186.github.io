import MVVM from "../../../../Core/MVVM";
import forHelp from "./parse/parseFor";
import ifHelp from "./parse/parseIf";
import showHelp from "./parse/parseShow";
import htmlHelp from "./parse/parseHtml";
import modelHelp from "./parse/parseModel";
import textHelp from "./parse/parseText";
import bindHelp from "./parse/parseBind";
function attributesHandler(dirName:string, attrValue:string,context:MVVM, node:HTMLElement, fragement: DocumentFragment) {
  // 属性的各个不同的处理方法
  if (dirName.indexOf("bind:") === 0) {
    bindHelp(dirName, attrValue, context, node)
  }
  else {
    switch (dirName) {
    case "for":
      forHelp(attrValue, context, node, fragement);
      break;
    case "text":
      textHelp(attrValue, context, node);
      break;
    case "model":
      modelHelp(attrValue, context, node);
      break;
    case "html":
      htmlHelp(attrValue, context, node);
      break;
    case "show":
      showHelp(attrValue, context, node);
      break;
    case "if":
      ifHelp(attrValue, context, node, fragement);
      break;
    }
  }
}

export default attributesHandler;