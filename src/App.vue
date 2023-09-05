<script setup>
import NavBar from './components/NavBar.vue';
// import TaskPage from './pages/TaskPage.vue';
import Footer from './components/Footer.vue';
</script>

<template>
  <NavBar/>
  <!-- <TaskPage/> -->
  <router-view v-slot="{Component}"> 
    <transition name="fade" mode="out-in">
      <component :is="Component"/>
    </transition>
  </router-view>
  <Footer/>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
