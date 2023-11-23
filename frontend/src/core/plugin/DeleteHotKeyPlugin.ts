/*
 * @Author: Qin Shaowei
 * @Date: 2023-06-20 12:57:35
 * @LastEditors: Qin Shaowei
 * @LastEditTime: 2023-06-27 23:10:02
 * @Description: Delete shortcut key
 */

import { fabric } from 'fabric';
import Editor from '../core';
type IEditor = Editor;
// import { v4 as uuid } from 'uuid';

class DeleteHotKeyPlugin {
  public canvas: fabric.Canvas;
  public editor: IEditor;
  static pluginName = 'DeleteHotKeyPlugin';
  static apis = ['del'];
  public hotkeys: string[] = ['backspace'];
  constructor(canvas: fabric.Canvas, editor: IEditor) {
    this.canvas = canvas;
    this.editor = editor;
  }

  // Shortcut key expansion callback
  hotkeyEvent(eventName: string, e: any) {
    if (e.type === 'keydown' && eventName === 'backspace') {
      this.del();
    }
  }

  del() {
    const { canvas } = this;
    const activeObject = canvas.getActiveObjects();
    if (activeObject) {
      activeObject.map((item) => canvas.remove(item));
      canvas.requestRenderAll();
      canvas.discardActiveObject();
    }
  }

  contextMenu() {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      return [null, { text: 'Delete', hotkey: 'Ctrl+V', disabled: false, onclick: () => this.del() }];
    }
  }

  destroy() {
    console.log('pluginDestroy');
  }
}

export default DeleteHotKeyPlugin;
