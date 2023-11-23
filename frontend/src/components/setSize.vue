<!--
 * @Author: Michael
 * @Date: 2022-09-03 19:16:55
-->

<template>
  <div v-if="!mixinState.mSelectMode">
    <Divider plain orientation="left">{{ $t('size') }}</Divider>
    <ButtonGroup vertical style="margin: 10px 0">
      <Button
        v-for="(item, i) in presetSize"
        :key="`${i}presetSize`"
        size="small"
        style="text-align: left; margin: 10px 0"
        @click="setSizeBy(item.width, item.height)"
      >
        {{ item.label }}
      </Button>
    </ButtonGroup>
  </div>
</template>

<script setup name="CanvasSize">
import { reactive, onMounted } from 'vue';
import useSelect from '@/hooks/select';
import $ from 'jquery';

const { mixinState, canvasEditor } = useSelect();

const DefaultSize = {
  width: 200,
  height: 400,
};

let width = ref(DefaultSize.width);
let height = ref(DefaultSize.height);

const url = 'https://codesapient.com/gangsheet-builder/getSize.php';
const presetSize = reactive([]);

onMounted(() => {
  $.ajax({
    url: url,
    type: 'GET',
    success: function (response) {
      response = JSON.parse(response);
      presetSize.splice(0, presetSize.length, ...response);
      canvasEditor.setSize(response[0].width, response[0].height);
    },
    error: function (xhr, status, error) {
      console.error(error);
    },
  });
  canvasEditor.setSize(width.value, height.value);
  canvasEditor.on('sizeChange', (width, height) => {
    width.value = width;
    height.value = height;
  });
});

const setSizeBy = (w, h) => {
  width.value = w;
  height.value = h;
  setSize();
};

const setSize = () => {
  canvasEditor.setSize(width.value, height.value);
};
</script>

<style scoped lang="less">
:deep(.ivu-form-item) {
  margin-bottom: 0;
}
:deep(.ivu-divider-plain) {
  &.ivu-divider-with-text-left {
    margin: 10px 0;
    font-weight: bold;
  }
}

.form-wrap {
  display: flex;
  justify-content: space-around;
  align-content: center;
  margin-bottom: 10px;
}
</style>
