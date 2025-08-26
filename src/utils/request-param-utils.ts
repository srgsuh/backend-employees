import type EmployeeRequestParams from "../model/EmployeeRequestParams.ts";
import type { SplitOptions } from "../model/EmployeeRequestParams.ts";
import _ from "lodash";

export function splitOptions (eo: EmployeeRequestParams): SplitOptions{
    return {
        whereOptions: _.omit(eo, "order_by"),
        orderByOptions: _.pick(eo, "order_by")
    };
}