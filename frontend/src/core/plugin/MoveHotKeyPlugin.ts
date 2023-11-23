/*
 * @Author: Qin Shaowei
 * @Date: 2023-06-20 12:52:09
 * @LastEditors: Qin Shaowei
 * @LastEditTime: 2023-06-20 13:06:21
 * @Description: Mobile shortcut keys
 */

import { fabric } from 'fabric';
import Editor from '../core';
type IEditor = Editor;
// import { v4 as uuid } from 'uuid';

class MoveHotKeyPlugin {
  public canvas: fabric.Canvas;
  public editor: IEditor;
  static pluginName = 'MoveHotKeyPlugin';
  public hotkeys: string[] = ['left', 'right', 'down', 'up'];
  constructor(canvas: fabric.Canvas, editor: IEditor) {
    this.canvas = canvas;
    this.editor = editor;
  }

  // Shortcut key expansion callback
  hotkeyEvent(eventName: string, e: any) {
    if (e.type === 'keydown') {
      const { canvas } = this;
      const activeObject = canvas.getActiveObject();
      if (!activeObject) return;
      switch (eventName) {
        case 'left':
          if (activeObject.left === undefined) return;
          activeObject.set('left', activeObject.left - 1);
          break;
        case 'right':
          if (activeObject.left === undefined) return;
          activeObject.set('left', activeObject.left + 1);
          break;
        case 'down':
          if (activeObject.top === undefined) return;
          activeObject.set('top', activeObject.top + 1);
          break;
        case 'up':
          if (activeObject.top === undefined) return;
          activeObject.set('top', activeObject.top - 1);
          break;
        default:
      }
      canvas.renderAll();
    }
  }

  destroy() {
    console.log('pluginDestroy');
  }
}

export default MoveHotKeyPlugin;