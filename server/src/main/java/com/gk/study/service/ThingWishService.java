package com.gk.study.service;


import com.gk.study.entity.ThingWish;

import java.util.List;
import java.util.Map;

public interface ThingWishService {
    List<Map> getThingWishList(String userId);
    void createThingWish(ThingWish thingWish);
    void deleteThingWish(String id);

    ThingWish getThingWish(String userId, String thingId);

    void updateQuantity(String id, Integer quantity);
    void updateSelected(String id, Boolean selected);
    void updateBatchSelected(String userId, Boolean selected);
}
