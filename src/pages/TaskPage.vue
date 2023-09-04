<template>
    <main style="min-height: 50vh; margin-top: 2rem;">
            <div class="container">
                <div class="row">
                    <div class="col-md-8 offset-md-2">
                        <!-- Add new Task -->
                        <NewTask @added="handelAddedTask"/>
                        <!-- List of tasks -->
                        <TasksList 
                        :tasks="uncompletedTasks"
                        @updated="handelUpdatedTask"
                        @completed="handelCompletedTask"
                        @removed="handelRemovedTask"
                        />
                        <div class="text-center my-3" v-show="showToggleCompletedBtn">
                            <button class="btn btn-sm btn-secondary"
                             @click="$event=> showCompletedTasks = !showCompletedTasks">
                                {{ showCompletedTasks ? 'Hide' : 'Show' }} completed
                            </button>
                        </div>
                        <TasksList 
                        :tasks="completedTasks" 
                        :show="completedTaskVisible && showCompletedTasks"
                        @updated="handelUpdatedTask"
                        @completed="handelCompletedTask"
                        @removed="handelRemovedTask"
                        />
                        
                    </div>
                </div>
            </div>
        </main>
</template>

<script setup>
import { onMounted,ref, computed  } from 'vue';
import { createTask, updateTask, completeTask, deleteTask } from '../http/task-api'
import TasksList from '../components/tasks/TasksList.vue'
import NewTask from '../components/tasks/NewTask.vue'
import { useTaskStore } from '../stores/task'
import { storeToRefs } from 'pinia'

const store = useTaskStore();
const { completedTasks, uncompletedTasks } = storeToRefs(store);
const {fetchAllTasks} = store

const tasks = ref([]);
const showCompletedTasks = ref(false);

onMounted(async () => {
    await fetchAllTasks ()   
});

const showToggleCompletedBtn = computed(
    () => uncompletedTasks.value.length > 0 && completedTasks.value.length > 0);
const completedTaskVisible = computed(
    () => uncompletedTasks.value.length === 0 || completedTasks.value.length > 0)

const handelAddedTask = async task => {
    const { data:createdTask } = await createTask(task);
    tasks.value.unshift(createdTask.data);
}

const handelUpdatedTask = async task => {
    const {data: updatedTask} = await updateTask(task.id, {
    name: task.name,
    });
    const currentTask = tasks.value.find(t => t.id === task.id);
    currentTask.name = updatedTask.data.name;
}

const handelCompletedTask = async task => {
    const {data: updatedTask} = await completeTask(task.id, {
        is_completed: task.is_completed,
    });
    const currentTask = tasks.value.find(t => t.id === task.id);
    currentTask.is_completed = updatedTask.data.is_completed;
}

const handelRemovedTask = async task => {
    await deleteTask(task.id)

    const index = tasks.value.findIndex(t => t.id === task.id);
    tasks.value.splice(index, 1);
    
}


</script>
