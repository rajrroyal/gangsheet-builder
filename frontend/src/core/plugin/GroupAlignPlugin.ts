/*
 * @Author: Qin Shaowei
 * @Date: 2023-06-22 16:19:46
 * @LastEditors: Qin Shaowei
 * @LastEditTime: 2023-07-16 12:14:55
 * @Description: Group alignment plugin
 */

import { fabric } from 'fabric';
import Editor from '../core';
type IEditor = Editor;

class GroupAlignPlugin {
  public canvas: fabric.Canvas;
  public editor: IEditor;
  static pluginName = 'GroupAlignPlugin';
  static apis = ['left', 'right', 'xcenter', 'ycenter', 'top', 'bottom', 'xequation', 'yequation'];
  // public hotkeys: string[] = ['space'];
  constructor(canvas: fabric.Canvas, editor: IEditor) {
    this.canvas = canvas;
    this.editor = editor;
  }

  left() {
    const { canvas } = this;
    // const activeObject = canvas.getActiveObject();
    // if (activeObject && activeObject.type === 'activeSelection') {
    //   const activeSelection = activeObject;
    //   const activeObjectLeft = -(activeObject.width / 2);
    //   activeSelection.forEachObject((item) => {
    //     item.set({
    //       left: activeObjectLeft,
    //     });
    //     item.setCoords();
    //     canvas.renderAll();
    //   });
    // }

    const activeObject = canvas.getActiveObject();
    const selectObjects = canvas.getActiveObjects();
    const { left } = activeObject;
    canvas.discardActiveObject();
    selectObjects.forEach((item) => {
      const bounding = item.getBoundingRect(true);
      item.set({
        left: left - bounding.left + item.left,
      });
      item.setCoords();
    });
    const activeSelection = new fabric.ActiveSelection(selectObjects, {
      canvas: canvas,
    });
    canvas.setActiveObject(activeSelection);
    canvas.requestRenderAll();
  }

  right() {
    const { canvas } = this;
    // const activeObject = canvas.getActiveObject();
    // if (activeObject && activeObject.type === 'activeSelection') {
    //   const activeSelection = activeObject;
    //   const activeObjectLeft = activeObject.width / 2;
    //   activeSelection.forEachObject((item) => {
    //     item.set({
    //       left: activeObjectLeft - item.width * item.scaleX,
    //     });
    //     item.setCoords();
    //     canvas.renderAll();
    //   });
    // }

    const activeObject = canvas.getActiveObject();
    const selectObjects = canvas.getActiveObjects();
    const { left, width } = activeObject;
    canvas.discardActiveObject();
    selectObjects.forEach((item) => {
      const bounding = item.getBoundingRect(true);
      item.set({
        left: left + width - (bounding.left + bounding.width) + item.left,
      });
    });
    const activeSelection = new fabric.ActiveSelection(selectObjects, {
      canvas: canvas,
    });
    canvas.setActiveObject(activeSelection);
    canvas.requestRenderAll();
  }

  xcenter() {
    const { canvas } = this;
    // const activeObject = canvas.getActiveObject();
    // if (activeObject && activeObject.type === 'activeSelection') {
    //   const activeSelection = activeObject;
    //   activeSelection.forEachObject((item) => {
    //     item.set({
    //       left: 0 - (item.width * item.scaleX) / 2,
    //     });
    //     item.setCoords();
    //     canvas.renderAll();
    //   });
    // }

    const activeObject = canvas.getActiveObject();
    const selectObjects = canvas.getActiveObjects();
    const { left, width } = activeObject;
    canvas.discardActiveObject();
    selectObjects.forEach((item) => {
      const bounding = item.getBoundingRect(true);
      item.set({
        left: left + width / 2 - (bounding.left + bounding.width / 2) + item.left,
      });
    });
    const activeSelection = new fabric.ActiveSelection(selectObjects, {
      canvas: canvas,
    });
    canvas.setActiveObject(activeSelection);
    canvas.requestRenderAll();
  }

  ycenter() {
    const { canvas } = this;
    // const activeObject = canvas.getActiveObject();
    // if (activeObject && activeObject.type === 'activeSelection') {
    //   const activeSelection = activeObject;
    //   activeSelection.forEachObject((item) => {
    //     item.set({
    //       top: 0 - (item.height * item.scaleY) / 2,
    //     });
    //     item.setCoords();
    //     canvas.renderAll();
    //   });
    // }

    const activeObject = canvas.getActiveObject();
    const selectObjects = canvas.getActiveObjects();
    const { top, height } = activeObject;
    canvas.discardActiveObject();
    selectObjects.forEach((item) => {
      const bounding = item.getBoundingRect(true);
      item.set({
        top: top + height / 2 - (bounding.top + bounding.height / 2) + item.top,
      });
    });
    const activeSelection = new fabric.ActiveSelection(selectObjects, {
      canvas: canvas,
    });
    canvas.setActiveObject(activeSelection);
    canvas.requestRenderAll();
  }

  top() {
    const { canvas } = this;
    // const activeObject = canvas.getActiveObject();
    // if (activeObject && activeObject.type === 'activeSelection') {
    //   const activeSelection = activeObject;
    //   const activeObjectTop = -(activeObject.height / 2);
    //   activeSelection.forEachObject((item) => {
    //     item.set({
    //       top: activeObjectTop,
    //     });
    //     item.setCoords();
    //     canvas.renderAll();
    //   });
    // }

    const activeObject = canvas.getActiveObject();
    const selectObjects = canvas.getActiveObjects();
    const { top } = activeObject;
    canvas.discardActiveObject();
    selectObjects.forEach((item) => {
      const bounding = item.getBoundingRect(true);
      item.set({
        top: top - bounding.top + item.top,
      });
    });
    const activeSelection = new fabric.ActiveSelection(selectObjects, {
      canvas: canvas,
    });
    canvas.setActiveObject(activeSelection);
    canvas.requestRenderAll();
  }

  bottom() {
    const { canvas } = this;
    // const activeObject = canvas.getActiveObject();
    // if (activeObject && activeObject.type === 'activeSelection') {
    //   const activeSelection = activeObject;
    //   const activeObjectTop = activeObject.height / 2;
    //   activeSelection.forEachObject((item) => {
    //     item.set({
    //       top: activeObjectTop - item.height * item.scaleY,
    //     });
    //     item.setCoords();
    //     canvas.renderAll();
    //   });
    // }

    const activeObject = canvas.getActiveObject();
    const selectObjects = canvas.getActiveObjects();
    const { top, height } = activeObject;
    canvas.discardActiveObject();
    selectObjects.forEach((item) => {
      const bounding = item.getBoundingRect(true);
      item.set({
        top: top + height - (bounding.top + bounding.height) + item.top,
      });
    });
    const activeSelection = new fabric.ActiveSelection(selectObjects, {
      canvas: canvas,
    });
    canvas.setActiveObject(activeSelection);
    canvas.requestRenderAll();
  }

  xequation() {
    const { canvas } = this;
    const activeObject = canvas.getActiveObject();

    // The width attribute is inaccurate and requires coordinate conversion.
    function getItemWidth(item) {
      return item.aCoords.tr.x - item.aCoords.tl.x;
    }

    // Get the height of all elements
    function getAllItemHeight() {
      let count = 0;
      activeObject.forEachObject((item) => {
        count += getItemWidth(item);
      });
      return count;
    }
    // Get average spacing
    function spacWidth() {
      const count = getAllItemHeight();
      const allSpac = activeObject.width - count;
      return allSpac / (activeObject._objects.length - 1);
    }

    // Get the height of all elements before the current element
    function getItemLeft(i) {
      if (i === 0) return 0;
      let width = 0;
      for (let index = 0; index < i; index++) {
        width += getItemWidth(activeObject._objects[index]);
      }
      return width;
    }

    if (activeObject && activeObject.type === 'activeSelection') {
      const activeSelection = activeObject;
      // sort
      activeSelection._objects.sort((a, b) => a.left - b.left);

      // Average spacing calculation
      const itemSpac = spacWidth();
      // Group origin height
      const yHeight = activeObject.width / 2;

      activeObject.forEachObject((item, i) => {
        // Get the height of all elements before the current element
        const preHeight = getItemLeft(i);
        // Top distance spacing * index + previous element height - origin height
        const top = itemSpac * i + preHeight - yHeight;
        item.set('left', top);
      });
      canvas.renderAll();
    }
  }

  yequation() {
    const { canvas } = this;
    const activeObject = canvas.getActiveObject();
    // The width attribute is inaccurate and requires coordinate conversion.
    function getItemHeight(item) {
      return item.aCoords.bl.y - item.aCoords.tl.y;
    }
    // Get the height of all elements
    function getAllItemHeight() {
      let count = 0;
      activeObject.forEachObject((item) => {
        count += getItemHeight(item);
      });
      return count;
    }
    // Get average spacing
    function spacHeight() {
      const count = getAllItemHeight();
      const allSpac = activeObject.height - count;
      return allSpac / (activeObject._objects.length - 1);
    }

    // Get the height of all elements before the current element
    function getItemTop(i) {
      if (i === 0) return 0;
      let height = 0;
      for (let index = 0; index < i; index++) {
        height += getItemHeight(activeObject._objects[index]);
      }
      return height;
    }

    if (activeObject && activeObject.type === 'activeSelection') {
      const activeSelection = activeObject;
      // sort
      activeSelection._objects.sort((a, b) => a.top - b.top);

      // Average spacing calculation
      const itemSpac = spacHeight();
      // Group origin height
      const yHeight = activeObject.height / 2;

      activeObject.forEachObject((item, i) => {
        // Get the height of all elements before the current element
        const preHeight = getItemTop(i);
        // Top distance spacing * index + previous element height - origin height
        const top = itemSpac * i + preHeight - yHeight;
        item.set('top', top);
      });
      canvas.renderAll();
    }
  }

  destroy() {
    console.log('pluginDestroy');
  }
}

export default GroupAlignPlugin;
