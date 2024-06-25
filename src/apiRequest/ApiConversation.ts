import {CommonParams, ICommonAuditable, IMetaData} from "@/apiRequest/common";
import http from "@/apiRequest/http";

export interface IConversationBody extends ICommonAuditable {
  _id?: string;
  sender_id?: string;
  receiver_id?: string;
  content?: string;
}

export interface IGetUserChatWithMeBody extends ICommonAuditable {
  _id?: string;
  name?: string;
  email?: string;
  date_of_birth?: string;
  gender?: number;
  verify?: number;
  address?: string;
  username?: string;
  avatar?: string;
  role?: number;
  phone_number?: string;
  position?: number;
}
interface IParamsConversation {
  limit?: number;
  page?: number;
}
interface GetConversationRes {
  message: string;
  data: IConversationBody[];
  meta: IMetaData;
}
interface IGetConversationChatWithMeRes {
  message: string;
  data: IGetUserChatWithMeBody[];
}
const path = {
  getByReceiverId: "/conversations/receivers",
  getConversationsChatWithMe: "/conversations/me",
};

const apiConversation = {
  getByReceiverId: ({
    receiver_id,
    params,
  }: {
    receiver_id: string;
    params: IParamsConversation;
  }) =>
    http.get<GetConversationRes>(`${path.getByReceiverId}/${receiver_id}`, {
      params: params as CommonParams<IParamsConversation>,
    }),

  getConversationsChatWithMe: () =>
    http.get<IGetConversationChatWithMeRes>(path.getConversationsChatWithMe),
};

export default apiConversation;
