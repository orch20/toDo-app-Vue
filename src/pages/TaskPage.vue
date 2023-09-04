<template>
    <main style="min-height: 50vh; margin-top: 2rem;">
            <div class="container">
                <div class="row">
                    <div class="col-md-8 offset-md-2">
                        <!-- Add new Task -->
                        <NewTask @added="handelAddedTask"/>
                        <!-- List of tasks -->
                        <TasksList :tasks="uncompletedTasks"/>
                        <div class="text-center my-3" v-show="showToggleCompletedBtn">
                            <button class="btn btn-sm btn-secondary"
                             @click="$event=> showCompletedTasks = !showCompletedTasks">
                                {{ showCompletedTasks ? 'Hide' : 'Show' }} completed
                            </button>
                        </div>
                        <TasksList :tasks="completedTasks" :show="completedTaskVisible && showCompletedTasks"/>
                    </div>
                </div>
            </div>
        </main>
</template>

<script setup>
import { onMounted,ref, computed  } from 'vue';
import { allTasks, createTask } from '../http/task-api'
import TasksList from '../components/tasks/TasksList.vue'
import NewTask from '../components/tasks/NewTask.vue'

const tasks = ref([]);
const showCompletedTasks = ref(false);

onMounted(async () => {
    const { data } = await allTasks();
    tasks.value = data.data;
    
});

const uncompletedTasks = computed(() => tasks.value.filter(task => !task.is_completed));
const completedTasks = computed(() => tasks.value.filter(task => task.is_completed));
const showToggleCompletedBtn = computed(
    () => uncompletedTasks.value.length > 0 && completedTasks.value.length > 0);
const completedTaskVisible = computed(
    () => uncompletedTasks.value.length === 0 || completedTasks.value.length > 0)

const handelAddedTask = async task => {
    const { data:createdTask } = await createTask(task);
    tasks.value.unshift(createdTask.data);
}


</script>
