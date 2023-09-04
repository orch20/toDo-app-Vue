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

  const handelAddedTask = async (task) => {
    const { data: createdTask } = await createTask(task)
    tasks.value.unshift(createdTask.data)
  }

  const handelUpdatedTask = async (task) => {
    const { data: updatedTask } = await updateTask(task.id, {
      name: task.name
    })
    const currentTask = tasks.value.find((t) => t.id === task.id)
    currentTask.name = updatedTask.data.name
  }

  const handelCompletedTask = async (task) => {
    const { data: updatedTask } = await completeTask(task.id, {
      is_completed: task.is_completed
    })
    const currentTask = tasks.value.find((t) => t.id === task.id)
    currentTask.is_completed = updatedTask.data.is_completed
  }

  const handelRemovedTask = async (task) => {
    await deleteTask(task.id)

    const index = tasks.value.findIndex((t) => t.id === task.id)
    tasks.value.splice(index, 1)
  }

  return {
    tasks,
    task,
    completedTasks,
    uncompletedTasks,
    fetchAllTasks,
    handelAddedTask,
    handelUpdatedTask,
    handelCompletedTask,
    handelRemovedTask
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
