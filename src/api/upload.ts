import {ref} from 'vue'

const API_BASE = 'http://localhost:8000'
export const uploading = ref(false)
const uploadError = ref('')
const taskId = ref('')

// async function pollTask(id:String) {
//     while (true) {
//         const res = await fetch(`${API_BASE}/api/task/${id}`)
//         const data = await res.json()

//         if (data.status === 'done'){
//             progress.value = 100
//             break
//         }

//         progress.value = data.progress ?? 0
//         await new Promise(r => setTimeout(r,100))
//     }
// }

export async function uploadVideo(f:File): Promise<string> {
    uploading.value = true
    uploadError.value = ''
    const form = new FormData()
    form.append('file',f)
    const res = await fetch(`${API_BASE}/api/upload`, {
        method:'POST',
        body:form,
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    
    const data = await res.json()
    taskId.value = data.task_id
    uploading.value = false
    return data.task_id as string
}

export function resultUrl(taskId: string):string {
    return ` ${API_BASE}/api/result/${taskId}`
}

export async function waitForTask(
    taskId: string,
    onProgress?: (p: number) => void
): Promise<void> {
    while(true) {
        const res = await fetch(`${API_BASE}/api/task/${taskId}`)
        const data = await res.json()

        onProgress ?.(data.progressv ?? 0)
        if (data.status === 'done') return
        if (data.status === 'failed') throw new Error(data.error || '处理失败')
        
        await new Promise((r) => setTimeout(r,1000))
    }
}