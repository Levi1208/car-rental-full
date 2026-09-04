import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useSearchStore = defineStore("search", () => {
  const fromDate = ref("2026-08-01");
  const toDate = ref("2026-08-01");
  const currentDateString = ref("");

  const errors = computed(() => {
    const errorList: string[] = [];

    try {
      const fromDateWrong = new Date(fromDate.value).toISOString().slice(0, 10) !== fromDate.value;
      const toDateWrong = new Date(toDate.value).toISOString().slice(0, 10) !== toDate.value;
      if (fromDateWrong || toDateWrong) throw new Error("Bad date format.");
    } catch {
      return ["A dátumok feldolgozása sikertelen."];
    }

    if (fromDate.value > toDate.value) errorList.push("A kezdő dátum nem lehet a záró dátum után.");
    if (fromDate.value < currentDateString.value) errorList.push("A foglalás kezdete nem lehet korábbi a mai napnál.");

    return errorList;
  });
  const hasErrors = computed(() => errors.value.length > 0);

  function refreshCurrentDateString() {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    currentDateString.value = `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;
    return currentDateString.value;
  }

  return { fromDate, toDate, currentDateString, refreshCurrentDateString, hasErrors, errors };
},);
