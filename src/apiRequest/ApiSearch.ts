import {IDoctorBody} from "@/apiRequest/ApiDoctor";
import {IHospitalBody} from "@/apiRequest/ApiHospital";
import {CommonParams} from "@/apiRequest/common";
import http from "@/apiRequest/http";

interface IParamsSearch {
  limit?: number;
  category?: string;
  search_key?: string;
}
interface IDoctorSearch extends IDoctorBody {
  type?: string;
}
interface IHospitalSearch
  extends Omit<IHospitalBody, "booking_forms" | "category"> {
  booking_forms?: string[];
  categoryId?: string;
}
interface ISearchResponse {
  message?: string;
  data: {
    category?: string;
    categoryName?: string;
    search_key?: string;
    doctor?: IDoctorSearch[];
    hospital?: IHospitalSearch[];
  };
}
const path = {
  search: "/search",
};

const apiSearch = {
  search: (params: IParamsSearch) =>
    http.get<ISearchResponse>(path.search, {
      params: params as CommonParams<IParamsSearch>,
    }),
};
export default apiSearch;
