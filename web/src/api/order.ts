import {get, post} from '/@/utils/http/axios';

enum URL {
    list = '/api/order/list',
    create = '/api/order/create',
    update = '/api/order/update',
    delete = '/api/order/delete',
    cancel = '/api/order/cancelOrder',
    cancelUserOrder = '/api/order/cancelUserOrder',
    userOrderList = '/api/order/userOrderList',
    mockPay = '/api/order/mockPay',
}

const listApi = async (params: any) =>
    get<any>({url: URL.list, params: params, data: {}, headers: {}});
const userOrderListApi = async (params: any) =>
    get<any>({url: URL.userOrderList, params: params, data: {}, headers: {}});

const createApi = async (params: any) =>
    post<any>({url: URL.create, params: {}, data: params, headers: {}});
const updateApi = async (params: any) =>
    post<any>({url: URL.update, params: {}, data: params, headers: {}});
const deleteApi = async (params: any) =>
    post<any>({url: URL.delete, params: params, data: {}, headers: {}});

const cancelApi = async (params: any) =>
    post<any>({url: URL.cancel, params: params, data: {}, headers: {}});

const cancelUserOrderApi = async (params: any) =>
    post<any>({url: URL.cancelUserOrder, params: params, data: {}, headers: {}});

const mockPayApi = async (params: any) =>
    post<any>({url: URL.mockPay, params: params, data: {}, headers: {}});

export {listApi, userOrderListApi, createApi, updateApi, deleteApi, cancelApi, cancelUserOrderApi, mockPayApi};
