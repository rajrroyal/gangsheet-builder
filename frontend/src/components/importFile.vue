<!--
 * @Author: Qin Shaowei
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: Qin Shaowei
 * @LastEditTime: 2023-07-16 12:51:11
 * @Description: Insert SVG elements
-->

<template>
  <div class="import-file">
    <div class="header" style="border: 1px dashed; text-align: center" @click="insertTypeHand">
      <Button class="button" type="text" size="small">Upload Image</Button>
      <div>
        <small>Upload images larger than 300 x 300px. Supported formats:png,jpeg,jpg</small>
      </div>
    </div>
  </div>
</template>

<script name="ImportFile" setup>
import { getImgStr, selectFiles } from '@/utils/utils';
import useSelect from '@/hooks/select';
import { v4 as uuid } from 'uuid';

const { fabric, canvasEditor } = useSelect();
const state = reactive({
  showModal: false,
  svgStr: '',
});
const HANDLEMAP = {
  // Insert picture
  insertImg: function () {
    selectFiles({ accept: 'image/*', multiple: true }).then((fileList) => {
      Array.from(fileList).forEach((item) => {
        getImgStr(item).then((file) => {
          insertImgFile(file);
        });
      });
    });
  },
  // Insert SVG elements
  insertSvgStrModal: function () {
    state.svgStr = '';
    state.showModal = true;
  },
  // Insert string element
  insertSvgStr: function () {
    fabric.loadSVGFromString(state.svgStr, (objects, options) => {
      const item = fabric.util.groupSVGElements(objects, {
        ...options,
        name: 'defaultSVG',
        id: uuid(),
      });
      canvasEditor.canvas.add(item).centerObject(item).renderAll();
    });
  },
};

const insertTypeHand = () => {
  const cb = HANDLEMAP['insertImg'];
  cb && typeof cb === 'function' && cb();
};
// Insert picture file
function insertImgFile(file) {
  if (!file) throw new Error('file is undefined');
  const imgEl = document.createElement('img');
  imgEl.src = file;
  // Insert page
  document.body.appendChild(imgEl);
  imgEl.onload = () => {
    // Create picture object
    const imgInstance = new fabric.Image(imgEl, {
      id: uuid(),
      name: 'Picture 1',
      left: 100,
      top: 100,
    });
    // Set zoom
    canvasEditor.canvas.add(imgInstance);
    canvasEditor.canvas.setActiveObject(imgInstance);
    canvasEditor.canvas.renderAll();
    // Remove image elements from the page
    imgEl.remove();
  };
}
</script>

<style scoped lang="less">
.button {
  background-color: black;
  color: white;
  margin-bottom: 10px;
}
.header {
  padding: 30px 10px;
}
button {
  border-radius: 5px;
}
small {
  opacity: 0.6;
}
:deep(.ivu-select-dropdown) {
  z-index: 999;
}
</style>
