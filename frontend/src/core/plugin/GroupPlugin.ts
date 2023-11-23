/*
 * @Author: Qin Shaowei
 * @Date: 2023-06-20 13:21:10
 * @LastEditors: Qin Shaowei
 * @LastEditTime: 2023-06-20 13:42:32
 * @Description: Combo Split Combo Plugin
 */

import { fabric } from 'fabric';
import Editor from '../core';
import { v4 as uuid } from 'uuid';
type IEditor = Editor;

class GroupPlugin {
  public canvas: fabric.Canvas;
  public editor: IEditor;
  static pluginName = 'GroupPlugin';
  static apis = ['unGroup', 'group'];
  constructor(canvas: fabric.Canvas, editor: IEditor) {
    this.canvas = canvas;
    this.editor = editor;
  }

  // Split group
  unGroup() {
    const activeObject = this.canvas.getActiveObject() as fabric.Group;
    if (!activeObject) return;
    // First get the currently selected object and then scatter it
    activeObject.toActiveSelection();
    activeObject.getObjects().forEach((item: fabric.Object) => {
      item.set('id', uuid());
    });
    this.canvas.discardActiveObject().renderAll();
  }

  group() {
    // Combining elements
    const activeObj = this.canvas.getActiveObject() as fabric.ActiveSelection;
    if (!activeObj) return;
    const activegroup = activeObj.toGroup();
    const objectsInGroup = activegroup.getObjects();
    activegroup.clone((newgroup: fabric.Group) => {
      newgroup.set('id', uuid());
      this.canvas.remove(activegroup);
      objectsInGroup.forEach((object) => {
        this.canvas.remove(object);
      });
      this.canvas.add(newgroup);
      this.canvas.setActiveObject(newgroup);
    });
  }

  contextMenu() {
    const activeObject = this.canvas.getActiveObject();
    console.log(activeObject, '111');
    if (activeObject && activeObject.type === 'group') {
      return [
        { text: 'split combination', hotkey: 'Ctrl+V', disabled: false, onclick: () => this.unGroup() },
      ];
    }

    if (this.canvas.getActiveObjects().length > 1) {
      return [{ text: 'combination', hotkey: 'Ctrl+V', disabled: false, onclick: () => this.group() }];
    }
  }
  destroy() {
    console.log('pluginDestroy');
  }
}

export default GroupPlugin;
