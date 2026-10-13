<script setup lang="ts">
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import {
   DropdownMenu,
   DropdownMenuCheckboxItem,
   DropdownMenuContent,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { appIcons } from "@/lib/icons";

export interface ServiceOption {
   id: string;
   name: string;
}

const { options } = defineProps<{
   options: readonly ServiceOption[];
}>();

const previewing = useProjectEditorPreview();
const selectedIds = defineModel<string[]>({ required: true });

const selectedOptions = computed(() =>
   options.filter((option) => selectedIds.value.includes(option.id)),
);

function setSelected(id: string, selected: boolean | "indeterminate") {
   const others = selectedIds.value.filter((selectedId) => selectedId !== id);
   selectedIds.value = selected === true ? [...others, id] : others;
}
</script>

<template>
   <div class="services-picker">
      <DropdownMenu v-if="!previewing">
         <DropdownMenuTrigger as-child>
            <Button variant="outline" size="lg" class="services-picker-trigger">
               Choose services
               <Icon :name="appIcons.chevronDown" aria-hidden="true" />
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="start" class="min-w-64">
            <DropdownMenuCheckboxItem
               v-for="option in options"
               :key="option.id"
               :model-value="selectedIds.includes(option.id)"
               @update:model-value="setSelected(option.id, $event)"
               @select.prevent
            >
               {{ option.name }}
            </DropdownMenuCheckboxItem>
         </DropdownMenuContent>
      </DropdownMenu>

      <ul v-if="selectedOptions.length" class="services-list">
         <li v-for="option in selectedOptions" :key="option.id">{{ option.name }}</li>
      </ul>
      <p v-else-if="!previewing" class="services-empty">No services selected yet.</p>
   </div>
</template>

<style scoped>
@reference "../../assets/css/tailwind.css";

.services-picker {
   @apply flex flex-col items-start gap-4;
}

.services-picker-trigger {
   @apply gap-2;
}

.services-list {
   @apply flex flex-col gap-1.5 text-2xl leading-tight font-medium md:text-3xl tracking-[-0.02em];
}

.services-empty {
   @apply text-xl text-muted-foreground;
}
</style>
