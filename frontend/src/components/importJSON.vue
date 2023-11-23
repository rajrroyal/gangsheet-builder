<!--
 * @Author: Qin Shaowei
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: Qin Shaowei
 * @LastEditTime: 2023-07-16 12:55:12
 * @Description: Import JSON file
-->

<template>
  <div style="display: inline-block">
    <Button @click="insert" type="text" size="small">{{ $t('import_files') }}</Button>
  </div>
</template>

<script name="ImportJson" setup>
import useSelect from '@/hooks/select';
// import { selectFiles, downFontByJSON } from '@/utils/utils';

const { canvasEditor } = useSelect();
const insert = () => {
  canvasEditor.insert();
};

// function insertSvgFile(jsonFile) {
//   // 加载字体后导入
//   downFontByJSON(jsonFile).then(() => {
//     canvas.c.loadFromJSON(jsonFile, () => {
//       canvas.c.renderAll.bind(canvas.c);
//       setTimeout(() => {
//         const workspace = canvas.c.getObjects().find((item) => item.id === 'workspace');
//         workspace.set('selectable', false);
//         workspace.set('hasControls', false);
//         canvas.c.requestRenderAll();
//         canvas.editor.editorWorkspace.setSize(workspace.width, workspace.height);
//         canvas.c.renderAll();
//         canvas.c.requestRenderAll();
//       }, 100);
//     });
//   });
// }
</script>
