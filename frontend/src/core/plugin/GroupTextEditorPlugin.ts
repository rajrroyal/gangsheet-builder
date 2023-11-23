/*
 * @Author: Qin Shaowei
 * @Date: 2023-06-22 16:11:40
 * @LastEditors: Qin Shaowei
 * @LastEditTime: 2023-08-07 23:24:36
 * @Description: In-group text editing
 */

import { fabric } from 'fabric';
import Editor from '../core';
import { v4 as uuid } from 'uuid';
type IEditor = Editor;

class GroupTextEditorPlugin {
  public canvas: fabric.Canvas;
  public editor: IEditor;
  static pluginName = 'GroupTextEditorPlugin';
  isDown = false;
  constructor(canvas: fabric.Canvas, editor: IEditor) {
    this.canvas = canvas;
    this.editor = editor;
    this._init();
  }

  // Text input within group
  _init() {
    this.canvas.on('mouse:down', (opt) => {
      this.isDown = true;
      // Reset selected controls
      if (
        opt.target &&
        !opt.target.lockMovementX &&
        !opt.target.lockMovementY &&
        !opt.target.lockRotation &&
        !opt.target.lockScalingX &&
        !opt.target.lockScalingY
      ) {
        opt.target.hasControls = true;
      }
    });

    this.canvas.on('mouse:up', () => {
      this.isDown = false;
    });

    this.canvas.on('mouse:dblclick', (opt) => {
      if (opt.target && opt.target.type === 'group') {
        const selectedObject = this._getGroupObj(opt) as fabric.IText;
        if (!selectedObject) return;
        selectedObject.selectable = true;
        // Since the elements in the group will cause the controls to shift after double-clicking, they are hidden.
        if (selectedObject.hasControls) {
          selectedObject.hasControls = false;
        }
        if (this.isText(selectedObject)) {
          this._bedingTextEditingEvent(selectedObject, opt);
          return;
        }
        this.canvas.setActiveObject(selectedObject);
        this.canvas.renderAll();
      }
    });
  }

  // Get the text element in the group within the click area
  _getGroupTextObj(opt: fabric.IEvent<MouseEvent>) {
    const pointer = this.canvas.getPointer(opt.e, true);
    const clickObj = this.canvas._searchPossibleTargets(opt.target?._objects, pointer);
    if (clickObj && this.isText(clickObj)) {
      return clickObj;
    }
    return false;
  }

  _getGroupObj(opt: fabric.IEvent<MouseEvent>) {
    const pointer = this.canvas.getPointer(opt.e, true);
    const clickObj = this.canvas._searchPossibleTargets(opt.target?._objects, pointer);
    return clickObj;
  }

  // Editing text by combining and reassembling may consume performance.
  _bedingTextEditingEvent(textObject: fabric.IText, opt: fabric.IEvent<MouseEvent>) {
    if (!opt.target) return;
    const textObjectJSON = textObject.toObject();
    const groupObj = opt.target;

    const ftype: any = {
      'i-text': 'IText',
      text: 'Text',
      textbox: 'Textbox',
    };

    const eltype: string = ftype[textObjectJSON.type];

    const groupMatrix: number[] = groupObj.calcTransformMatrix();

    const a: number = groupMatrix[0];
    const b: number = groupMatrix[1];
    const c: number = groupMatrix[2];
    const d: number = groupMatrix[3];
    const e: number = groupMatrix[4];
    const f: number = groupMatrix[5];

    const newX = a * textObject.left + c * textObject.top + e;
    const newY = b * textObject.left + d * textObject.top + f;

    const tempText = new fabric[eltype](textObject.text, {
      ...textObjectJSON,
      textAlign: textObject.textAlign,
      left: newX,
      top: newY,
      styles: textObject.styles,
      groupCopyed: textObject.group,
    });
    tempText.id = uuid();
    textObject.visible = false;
    opt.target.addWithUpdate();
    tempText.visible = true;
    tempText.selectable = true;
    tempText.hasConstrols = false;
    tempText.editable = true;
    this.canvas.add(tempText);
    this.canvas.setActiveObject(tempText);
    tempText.enterEditing();
    tempText.selectAll();

    tempText.on('editing:exited', () => {
      // Triggered when entering edit mode
      textObject.set({
        text: tempText.text,
        visible: true,
      });
      opt.target.addWithUpdate();
      tempText.visible = false;
      this.canvas.remove(tempText);
      this.canvas.setActiveObject(opt.target);
    });
  }

  // Bind edit cancel event
  _bedingEditingEvent(textObject: fabric.IText, opt: fabric.IEvent<MouseEvent>) {
    if (!opt.target) return;
    const left = opt.target.left;
    const top = opt.target.top;
    const ids = this._unGroup() || [];

    const resetGroup = () => {
      const groupArr = this.canvas.getObjects().filter((item) => item.id && ids.includes(item.id));
      // Delete element
      groupArr.forEach((item) => this.canvas.remove(item));

      // Generate new group
      const group = new fabric.Group([...groupArr]);
      group.set('left', left);
      group.set('top', top);
      group.set('id', uuid());
      textObject.off('editing:exited', resetGroup);
      this.canvas.add(group);
      this.canvas.discardActiveObject().renderAll();
    };
    // Bind cancel event
    textObject.on('editing:exited', resetGroup);
  }

  // Split the combination and return the ID
  _unGroup() {
    const ids: string[] = [];
    const activeObj = this.canvas.getActiveObject() as fabric.Group;
    if (!activeObj) return;
    activeObj.getObjects().forEach((item) => {
      const id = uuid();
      ids.push(id);
      item.set('id', id);
    });
    activeObj.toActiveSelection();
    return ids;
  }

  isText(obj: fabric.Object) {
    return obj.type && ['i-text', 'text', 'textbox'].includes(obj.type);
  }

  destroy() {
    console.log('pluginDestroy');
  }
}

export default GroupTextEditorPlugin;
