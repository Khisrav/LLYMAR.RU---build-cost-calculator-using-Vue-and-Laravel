<script>
import ButtonTag from '../components/ButtonTag.vue';
import InputTag from '../components/InputTag.vue';
import HeaderLayout from '../layouts/HeaderLayout.vue';

export default {
    components: {
        HeaderLayout,
        InputTag,
        ButtonTag
    }
}
</script>

<template>
<HeaderLayout/>
<section class="bg-gray-50 dark:bg-black">
  <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 class="text-xl text-center font-bold leading-tight tracking-tight text-black md:text-2xl dark:text-white">
                  Вход
              </h1>
              <form class="space-y-4 md:space-y-6" action="#">
                  <div>
                      <label for="phone" class="block mb-1 text-sm font-medium text-black dark:text-white">Номер телефона</label>
                      <InputTag type="tel" id="phone" name="phone" placeholder="Введите номер телефона" class="w-full"/>
                  </div>
                  <div>
                      <label for="password" class="block mb-1 text-sm font-medium text-black dark:text-white">Пароль</label>
                      <InputTag type="password" id="password" name="password" placeholder="Введите ваш пароль" class="w-full"/>
                  </div>
                  <!-- <div class="flex items-center justify-between">
                      <a href="#" class="text-sm font-medium text-blue-600 hover:underline dark:text-primary-500">Забыли пароль?</a>
                  </div> -->
                  <ButtonTag type="submit" class="w-full">Войти</ButtonTag>
              </form>
          </div>
      </div>
  </div>
</section>
</template>