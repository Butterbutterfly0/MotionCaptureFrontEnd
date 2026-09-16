<script setup lang="ts">
import {ref, onBeforeUnmount} from 'vue'
import { uploadVideo,uploading, waitForTask, resultUrl,waitForAnimeTask,animeresultUrl } from '@/api/upload'


const inputRef = ref<HTMLInputElement | null>(null)
const file = ref<File | null>(null)
const videoUrl = ref('')
const activeName = ref('a')

const processing =ref(false)
const taskId = ref('')
const progress = ref(0)
const resultVideoUrl = ref('')

const animeProgress = ref(0)
const animeResultVideoUrl = ref('')

type Tab = 'Upload'|'LocalVideo'|'Processed'|'Animated';


const tabs = [
  {name: 'a', label: 'Upload'},
  {name: 'b', label: 'Localvideo'},
  {name: 'c', label: 'Processed'},
  {name: 'd', label: 'Animated'}
]

function pick() {
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
  activeName.value = 'b'

  // uploadVideo(f)
}

function reset() {
  if (videoUrl.value) URL.revokeObjectURL(videoUrl.value)
  file.value = null
  videoUrl.value = ''
  resultVideoUrl.value = ''
}

async function onupload(){
  if (!videoUrl.value) return
  processing.value = true
  try {
     taskId.value = await uploadVideo(file.value)
     await waitForTask(taskId.value,(p)=>(progress.value = p))
     resultVideoUrl.value = resultUrl(taskId.value)
     activeName.value = 'c'
    await waitForAnimeTask(taskId.value,(p)=>(animeProgress.value = p))
    animeResultVideoUrl.value = animeresultUrl(taskId.value)
    alert('Anime Could be available')
  } catch(e) {

  }
  finally {
    processing.value = false
  }
 


}

function handleTab(tab:{name: string, label: string}){
  activeName.value = tab.name
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
        :class="[`tab-${tab.name}`,{active:activeName === tab.name}]"
        class="tab"
        @click="handleTab(tab)">
          {{ tab.label}}
      </button>
  </div>
  <div class="page">
    
    <div 
      v-if="activeName === 'a'"
      class="dropzone"
      @click="pick">
        <div class="icon">📤</div>
        <p>Click to select File,Or drop video here</p>
        
    </div>
    <div v-if="activeName ==='b'"
      class = "player">
        <div v-if="!file"
          class="nofile">
          <p>You need upload video to continue</p>
        </div>
        <div v-else>
          <div class="video-frame">
            <video :src="videoUrl" controls playsinline preload="metadata"></video>
          </div>
          <div class="localBtn">
            <!-- <p>已选择:{{ file.name}}</p> -->
            <button class="reselect" @click="reset">Reselect</button>
            <button class="upload" @click="onupload">Upload</button>
          </div>
        </div>
        <div v-if="uploading" class="progress">
          <div class="progress-bar" :style="{ width: progress + '%' }">
        </div>
      </div>
    </div>
    <div v-if="activeName === 'c'">
      <div v-if="!resultVideoUrl" class="nofile">
        <p>No processed video yet</p>
      </div>
      <div v-else>
        <div class="video-frame">
          <video :src="resultVideoUrl" controls playsinline preload="metadata"></video>
        </div>
      </div>
    </div>
    <div v-if="activeName === 'd'">
      <div v-if="!animeResultVideoUrl" class="nofile">
        <p>No processed video yet</p>
      </div>
      <div v-else>
        <div class="video-frame">
          <video :src="animeResultVideoUrl" controls playsinline preload="metadata"></video>
        </div>
      </div>
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
  max-width: 1080px;
  margin: 40px auto;
  padding: 0 20px 48px;
  font-family: system-ui, -apple-system,'PingFang SC', sans-serif;
  color: #2c3e50;
  
}

.head {
  display:flex;
  text-align: center;
  /* marigin-bottom: 24px; */
  background: linear-gradient(45deg, #4C1D95, #8B5CF6, #EC4899,#3B82F6);
  position: sticky;
  top:0;
  display:flex;
  justify-content:center;
  align-items: center;
  
}

.head h1 {
  color: #ffffff;
  font-family:ui-rounded;
  text-align:center;
  font-family: "Acme";

}

.tabs {
  display:flex;
  width:100%;
  background: #FAF5FF;
  border-bottom: 1px solid #E9D5FF;
  padding: 3px 6px 0; 
  gap: 3px;
}

.tab {
  flex:1 1 0;
  cursor: pointer;
  height:60px;
  border:0;
  font-size: 30px;
  border-radius: 8px 8px 0 0;
  font-family: "Advent Pro";
  font-weight: 600;
  color: #64748B;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: transparent;
  position: relative;
  overflow: hidden;
}

.tab-a:hover { background: linear-gradient(135deg, #2563EB, #3B82F6); color: #FFFFFF; }
.tab-b:hover { background: linear-gradient(135deg, #5B21B6, #8B5CF6); color: #FFFFFF; }
.tab-c:hover { background: linear-gradient(135deg, #9D174D, #EC4899); color: #FFFFFF; }
.tab-d:hover { background: linear-gradient(135deg, #3730A3, #6366F1); color: #FFFFFF; }

.tab-a {
  background: linear-gradient(135deg, #190033, #6A5AE0, #00C6FF);
  color: #ffffff;
}

.tab-b { 
  background: linear-gradient(135deg, #4C1D95, #7C3AED); 
  color: #EDE9FE; 
}
.tab-c { 
  background: linear-gradient(135deg, #831843, #DB2777); 
  color: #FCE7F3; 
}
.tab-d { 
  background: linear-gradient(135deg, #312E81, #4F46E5); 
  color: #E0E7FF; 
}

.tab.active {
  color: #FFFFFF;
  font-weight: 600;
  transform: translateY(-2px); /* 选中时微微上浮，突出层次 */
}

.tab-a.active { 
  background: #DBEAFE; 
  color: #1E3A8A; 
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.25), inset 0 -4px 0 #3B82F6; /* 下划线用内阴影实现 */
}
.tab-b.active { 
  background: #EDE9FE; 
  color: #4C1D95; 
  box-shadow: 0 6px 16px rgba(139, 92, 246, 0.25), inset 0 -4px 0 #8B5CF6;
}
.tab-c.active { 
  background: #FCE7F3; 
  color: #831843; 
  box-shadow: 0 6px 16px rgba(236, 72, 153, 0.25), inset 0 -4px 0 #EC4899;
}
.tab-d.active { 
  background: #E0E7FF; 
  color: #312E81; 
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.25), inset 0 -4px 0 #6366F1;
}

.tab:hover {
  color: #1677ff;
  background: #f5f9ff;
}



.dropzone {
  aspect-ratio: 16 / 9;
  border: 2px dashed #D8B4FE; /* 浅紫虚线 */
  background: #FDF4FF; /* 极浅粉紫背景 */
  border-radius: 12px;
  display: flex;
  cursor: pointer;
  text-align: center;
  align-items: center;
  justify-content:center;
  transition: all 0.3s ease;
}

.dropzone:hover {
  border-color: #8B5CF6; /* 悬停时虚线变深紫 */
  background: #F5F3FF;
}

.dropzone p {
  margin: 0;
  font-size: 28px;
  color:#555;
  font-family: 'Acme';
}

.nofile {
  aspect-ratio: 16 / 9;
  border: 2px dashed #D8B4FE; /* 浅紫虚线 */
  background: #FDF4FF; /* 极浅粉紫背景 */
  border-radius: 12px;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content:center;
  transition: all 0.3s ease;
}

.nofile p {
  margin: 0;
  font-size: 28px;
  color:#555;
  font-family: 'Acme';
}

.localBtn {
  display:flex;
}

.localBtn button {
  position: relative;    /* ← 加这一行 */
  overflow: hidden;      /* 可选，避免伪元素溢出圆角 */
  flex:1 1 0;     
  color: #ffffff;
  cursor: pointer;
  width:180px;
  height:80px;
  border: 0;   /* 关键：给边框留位 */
  border-radius: 12px;
  background:linear-gradient(135deg,  #EC4899, #3B82F6);
  font-size: 40px;
  font-family: 'Advent Pro';
  font-weight: 600;
  font-style: italic;
   transition: background 0.35s ease, color 0.35s ease,
              box-shadow 0.35s ease, transform 0.35s ease;
}

.localBtn button:hover {
  background:
  linear-gradient(#fff, #fff) padding-box,      /* 内层：实色填充 */
  linear-gradient(135deg, #EC4899, #3B82F6) border-box;      /* 外层：渐变边框 */
  color: #EC4899;
  box-shadow: 0 6px 18px rgba(236, 72, 153, 0.35);
  transform: translateY(-2px);
}

.localBtn button::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 12px;
  padding: 2px;                     /* 边框粗细 */
  background: linear-gradient(135deg, #EC4899, #3B82F6);
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.35s ease;
  pointer-events: none;
}

.localBtn button:hover::after {
  opacity: 1;
}


.localBtn .upload {
  background:linear-gradient(135deg, #3B82F6,  #EC4899);
}

.localBtn .upload:hover {
  background:
  linear-gradient(#fff, #fff) padding-box,      /* 内层：实色填充 */
  linear-gradient(135deg, #3B82F6, #EC4899) border-box;      /* 外层：渐变边框 */
  color: #3B82F6;
}

.player {
  text-align: center;
}

.video-frame {
  /* 渐变边框：外层渐变 + 内边距 */
  padding: 3px;                        /* 边框粗细 */
  border-radius: 16px;                 /* 外圆角 */
  background: linear-gradient(135deg, #4C1D95, #8B5CF6, #EC4899, #3B82F6);
  box-shadow: 
    0 10px 30px rgba(139, 92, 246, 0.25),   /* 紫色柔光 */
    0 4px 12px rgba(236, 72, 153, 0.15);     /* 粉色轻影 */
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.video-frame:hover {
  box-shadow: 
    0 14px 40px rgba(139, 92, 246, 0.4),
    0 6px 18px rgba(236, 72, 153, 0.25);
  transform: translateY(-2px);         /* 悬停微微上浮 */
}

.video-frame video {
  width: 100%;
  height: auto;
  display: block;
  aspect-ratio: 16 / 9;
  border-radius: 25px;                 /* 内圆角 = 外圆角 - padding */
  margin:2px;
  background: #000;                    /* 视频未加载时的底色 */
}

.progress {
  margin: 12px auto 0;
  width: 60%;
  height: 10px;
  background: #EDE9FE;              /* 浅紫底 */
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  width: 0;
  background: linear-gradient(135deg, #EC4899, #3B82F6);
  border-radius: 999px;
  transition: width 0.25s ease;
}

</style>

