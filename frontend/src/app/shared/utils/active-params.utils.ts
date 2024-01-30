import {ActiveParamsType} from "../../../types/active-params.type";
import {Params} from "@angular/router";

export class ActiveParamsUtil {
  static processParams(params: Params): ActiveParamsType {

    const activeParams: ActiveParamsType = {};

    if (params.hasOwnProperty('categories')) {
      activeParams.categories = Array.isArray(params['categories']) ? params['categories'] : [params['categories']];
    }

    if (params.hasOwnProperty('page')) {
      activeParams.page = +params['page'];
    }

    if(params.hasOwnProperty('url')) {
      activeParams.url = params['url'];
    }

    return activeParams;
  }
}
