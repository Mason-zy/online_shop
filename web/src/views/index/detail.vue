<template>
  <div class="detail">
    <Header/>
    <div class="detail-content">
      <div class="thing-infos-view">
        <div class="thing-infos">
          <!-- 商品图片 -->
          <div class="thing-img">
            <img :src="detailData.cover" alt="商品图片">
          </div>
          <!-- 商品信息 -->
          <div class="thing-info">
            <h1 class="title">{{ detailData.title }}</h1>
            <div class="price">¥{{ detailData.price }}</div>
            <div class="description">{{ detailData.description }}</div>
            <div class="actions">
              <button class="order-btn" @click="handleOrder(detailData)">立即购买</button>
              <button class="cart-btn" @click="addToCart">
                <img :src="CartIcon" alt="购物车">
                <span>加入购物车</span>
              </button>
              <button class="collect-btn" @click="collect">
                <img :src="RecommendIcon" alt="收藏">
                <span>收藏</span>
              </button>
              <button class="share-btn" @click="share">
                <img :src="ShareIcon" alt="分享">
                <span>分享</span>
              </button>
              <button class="service-btn" @click="showService">
                <img :src="ServiceIcon" alt="客服">
                <span>客服</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 客服对话框 -->
      <a-modal
        v-model:visible="serviceVisible"
        title="智能客服"
        :footer="null"
        width="800px"
        style="top: 20px"
        @cancel="closeService"
      >
        <iframe
          :src="serviceUrl"
          style="width: 100%; height: 600px;"
          frameborder="0"
          allow="microphone"
        ></iframe>
      </a-modal>
      
      <!-- 商品详情和评论 -->
      <div class="detail-tabs">
        <div class="tab-header">
          <div 
            v-for="(tab, index) in tabData" 
            :key="index"
            :class="['tab-item', selectTabIndex === index ? 'active' : '']"
            @click="selectTab(index)"
          >
            {{ tab }}
          </div>
          <div class="tab-under" :style="{left: tabUnderLeft + 'px'}"></div>
        </div>
        
        <div class="tab-content">
          <!-- 简介 -->
          <div v-show="selectTabIndex === 0" class="intro-content">
            <div class="description">{{ detailData.description }}</div>
          </div>
          
          <!-- 评论 -->
          <div v-show="selectTabIndex === 1" class="comment-content">
            <div class="comment-sort">
              <span 
                :class="['sort-item', sortIndex === 0 ? 'active' : '']"
                @click="sortCommentList('recent')"
              >最新</span>
              <span 
                :class="['sort-item', sortIndex === 1 ? 'active' : '']"
                @click="sortCommentList('hot')"
              >最热</span>
            </div>
            
            <!-- 评论列表 -->
            <div class="comment-list">
              <div v-for="item in commentData" :key="item.id" class="comment-item">
                <div class="comment-user">
                  <img :src="item.avatar || AvatarIcon" alt="头像" class="avatar">
                  <span class="username">{{ item.username }}</span>
                  <span class="time">{{ item.commentTime }}</span>
                </div>
                <div class="comment-content">{{ item.content }}</div>
                <div class="comment-actions">
                  <span class="like" @click="like(item.id)">
                    <img :src="RecommendIcon" alt="点赞">
                    <span>{{ item.likeCount || 0 }}</span>
                  </span>
                </div>
              </div>
            </div>
            
            <!-- 发表评论 -->
            <div class="comment-input">
              <textarea 
                ref="commentRef"
                placeholder="写下你的评论..."
                @keyup.enter="sendComment"
              ></textarea>
              <button @click="sendComment">发表评论</button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 推荐商品 -->
      <div class="recommend-section">
        <h2>相关推荐</h2>
        <div class="recommend-list">
          <div 
            v-for="item in recommendData" 
            :key="item.id" 
            class="recommend-item"
            @click="handleDetail(item)"
          >
            <img :src="item.cover" alt="商品图片">
            <div class="item-info">
              <div class="title">{{ item.title }}</div>
              <div class="price">¥{{ item.price }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
  </div>
</template>
<script setup>
import {message} from "ant-design-vue";
import Header from '/@/views/index/components/header.vue'
import Footer from '/@/views/index/components/footer.vue'
import AddIcon from '/@/assets/images/add.svg';
import CartIcon from '/@/assets/images/cart-icon.svg';
import RecommendIcon from '/@/assets/images/recommend-hover.svg';
import ShareIcon from '/@/assets/images/share-icon.svg';
import WeiboShareIcon from '/@/assets/images/wb-share.svg';
import AvatarIcon from '/@/assets/images/avatar.jpg';
import ServiceIcon from '/@/assets/images/service-icon.svg';
import {
  detailApi,
  listApi as listThingList,
} from '/@/api/thing'
import {listThingCommentsApi, createApi as createCommentApi, likeApi} from '/@/api/comment'
import {wishApi} from '/@/api/thingWish'
import {collectApi} from '/@/api/thingCollect'
import {BASE_URL} from "/@/store/constants";
import {useRoute, useRouter} from "vue-router/dist/vue-router";
import {useUserStore} from "/@/store";
import {getFormatTime} from "/@/utils";

const router = useRouter()
const route = useRoute()
const userStore = useUserStore();


let thingId = ref('')
let detailData = ref({})
let tabUnderLeft = ref(6)
let tabData = ref(['简介', '评论'])
let selectTabIndex = ref(0)

let commentData = ref([])
let recommendData = ref([])
let sortIndex = ref(0)
let order = ref('recent') // 默认排序最新

let commentRef = ref()

let serviceVisible = ref(false)
let serviceUrl = ref('')

onMounted(()=>{
  thingId.value = route.query.id.trim()
  getThingDetail()
  getRecommendThing()
  getCommentList()
})

const selectTab =(index)=> {
  selectTabIndex.value = index
  tabUnderLeft.value = 6 + 54 * index
}

const getThingDetail =()=> {
  detailApi({id: thingId.value}).then(res => {
    detailData.value = res.data
    detailData.value.cover = BASE_URL + '/api/staticfiles/image/' + detailData.value.cover
  }).catch(err => {
    message.error('获取详情失败')
  })
}
const addToCart =()=> {
  let userId = userStore.user_id
  if (userId) {
    wishApi({
      thingId: thingId.value, 
      userId: userId,
      quantity: 1 // 默认数量为1
    }).then(res => {
      message.success('成功加入购物车');
      getThingDetail()
    }).catch(err => {
      console.log('操作失败')
    })
  } else {
    message.warn('请先登录')
  }
}
const collect =()=> {
  let userId = userStore.user_id
  if (userId) {
    collectApi({thingId: thingId.value, userId: userId}).then(res => {
      message.success(res.msg)
      getThingDetail()
    }).catch(err => {
      console.log('收藏失败')
    })
  } else {
    message.warn('请先登录')
  }
}
const share =()=> {
  let content = '分享一个非常好玩的网站 ' + window.location.href
  let shareHref = 'http://service.weibo.com/share/share.php?title=' + content
  window.open(shareHref)
}
const handleOrder =(detailData)=> {
  console.log(detailData)
  const userId = userStore.user_id
  router.push({name: 'confirm',
    query:
        {
          id: detailData.id,
          title: detailData.title,
          cover: detailData.cover,
          price: detailData.price
        }})
}
const getRecommendThing =()=> {
  listThingList({sort: 'recommend'}).then(res => {
    res.data.forEach((item, index) => {
      if (item.cover) {
        item.cover = BASE_URL + '/api/staticfiles/image/' + item.cover
      }
    })
    console.log(res)
    recommendData.value = res.data.slice(0, 6)
  }).catch(err => {
    console.log(err)
  })
}
const handleDetail =(item)=> {
  // 跳转新页面
  let text = router.resolve({name: 'detail', query: {id: item.id}})
  window.open(text.href, '_blank')
}
const sendComment =()=> {
  console.log(commentRef.value)
  let text = commentRef.value.value.trim()
  console.log(text)
  if (text.length <= 0) {
    return
  }
  commentRef.value.value = ''
  let userId = userStore.user_id
  if (userId) {
    createCommentApi({content: text, thingId: thingId.value, userId: userId}).then(res => {
      getCommentList()
    }).catch(err => {
      console.log(err)
    })
  } else {
    message.warn('请先登录！')
    router.push({name: 'login'})
  }
}
const like =(commentId)=> {
  likeApi({id: commentId}).then(res => {
    getCommentList()
  }).catch(err => {
    console.log(err)
  })
}
const getCommentList =()=> {
  listThingCommentsApi({thingId: thingId.value, order: order.value}).then(res => {
    res.data.forEach(item => {
      item.commentTime = getFormatTime(item.commentTime, true)
    })
    commentData.value = res.data
  }).catch(err => {
    console.log(err)
  })
}
const sortCommentList =(sortType)=> {
  if (sortType === 'recent') {
    sortIndex.value = 0
  } else {
    sortIndex.value = 1
  }
  order.value = sortType
  getCommentList()
}

const showService = () => {
  // 生成新的URL，添加时间戳确保每次都是新会话
  serviceUrl.value = `https://udify.app/chatbot/rnYWjOfF06y1H4R8?t=${Date.now()}`
  serviceVisible.value = true
}

const closeService = () => {
  serviceVisible.value = false
  // 清空URL，确保下次打开时重新加载
  serviceUrl.value = ''
}

</script>
<style scoped lang="less">
.detail {
  min-height: 100vh;
  background: #f5f5f5;
}

.detail-content {
  width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.thing-infos-view {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
}

.thing-infos {
  display: flex;
  gap: 40px;
}

.thing-img {
  width: 400px;
  height: 400px;
  overflow: hidden;
  border-radius: 8px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.thing-info {
  flex: 1;
  
  .title {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 16px;
  }
  
  .price {
    font-size: 28px;
    color: #ff4d4f;
    font-weight: bold;
    margin-bottom: 16px;
  }
  
  .description {
    font-size: 14px;
    color: #666;
    line-height: 1.6;
    margin-bottom: 24px;
  }
  
  .actions {
    display: flex;
    gap: 16px;
    
    button {
      height: 40px;
      padding: 0 24px;
      border-radius: 20px;
      font-size: 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      border: none;
      transition: all 0.3s;
      
      img {
        width: 20px;
        height: 20px;
      }
    }
    
    .order-btn {
      background: #ff4d4f;
      color: #fff;
      
      &:hover {
        background: #ff7875;
      }
    }
    
    .cart-btn,
    .collect-btn,
    .share-btn {
      background: #f5f5f5;
      color: #666;
      
      &:hover {
        background: #e8e8e8;
      }
    }
  }
}

.detail-tabs {
  background: #fff;
  border-radius: 8px;
  margin-top: 20px;
  padding: 20px;
}

.tab-header {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
  
  .tab-item {
    padding: 12px 24px;
    font-size: 16px;
    color: #666;
    cursor: pointer;
    
    &.active {
      color: #ff4d4f;
    }
  }
  
  .tab-under {
    position: absolute;
    bottom: -1px;
    left: 6px;
    width: 48px;
    height: 2px;
    background: #ff4d4f;
    transition: all 0.3s;
  }
}

.tab-content {
  padding: 20px 0;
}

.intro-content {
  font-size: 14px;
  color: #666;
  line-height: 1.8;
}

.comment-content {
  .comment-sort {
    margin-bottom: 20px;
    
    .sort-item {
      margin-right: 20px;
      font-size: 14px;
      color: #666;
      cursor: pointer;
      
      &.active {
        color: #ff4d4f;
      }
    }
  }
}

.comment-list {
  .comment-item {
    padding: 20px 0;
    border-bottom: 1px solid #f0f0f0;
    
    .comment-user {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      
      .avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        margin-right: 12px;
      }
      
      .username {
        font-size: 14px;
        color: #333;
        margin-right: 12px;
      }
      
      .time {
        font-size: 12px;
        color: #999;
      }
    }
    
    .comment-content {
      font-size: 14px;
      color: #666;
      line-height: 1.6;
      margin-bottom: 12px;
    }
    
    .comment-actions {
      .like {
        display: flex;
        align-items: center;
        gap: 4px;
        cursor: pointer;
        
        img {
          width: 16px;
          height: 16px;
        }
        
        span {
          font-size: 12px;
          color: #999;
        }
      }
    }
  }
}

.comment-input {
  margin-top: 20px;
  
  textarea {
    width: 100%;
    height: 100px;
    padding: 12px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    resize: none;
    margin-bottom: 16px;
    
    &:focus {
      outline: none;
      border-color: #ff4d4f;
    }
  }
  
  button {
    height: 36px;
    padding: 0 24px;
    background: #ff4d4f;
    color: #fff;
    border: none;
    border-radius: 18px;
    cursor: pointer;
    
    &:hover {
      background: #ff7875;
    }
  }
}

.recommend-section {
  margin-top: 20px;
  
  h2 {
    font-size: 20px;
    color: #333;
    margin-bottom: 16px;
  }
}

.recommend-list {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
  
  .recommend-item {
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    img {
      width: 100%;
      height: 160px;
      object-fit: cover;
    }
    
    .item-info {
      padding: 12px;
      
      .title {
        font-size: 14px;
        color: #333;
        margin-bottom: 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .price {
        font-size: 16px;
        color: #ff4d4f;
        font-weight: bold;
      }
    }
  }
}

.service-btn {
  background: #4CAF50;  // 使用绿色来表示在线客服
  color: #fff;
  
  img {
    color: #fff;  // SVG图标会继承这个颜色
  }
  
  &:hover {
    background: #45a049;
    transform: translateY(-1px);
  }
}

.cart-btn {
  background: #4684e2;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  margin-right: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  img {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
  
  &:hover {
    background: #3b6fc7;
  }
}
</style>
