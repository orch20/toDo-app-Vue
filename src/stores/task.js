import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import { allTasks, createTask, updateTask, completeTask, deleteTask } from '../http/task-api'

export const useTaskStore = defineStore('taskStore', () => {
  const tasks = ref([])
  const task = reactive({
    id: null,
    name: null,
    is_completed: false
  })

  const completedTasks = computed(() => tasks.value.filter((task) => task.is_completed))
  const uncompletedTasks = computed(() => tasks.value.filter((task) => !task.is_completed))

  const fetchAllTasks = async () => {
    const { data } = await allTasks()
    tasks.value = data.data
  }

  return {
    tasks,
    task,
    completedTasks,
    uncompletedTasks,
    fetchAllTasks
  }
})

// export const useTaskStore = defineStore('taskStore', {
//   state: () => ({
//     tasks: [],

//     task: {
//       id: 1,
//       name: 'First task',
//       is_completed: false
//     }
//   }),
//   getters: {
//     completedTasks: (state) => state.tasks.filter((task) => task.is_completed),

//     uncompletedTasks() {
//       return this.tasks.filter((task) => !task.is_completed)
//     }
//   },
//   actions: {
//     async fetchAllTasks() {
//       const { data } = await allTasks()
//       this.tasks = data.data
//     }
//   }
// })
