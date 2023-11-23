/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * @Author: Qin Shaowei
 * @Date: 2023-06-20 13:06:31
 * @LastEditors: Qin Shaowei
 * @LastEditTime: 2023-07-04 23:37:07
 * @Description: History plugin
 */

import { fabric } from 'fabric';
import Editor from '../core';
import { ref } from 'vue';
import { useRefHistory } from '@vueuse/core';
type IEditor = Editor;
// import { v4 as uuid } from 'uuid';

class HistoryPlugin {
  public canvas: fabric.Canvas;
  public editor: IEditor;
  static pluginName = 'HistoryPlugin';
  static apis = ['undo', 'redo', 'getHistory'];
  static events = ['historyInitSuccess'];
  public hotkeys: string[] = ['ctrl+z'];
  history: any;
  constructor(canvas: fabric.Canvas, editor: IEditor) {
    this.canvas = canvas;
    this.editor = editor;

    this._init();
  }

  _init() {
    this.history = useRefHistory(ref(), {
      capacity: 50,
    });
    this.canvas.on({
      'object:added': (event) => this._save(event),
      'object:modified': (event) => this._save(event),
      'selection:updated': (event) => this._save(event),
    });
  }

  getHistory() {
    return this.history;
  }
  _save(event) {
    // Filter selected element events
    const isSelect = event.action === undefined && event.e;
    if (isSelect || !this.canvas) return;
    const workspace = this.canvas.getObjects().find((item) => item.id === 'workspace');
    if (!workspace) {
      return;
    }
    if (this.history.isTracking.value) {
      this.history.source.value = this.editor.getJson();
    }
  }

  undo() {
    if (this.history.canUndo.value) {
      this.renderCanvas();
      this.history.undo();
    }
  }

  redo() {
    this.history.redo();
    this.renderCanvas();
  }

  renderCanvas = () => {
    this.history.pause();
    this.canvas.clear();
    this.canvas.loadFromJSON(this.history.source.value, () => {
      this.canvas.renderAll();
      this.history.resume();
    });
  };

  // Shortcut key expansion callback
  hotkeyEvent(eventName: string, e: any) {
    if (eventName === 'ctrl+z' && e.type === 'keydown') {
      this.undo();
    }
  }
  destroy() {
    console.log('pluginDestroy');
  }
}

export default HistoryPlugin;
