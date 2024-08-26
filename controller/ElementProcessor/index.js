import { ChildPageHandler } from "./ChildPageHandler.js";
import { ColumnHandler, ColumnListHandler } from "./ColumnHandler.js";
import { ParagraphHandler } from "./ParagraphHandler.js";
import { ToggleHandler } from "./ToggleHandler.js";

class ElementProcessor {
  constructor(notionApi) {
    this.elements = [];
    this.handlers = {};
    this.notionApi = notionApi;

    this.registerHandler('column_list', new ColumnListHandler(this));
    this.registerHandler('column', new ColumnHandler(this));
    this.registerHandler('toggle', new ToggleHandler(this));
    this.registerHandler('paragraph', new ParagraphHandler(this));
    this.registerHandler('child_page', new ChildPageHandler(this));
  }

  registerHandler(type, handler) {
    this.handlers[type] = handler;
  }

  processChild(child, parentId) {
    const handler = this.handlers[child.type];
    if (handler) {
      handler.handle(child, parentId);
    }
    console.log(child.type)
    return child.has_children ? child.id : null;
  }

  addPage(id, label) {
    if (!this.elements.some(e => e.id === id && e.type === 'page')) {
      this.elements.push({ id, label, type: 'page' });
    }
  }

  addNode(source, target) {
    if (source) {
      this.elements.push({ source, target, type: 'node' });
    }
  }

  getElements() {
    return this.elements;
  }
}

export default ElementProcessor