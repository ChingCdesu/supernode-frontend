<script lang="ts" setup>
import { NSwitch } from 'naive-ui';
import { Icon } from '@vicons/utils';

import { Sun, Moon } from '@vicons/tabler';
import { useDark } from '@vueuse/core';

const isDark = useDark();
</script>

<template>
  <NSwitch v-model:value="isDark" size="large">
    <template #unchecked-icon>
      <Icon>
        <Sun />
      </Icon>
    </template>
    <template #checked-icon>
      <Icon>
        <Moon />
      </Icon>
    </template>
  </NSwitch>
</template>
