import {CommonParams, ICommonAuditable, IMetaData} from "@/apiRequest/common";
import http from "@/apiRequest/http";

export interface IConversationBody extends ICommonAuditable {
  _id?: string;
  sender_id?: string;
  receiver_id?: string;
  content?: string;
  imgUrl?: string;
}

export interface IConversationWithLastMessage {
  _id: string;
  avatar: string;
  name: string;
  username: string;
  lastMessage: IConversationBody;
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

const path = {
  getByReceiverId: "/api/conversations/receivers",
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
};

export default apiConversation;
