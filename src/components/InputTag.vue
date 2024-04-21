<script>
export default {
    props: ['type', 'placeholder', 'required', 'modelValue'],
    emits: ['update:modelValue']
}
</script>

<template>
<input :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)" 
    :type="type" 
    :placeholder="placeholder" 
    :required="required ? true : null" 
    class="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
/>
</template>