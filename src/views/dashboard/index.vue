<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="welcome-card">
          <h1>欢迎来到 AI 知识库</h1>
          <p>探索人工智能的无限可能</p>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="mt-4">
      <el-col :span="8" v-for="(category, index) in categories" :key="index">
        <el-card class="category-card" :body-style="{ padding: '0px' }">
          <img :src="category.image" class="category-image" />
          <div style="padding: 14px">
            <span>{{ category.title }}</span>
            <div class="bottom">
              <el-button text class="button" @click="navigateToCategory(category.path)">查看更多</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const categories = ref([
  {
    title: '机器学习',
    image: 'https://via.placeholder.com/300x200?text=Machine+Learning',
    path: '/machine-learning'
  },
  {
    title: '自然语言处理',
    image: 'https://via.placeholder.com/300x200?text=NLP',
    path: '/nlp'
  },
  {
    title: '计算机视觉',
    image: 'https://via.placeholder.com/300x200?text=Computer+Vision',
    path: '/computer-vision'
  }
])

const navigateToCategory = (path: string) => {
  router.push(path)
}
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.welcome-card {
  text-align: center;
  background-color: #f0f9ff;
}

.category-card {
  margin-bottom: 20px;
  transition: all 0.3s;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.category-image {
  width: 100%;
  display: block;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.mt-4 {
  margin-top: 1rem;
}
</style>
