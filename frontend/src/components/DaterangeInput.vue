<script setup lang="ts">
const fromDate = defineModel("fromDate");
const toDate = defineModel("toDate");
</script>

<template>
  <div class="row">
    <div class="col-auto d-flex">
      <label for="from">
        <slot name="from-date-label">

        </slot>
      </label>
      <label for="to">
        <slot name="to-date-label">

        </slot>
      </label>
      <div class="input-group">
        <input v-model="fromDate" class="form-control" type="date" name="from" id="from">
        <span class="input-group-text user-select-none">&rarr;</span>
        <input v-model="toDate" class="form-control" type="date" name="to" id="to">
      </div>
    </div>
  </div>
</template>

<style scoped>
label {
  display: none;
}

label:has(*) {
  display: block;
}
</style>
