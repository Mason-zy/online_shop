// 权限问题后期增加
import { get, post } from '/@/utils/http/axios';
import { UserState } from '/@/store/modules/user/types';
// import axios from 'axios';
enum URL {
    userWishList = '/api/thingWish/getUserWishList',
    wish = '/api/thingWish/wish',
    unWish = '/api/thingWish/unWish',
    updateQuantity = '/api/thingWish/updateQuantity',
    updateSelected = '/api/thingWish/updateSelected',
    updateBatchSelected = '/api/thingWish/updateBatchSelected',
}

const wishApi = async (data: any) => post<any>({ url: URL.wish, params: {}, data: data, headers: { 'Content-Type': 'multipart/form-data;charset=utf-8' } });
const unWishApi = async (params: any) => post<any>({ url: URL.unWish, params: params });
const userWishListApi = async (params: any) => get<any>({ url: URL.userWishList, params: params });
const updateQuantityApi = async (params: any) => post<any>({ url: URL.updateQuantity, params: params });
const updateSelectedApi = async (params: any) => post<any>({ url: URL.updateSelected, params: params });
const updateBatchSelectedApi = async (params: any) => post<any>({ url: URL.updateBatchSelected, params: params });

export { wishApi, unWishApi, userWishListApi, updateQuantityApi, updateSelectedApi, updateBatchSelectedApi };
