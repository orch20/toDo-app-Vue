<template>
    <li class="list-group-item py-3">
        <div class="d-flex justify-content-start align-items-center">
            <input 
            class="form-check-input mt-0" 
            type="checkbox" 
            :class="completedClass" 
            :checked="task.is_completed"
            @change="markTaskAsCompleted"
            />
            <div class="ms-2 flex-grow-" 
            :class="completedClass" 
            title="Double click the text to edit or remove"
            @dblclick="$event => isEdit=true">
                <div class="relative" v-if="isEdit">
                    <input class="editable-task" 
                        type="text" 
                        v-focus
                        @keyup.esc="undo" 
                        @keyup.enter="updateTask"
                        v-model="editingTask"
                    />
                </div>
                <span v-else>{{ task.name }}</span>
            </div>
            <!-- <div class="task-date">24 Feb 12:00</div> -->
        </div>
        <TaskActions 
            @edit="$event=>isEdit = true" 
            @remove="removeTask"

        v-show="!isEdit" />
    </li>
</template>

<script setup>
import { computed, ref } from 'vue';
import TaskActions from './TaskActions.vue';
import {useTaskStore} from '../../stores/task';

const store = useTaskStore();

const { handelUpdatedTask, handelCompletedTask, handelRemovedTask } = store;

const isEdit = ref(false);
const completedClass = computed(() => props.task.is_completed ? 'completed' : '');
const editingTask = ref(props.task.name);

const vFocus = {
    mounted: (el) => el.focus(),
};

const updateTask = async event => {
    // if (editingTask.value === props.task.name) return;
    const updatedTask = {
        ...props.task,
        name: event.target.value

    }
    isEdit.value = false;
    await handelUpdatedTask(updatedTask);
    
}

const undo = () => { 
    isEdit.value = false;
    editingTask.value = props.task.name;
}

const markTaskAsCompleted = async () => { 
    const updatedTask = {
        ...props.task,
        is_completed: !props.task.is_completed
    }
    await handelCompletedTask(updatedTask);
    
}

const removeTask = async () => {
    if (confirm('Are you sure?')) {
        await handelRemovedTask(props.task);
    }
    
    
}



    const props = defineProps (
        {
            task: {
                type: Object,
                // required: true
            }
        })

</script>