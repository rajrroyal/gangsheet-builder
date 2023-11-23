/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { fabric } from 'fabric';

export function setupGuideLine() {
  if (fabric.GuideLine) {
    return;
  }

  fabric.GuideLine = fabric.util.createClass(fabric.Line, {
    type: 'GuideLine',
    selectable: false,
    hasControls: false,
    hasBorders: false,
    stroke: '#4bec13',
    originX: 'center',
    originY: 'center',
    padding: 4, // Fill to make the selection range of auxiliary lines larger and easier to select
    globalCompositeOperation: 'difference',
    axis: 'horizontal',
    // excludeFromExport: true,

    initialize(points, options) {
      const isHorizontal = options.axis === 'horizontal';
      // pointer
      this.hoverCursor = isHorizontal ? 'ns-resize' : 'ew-resize';
      // Set new point
      const newPoints = isHorizontal
        ? [-999999, points, 999999, points]
        : [points, -999999, points, 999999];
      // Lock movement
      options[isHorizontal ? 'lockMovementX' : 'lockMovementY'] = true;
      // Call parent class initialization
      this.callSuper('initialize', newPoints, options);

      // Binding events
      this.on('mousedown:before', (e) => {
        if (this.activeOn === 'down') {
          // The object can only be moved after setting selectable:false.
          this.canvas.setActiveObject(this, e.e);
        }
      });

      this.on('moving', (e) => {
        if (this.canvas.ruler.options.enabled && this.isPointOnRuler(e.e)) {
          this.moveCursor = 'not-allowed';
        } else {
          this.moveCursor = this.isHorizontal() ? 'ns-resize' : 'ew-resize';
        }
        this.canvas.fire('guideline:moving', {
          target: this,
          e: e.e,
        });
      });

      this.on('mouseup', (e) => {
        // Move to the ruler and remove the guide lines
        if (this.canvas.ruler.options.enabled && this.isPointOnRuler(e.e)) {
          // console.log('Remove guide lines', this);
          this.canvas.remove(this);
          return;
        }
        this.moveCursor = this.isHorizontal() ? 'ns-resize' : 'ew-resize';
        this.canvas.fire('guideline:mouseup', {
          target: this,
          e: e.e,
        });
      });

      this.on('removed', () => {
        this.off('removed');
        this.off('mousedown:before');
        this.off('moving');
        this.off('mouseup');
      });
    },

    getBoundingRect(absolute, calculate) {
      this.bringToFront();

      const isHorizontal = this.isHorizontal();
      const rect = this.callSuper('getBoundingRect', absolute, calculate);
      rect[isHorizontal ? 'top' : 'left'] += rect[isHorizontal ? 'height' : 'width'] / 2;
      rect[isHorizontal ? 'height' : 'width'] = 0;
      return rect;
    },

    isPointOnRuler(e) {
      const isHorizontal = this.isHorizontal();
      const hoveredRuler = this.canvas.ruler.isPointOnRuler(new fabric.Point(e.offsetX, e.offsetY));
      if (
        (isHorizontal && hoveredRuler === 'horizontal') ||
        (!isHorizontal && hoveredRuler === 'vertical')
      ) {
        return hoveredRuler;
      }
      return false;
    },

    isHorizontal() {
      return this.height === 0;
    },
  } as fabric.IGuideLineClassOptions);

  fabric.GuideLine.fromObject = function (object, callback) {
    const clone = fabric.util.object.clone as (object: any, deep: boolean) => any;

    function _callback(instance: any) {
      delete instance.xy;
      callback && callback(instance);
    }

    const options = clone(object, true);
    const isHorizontal = options.height === 0;

    options.xy = isHorizontal ? options.y1 : options.x1;
    options.axis = isHorizontal ? 'horizontal' : 'vertical';

    fabric.Object._fromObject(options.type, options, _callback, 'xy');
  };
}

export default fabric.GuideLine;
