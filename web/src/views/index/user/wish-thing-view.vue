<template>
  <div class="content-list">
    <div class="list-title">我的购物车</div>
    <div class="list-content">
      <div class="cart-view">
        <div class="cart-header flex-view">
          <a-checkbox v-model:checked="allSelected" @change="handleSelectAll">全选</a-checkbox>
          <span class="header-item">商品信息</span>
          <span class="header-item">单价</span>
          <span class="header-item">数量</span>
          <span class="header-item">小计</span>
          <span class="header-item">操作</span>
        </div>
        <div class="cart-list">
          <div class="cart-item flex-view" v-for="(item, index) in cartData" :key="index">
            <a-checkbox v-model:checked="item.selected" @change="handleSelect"></a-checkbox>
            <div class="item-info flex-view">
              <img :src="item.cover" @click="handleClickItem(item)">
              <div class="info-detail">
                <h3 class="item-name">{{item.title}}</h3>
                <p class="item-desc" v-if="item.author">{{item.author}}（作者)</p>
              </div>
            </div>
            <div class="item-price">¥{{item.price}}</div>
            <div class="item-quantity">
              <a-input-number 
                v-model:value="item.quantity" 
                :min="1" 
                :max="99"
                @change="(value) => handleQuantityChange(value, item)"
              />
            </div>
            <div class="item-subtotal">¥{{(item.price * item.quantity).toFixed(2)}}</div>
            <div class="item-actions">
              <a-button type="link" @click="handleRemove(item)">删除</a-button>
            </div>
          </div>
        </div>
        <div class="cart-footer flex-view">
          <div class="left-operations">
            <a-button type="link" @click="handleBatchRemove">删除选中商品</a-button>
          </div>
          <div class="right-summary flex-view">
            <div class="summary-item">
              已选择 <span class="highlight">{{selectedCount}}</span> 件商品
            </div>
            <div class="summary-item">
              合计: <span class="highlight">¥{{totalAmount.toFixed(2)}}</span>
            </div>
            <a-button type="primary" :disabled="selectedCount === 0" @click="handleCheckout">
              结算
            </a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { message } from 'ant-design-vue';
import { userWishListApi, unWishApi, updateQuantityApi, updateSelectedApi, updateBatchSelectedApi } from '/@/api/thingWish'
import { BASE_URL } from "/@/store/constants";
import { useUserStore } from "/@/store";
import { computed, ref } from 'vue';

const router = useRouter();
const userStore = useUserStore();

const cartData = ref([]);
const allSelected = ref(false);

// 计算属性
const selectedCount = computed(() => {
  return cartData.value.filter(item => item.selected).length;
});

const totalAmount = computed(() => {
  return cartData.value
    .filter(item => item.selected)
    .reduce((total, item) => total + item.price * item.quantity, 0);
});

onMounted(() => {
  getCartList();
});

const handleClickItem = (record) => {
  let text = router.resolve({name: 'detail', query: {id: record.id}});
  window.open(text.href, '_blank');
};

const handleRemove = (record) => {
  unWishApi({id: record.id}).then(res => {
    message.success('移除成功');
    getCartList();
  }).catch(err => {
    console.log(err);
  });
};

const handleBatchRemove = () => {
  const selectedItems = cartData.value.filter(item => item.selected);
  if (selectedItems.length === 0) {
    message.warning('请选择要删除的商品');
    return;
  }
  
  Promise.all(selectedItems.map(item => 
    unWishApi({id: item.id})
  )).then(() => {
    message.success('删除成功');
    getCartList();
  }).catch(err => {
    console.error(err);
    message.error('删除失败');
  });
};

const handleQuantityChange = (value, item) => {
  updateQuantityApi({
    id: item.id,
    quantity: value
  }).then(() => {
    item.quantity = value;
  }).catch(err => {
    console.error(err);
    message.error('更新数量失败');
  });
};

const handleSelectAll = (e) => {
  const checked = e.target.checked;
  const userId = userStore.user_id;
  updateBatchSelectedApi({
    userId: userId,
    selected: checked
  }).then(() => {
    cartData.value.forEach(item => item.selected = checked);
    allSelected.value = checked;
  }).catch(err => {
    console.error(err);
    message.error('更新选中状态失败');
  });
};

const handleSelect = (item) => {
  updateSelectedApi({
    id: item.id,
    selected: item.selected
  }).then(() => {
    allSelected.value = cartData.value.every(item => item.selected);
  }).catch(err => {
    console.error(err);
    message.error('更新选中状态失败');
  });
};

const handleCheckout = () => {
  const selectedItems = cartData.value.filter(item => item.selected);
  if (selectedItems.length === 0) {
    message.warning('请选择要结算的商品');
    return;
  }
  
  // 只处理第一个选中的商品
  const firstItem = selectedItems[0];
  
  // 打印调试信息
  console.log('Selected item for checkout:', firstItem);
  
  // 确保所有必需字段都存在
  if (!firstItem.thing_id) {
    message.error('商品ID无效');
    return;
  }
  
  router.push({
    name: 'confirm',
    query: {
      id: firstItem.thing_id,
      title: firstItem.title,
      cover: firstItem.cover.replace(BASE_URL + '/api/staticfiles/image/', ''),
      price: firstItem.price,
      quantity: firstItem.quantity || 1
    }
  });

  // 如果有多个商品，提示用户
  if (selectedItems.length > 1) {
    message.info('一次只能结算一个商品，请分次结算');
  }
};

const getCartList = () => {
  let userId = userStore.user_id;
  userWishListApi({userId: userId}).then(res => {
    cartData.value = res.data.map(item => ({
      ...item,
      cover: BASE_URL + '/api/staticfiles/image/' + item.cover,
      quantity: item.quantity || 1,
      selected: item.selected || false
    }));
    allSelected.value = cartData.value.length > 0 && cartData.value.every(item => item.selected);
  }).catch(err => {
    console.error(err.msg);
    message.error('获取购物车列表失败');
  });
};

</script>

<style scoped lang="less">
.flex-view {
  display: flex;
  align-items: center;
}

.content-list {
  flex: 1;

  .list-title {
    color: #152844;
    font-weight: 600;
    font-size: 18px;
    line-height: 24px;
    height: 24px;
    margin-bottom: 20px;
  }
}

.cart-view {
  background: #fff;
  border-radius: 8px;
  padding: 20px;

  .cart-header {
    padding: 15px 0;
    border-bottom: 1px solid #eee;
    
    .header-item {
      flex: 1;
      text-align: center;
      color: #666;
      
      &:first-child {
        flex: 2;
      }
    }
  }

  .cart-item {
    padding: 20px 0;
    border-bottom: 1px solid #eee;

    .item-info {
      flex: 2;
      margin-left: 20px;

      img {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 4px;
        cursor: pointer;
      }

      .info-detail {
        margin-left: 15px;

        .item-name {
          font-size: 14px;
          color: #333;
          margin-bottom: 8px;
        }

        .item-desc {
          font-size: 12px;
          color: #999;
        }
      }
    }

    .item-price,
    .item-quantity,
    .item-subtotal,
    .item-actions {
      flex: 1;
      text-align: center;
    }

    .item-price {
      color: #ff6b00;
    }

    .item-subtotal {
      color: #ff6b00;
      font-weight: bold;
    }
  }

  .cart-footer {
    margin-top: 20px;
    justify-content: space-between;

    .right-summary {
      .summary-item {
        margin-right: 20px;

        .highlight {
          color: #ff6b00;
          font-weight: bold;
        }
      }

      .ant-btn-primary {
        margin-left: 20px;
        min-width: 120px;
      }
    }
  }
}
</style>
