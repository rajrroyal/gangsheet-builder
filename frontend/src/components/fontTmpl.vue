<!--
 * @Author: Qin Shaowei
 * @Date: 2023-04-03 23:01:21
 * @LastEditors: Qin Shaowei
 * @LastEditTime: 2023-07-16 12:47:18
 * @Description: 字体文件
-->

<script setup>
import useSelect from '@/hooks/select';
// import { downFontByJSON } from '@/utils/utils';
import { v4 as uuid } from 'uuid';
import axios from 'axios';
import { Spin } from 'view-ui-plus';
import { useI18n } from 'vue-i18n';

const repoSrc = import.meta.env.APP_REPO;
const { fabric, canvasEditor } = useSelect();
const { t } = useI18n();
const list = [
  {
    label: 'Font',
    tempUrl: `${repoSrc}font-tmpl/1.json`,
    src: `${repoSrc}font-tmpl/1.png`,
  },
  {
    label: 'Font',
    tempUrl: `${repoSrc}font-tmpl/2.json`,
    src: `${repoSrc}font-tmpl/2.png`,
  },
  {
    label: 'Font',
    tempUrl: `${repoSrc}font-tmpl/3.json`,
    src: `${repoSrc}font-tmpl/3.png`,
  },
  {
    label: 'Font',
    tempUrl: `${repoSrc}font-tmpl/4.json`,
    src: `${repoSrc}font-tmpl/4.png`,
  },
  {
    label: 'Font',
    tempUrl: `${repoSrc}font-tmpl/5.json`,
    src: `${repoSrc}font-tmpl/5.png`,
  },
];

// 插入文件
const insertFile = (str) => {
  Spin.show({
    render: (h) => h('div', t('alert.loading_fonts')),
  });
  const obj = JSON.parse(str);
  obj.id = uuid();
  new fabric.Textbox.fromObject(obj, (e) => {
    canvasEditor.canvas.add(e);
    e.center();
    canvasEditor.canvas.setActiveObject(e);
    Spin.hide();
  });
};
// 获取模板数据
const getTempData = (tmplUrl) => {
  Spin.show({
    render: (h) => h('div', t('alert.loading_data')),
  });
  const getTemp = axios.get(tmplUrl);
  getTemp.then((res) => {
    insertFile(JSON.stringify(res.data));
  });
};
</script>

<style scoped lang="less">
.tmpl-img {
  width: 86px;
  cursor: pointer;
  margin-right: 5px;
}
</style>
