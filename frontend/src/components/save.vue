<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-07-24 23:12:22
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-04-10 14:33:18
 * @Description: 保存文件
-->

<template>
  <div class="save-box">
    <Button style="margin-left: 10px" type="text" @click="beforeClear">
      {{ $t('empty') }}{{ state }}
    </Button>
    <Button type="primary" @click="saveImg">
      {{ $t('keep') }}
    </Button>
    <!-- <Dropdown style="margin-left: 10px" @on-click="saveWith">
      <Button type="primary">
        {{ $t('keep') }}
        <Icon type="ios-arrow-down"></Icon>
      </Button>
      <template #list>
        <DropdownMenu>
          <DropdownItem name="clipboard">{{ $t('copy_to_clipboard') }}</DropdownItem>
          <DropdownItem name="saveImg">{{ $t('save_as_picture') }}</DropdownItem>
          <DropdownItem name="saveSvg">{{ $t('save_as_svg') }}</DropdownItem>
          <DropdownItem name="saveJson" divided>{{ $t('save_as_json') }}</DropdownItem>
        </DropdownMenu>
      </template>
    </Dropdown> -->
  </div>
</template>

<script setup name="save-bar">
import { Modal } from 'view-ui-plus';
import useSelect from '@/hooks/select';

import $ from 'jquery';
import { useI18n } from 'vue-i18n';
// import { downloadFile } from '@/utils/utils';

const { t } = useI18n();

const { canvasEditor, configParams } = useSelect();
const saveImg = () => {
  console.log(configParams);
  var imageData = canvasEditor.getImgData();
  $.ajax({
    url: 'https://codesapient.com/gangsheet-builder/saveFile.php',
    type: 'POST',
    data: {
      image_data: imageData,
    },
    success: function (response) {
      // Handle success response
      const message = {
        type: 'add_cart_gs',
        data: {
          quantity: 1,
          id: '43851214684309',
          properties: {
            Image: response,
          },
        },
      };
      window.parent.postMessage(message, 'https://customcheckoutzeus.myshopify.com');
      console.log('Product added to cart successfully' + response);
    },
    error: function (xhr, status, error) {
      // Handle error response
      console.error('Error adding product to cart:', error);
    },
  });
  // console.log(imageData);
  // const message = {
  //   type: 'add_cart_gs',
  //   data: {
  //     quantity: 1,
  //     id: '43851214684309',
  //     properties: {
  //       Image: imageData,
  //     },
  //   },
  // };
  // window.parent.postMessage(message, 'https://customcheckoutzeus.myshopify.com');
  //canvasEditor.saveImg();
};
// const cbMap = {
//   clipboard() {
//     canvasEditor.clipboard();
//   },

//   saveJson() {
//     canvasEditor.saveJson();
//   },

//   saveSvg() {
//     canvasEditor.saveSvg();
//   },

//   saveImg() {
//     canvasEditor.saveImg();
//   },
// };

// const saveWith = debounce(function (type) {
//   cbMap[type] && typeof cbMap[type] === 'function' && cbMap[type]();
// }, 300);

/**
 * @desc clear canvas 清空画布
 */
const clear = () => {
  canvasEditor.clear();
};

const beforeClear = () => {
  Modal.confirm({
    title: t('tip'),
    content: `<p>${t('clearTip')}</p>`,
    okText: t('ok'),
    cancelText: t('cancel'),
    onOk: () => clear(),
  });
};
</script>

<style scoped lang="less">
.save-box {
  display: inline-block;
  padding-right: 10px;
}
</style>
