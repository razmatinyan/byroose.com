type MainThreadTask = () => void

const pendingTasks: MainThreadTask[] = []
let draining = false

function yieldToMain() {
	return new Promise<void>(resolve => setTimeout(resolve, 0))
}

async function drainTasks() {
	draining = true
	while (pendingTasks.length) {
		pendingTasks.shift()?.()
		await yieldToMain()
	}
	draining = false
}

export function queueMainThreadTask(task: MainThreadTask) {
	return new Promise<void>((resolve, reject) => {
		pendingTasks.push(() => {
			try {
				task()
				resolve()
			} catch (error) {
				reject(error)
			}
		})
		if (!draining) drainTasks()
	})
}
