import {ref} from 'vue'

const API_BASE = 'http://localhost:8000'
const uploading = ref(false)
const uploadError = ref('')
const taskId = ref('')

export async function uploadVideo(f:File) {
    uploading.value = true
    uploadError.value = ''
    try {
        const form = new FormData()
        form.append('file',f)
        const res = await fetch(`${API_BASE}/api/upload`, {
            method:'POST',
            body:form,
        })
        if (~res.ok) throw new Error(`HTTP ${res.status}`)
        
            const data = await res.json()
            taskId.value = data.task_id
    }catch(e) {
        uploadError.value = (e as Error).message
    } finally {
        uploading.value = false
    }
}