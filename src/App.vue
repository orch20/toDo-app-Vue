<script setup>
import NavBar from './components/NavBar.vue';
// import TaskPage from './pages/TaskPage.vue';
import Footer from './components/Footer.vue';
</script>

<template>
  <NavBar/>
  <!-- <TaskPage/> -->
  <router-view/>
  <Footer/>
</template>

<style scoped>

</style>
