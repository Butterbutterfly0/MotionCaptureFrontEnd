<script setup lang="ts">
import {ref, onBeforeUnmount} from 'vue'

const uploading = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)
const file = ref<File | null>(null)
const videoUrl = ref('')


const tabs = [
  {name: 'a', label: 'upload'},
  {name: 'b', label: 'local_video'},
  {name: 'c', label: 'video1'},
  {name: 'd', label: 'video2'}
]

function pick() {
  if(uploading.value) return
  inputRef.value?.click()
}

function onChange(e:Event) {
  const input = e.target as HTMLInputElement
  const f = input.files?.[0]
  if (!f) return
  input.value = ''

  if (videoUrl.value) URL.revokeObjectURL(videoUrl.value)

  file.value = f
  videoUrl.value = URL.createObjectURL(f)
}

function reset() {
  if (videoUrl.value) URL.revokeObjectURL(videoUrl.value)
  file.value = null
  videoUrl.value = ''
}

</script>

<template>
  <header class="head">
    <h1>WHAM-Based Simple Monocular Vision Motion Capture System</h1>
  </header>
  <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.name"
        :class="{active:activeName === tab.name}"
        class="tab">
          {{ tab.label}}
      </button>
  </div>
  <div class="page">
    
    <div 
      v-if="!file"
      class="dropzone"
      @click="pick">
        <div class="icon">📤</div>
        <p>点击选择，或把视频拖到这里</p>
        
    </div>
    <div
      v-else
      class = "player"
      >
        <video :src="videoUrl" controls playsinline preload="metadata"></video>
        <p>已选择:{{ file.name}}</p>
        <button class="reselect" @click="reset">重新选择</button>
    </div>
    <input ref="inputRef" type="file" accept="video/*" hidden @change="onChange"/>
  </div>
</template>

<style scoped>
:global(body) {
  margin: 0;
  padding: 0;
}

.page {
  max-width: 640px;
  margin: 40px auto;
  padding: 0 20px 48px;
  font-family: system-ui, -apple-system,'PingFang SC', sans-serif;
  color: #2c3e50;
  
}

.head {
  text-align: center;
  /* marigin-bottom: 24px; */
  background: linear-gradient(90deg, #8442E8, #6A5AE0, #00C6FF);
  position: sticky;
  top:0;
  display:flex;
  
}

.head h1 {
  color: #ffffff;
  font-family:ui-rounded;
}

.tabs {
  display:flex;
  width:100%;
}

.tab {
  flex:1 1 0;
  cursor: pointer;
  height:40px;
  border:0;
}

.tab:hover {
  color: #1677ff;
  background: #f5f9ff;
}

.tab.active {
  color: #1677ff;
  font-weight: 600;
  border-bottom: 2px solid #1677ff;
}

.dropzone {
  aspect-ratio: 16 / 9;
  border: 2px dashed #cfd8dc;
  border-radius: 12px;
  display: flex;
  background: #fafbfc;
  cursor: pointer;
  text-align: center;
  align-items: center;
  justify-content:center;
}

.dropzone p {
  margin: 0;
  font-size: 14px;
  color:#555;
}

.reselect {
  color: #e74c3c;
  cursor: pointer;
}

.player video {
  width: 100%;
  height: auto;
  display: block;
  aspect-ratio: 16 / 9;
}

</style>

