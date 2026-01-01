<script setup>
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from '@/components/ui/card'
import { Plus, MoreVertical, Edit, Copy, Trash2, Settings } from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { useGanttStore } from '@/stores/gantt'
import GanttTask from './GanttTask.vue'
import GanttTimeline from './GanttTimeline.vue'
import TaskDialog from './TaskDialog.vue'
import ChartDialog from './ChartDialog.vue'

const ganttStore = useGanttStore()

const selectedTask = ref(null)
const parentTaskId = ref(null)
const showTaskDialog = ref(false)
const showChartDialog = ref(false)
const editingChart = ref(null)

const handleAddTask = (chartId) => {
  ganttStore.setActiveChart(chartId)
  selectedTask.value = null
  parentTaskId.value = null
  showTaskDialog.value = true
}

const handleAddSubtask = (chartId, taskId) => {
  ganttStore.setActiveChart(chartId)
  selectedTask.value = null
  parentTaskId.value = taskId
  showTaskDialog.value = true
}

const handleEditTask = (chartId, task) => {
  ganttStore.setActiveChart(chartId)
  selectedTask.value = task
  parentTaskId.value = null
  showTaskDialog.value = true
}

const handleToggleTaskTimelineCollapse = (chartId, taskId) => {
  ganttStore.setActiveChart(chartId)
  ganttStore.toggleTaskTimelineCollapse(taskId);

  // console.log(chartId, 'update:collapsed', taskId, collapsed);
};

const handleTaskSaved = (taskData) => {
  if (selectedTask.value) {
    // Update existing task
    ganttStore.updateTask(selectedTask.value.id, taskData)
  } else {
    // Add new task or subtask
    ganttStore.addTask(parentTaskId.value)

    // Get the newly created task
    let newTask
    if (parentTaskId.value) {
      const parent = ganttStore.findTask(parentTaskId.value)
      newTask = parent.subtasks[parent.subtasks.length - 1]
    } else {
      newTask = ganttStore.tasks[ganttStore.tasks.length - 1]
    }

    // Update with user-provided data
    ganttStore.updateTask(newTask.id, taskData)
  }

  showTaskDialog.value = false
  selectedTask.value = null
  parentTaskId.value = null
}

const handleDeleteTask = (chartId, taskId) => {
  ganttStore.setActiveChart(chartId)
  if (confirm('Are you sure you want to delete this task?')) {
    ganttStore.deleteTask(taskId)
  }
}

const handleAddChart = () => {
  editingChart.value = null
  showChartDialog.value = true
}

const handleEditChart = (chart) => {
  editingChart.value = chart
  showChartDialog.value = true
}

const handleChartSaved = (chartName, chartSettings) => {
  if (editingChart.value) {
    ganttStore.updateChartName(editingChart.value.id, chartName)
    ganttStore.updateChartSettings(editingChart.value.id, chartSettings)
  } else {
    ganttStore.addChart(chartName, chartSettings)
  }
  showChartDialog.value = false
  editingChart.value = null
}

const handleDuplicateChart = (chart) => {
  ganttStore.duplicateChart(chart.id)
}

const handleDeleteChart = (chart) => {
  if (ganttStore.allCharts.length <= 1) {
    alert('Cannot delete the last chart')
    return
  }

  if (confirm(`Are you sure you want to delete "${chart.name}"?`)) {
    ganttStore.deleteChart(chart.id)
  }
}

const handleTabChange = (chartId) => {
  ganttStore.setActiveChart(chartId)
}

</script>

<template>
  <div class="space-y-4">
    <Card>
      <CardContent>
        <div class="flex items-center justify-between mb-2">
          <CardTitle>Gantt Charts</CardTitle>
          <Button @click="handleAddChart" size="sm" variant="outline">
            <Plus class="w-4 h-4 mr-2" />
            New Chart
          </Button>
        </div>
      </CardContent>
    </Card>

    <Card
      v-for="chart in ganttStore.allCharts"
      :key="chart.id"
      :value="chart.id"
      class="mt-4"
    >
      <CardHeader>
        <CardTitle>
          {{ chart.name }}
          <!-- Chart actions dropdown -->
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button
                variant="ghost"
                size="icon"
                class="h-6 w-6 ml-2"
                @click.stop
              >
                <MoreVertical class="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem @click="handleEditChart(chart)">
                <Settings class="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem @click="handleDuplicateChart(chart)">
                <Copy class="w-4 h-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                @click="handleDeleteChart(chart)"
                class="text-destructive"
              >
                <Trash2 class="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardTitle>
        <CardDescription class="text-sm text-muted-foreground">
          {{ chart.tasks.length }} task{{ chart.tasks.length !== 1 ? 's' : '' }}
        </CardDescription>
        <CardAction>
          <Button @click="handleAddTask(chart.id)" size="sm">
            <Plus class="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-sm text-muted-foreground">

            </p>
          </div>
          <div class="flex space-x-2">

            <!-- <Button @click="handleShowSettings(chart.id)" size="sm">
              <Settings class="w-4 h-4 mr-2" />
              Settings
            </Button> -->
          </div>
        </div>

        <div v-if="chart.tasks.length === 0" class="text-center py-8 text-muted-foreground">
          No tasks yet. Click "Add Task" to get started.
        </div>

        <div v-else class="space-y-2">
          <div class="grid grid-cols-12 gap-4 font-medium text-sm border-b pb-2">
            <div class="col-span-4">Task</div>
            <div class="col-span-3">Planned</div>
            <div class="col-span-3">Actual</div>
            <div class="col-span-2">Actions</div>
          </div>

          <GanttTask
            v-for="task in chart.tasks"
            :key="task.id"
            :task="task"
            @edit="handleEditTask(chart.id, $event)"
            @delete="handleDeleteTask(chart.id, $event)"
            @addSubtask="handleAddSubtask(chart.id, $event)"
          />
        </div>

        <div v-if="chart.tasks.length > 0" class="mt-8">
          <h3 class="text-lg font-semibold mb-4">Timeline</h3>
          <GanttTimeline
            :tasks="chart.tasks"
            :settings="chart.settings"
            @update:collapsed="handleToggleTaskTimelineCollapse(chart.id, $event)"
          />
        </div>
      </CardContent>
    </Card>

    <TaskDialog
      v-model:open="showTaskDialog"
      :task="selectedTask"
      @save="handleTaskSaved"
    />

    <ChartDialog
      v-model:open="showChartDialog"
      :chartName="editingChart?.name"
      :chartSettings="editingChart?.settings"
      @save="handleChartSaved"
    />

  </div>
</template>
