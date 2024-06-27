import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {RefObject} from "react";
dayjs.extend(relativeTime);

export interface IOnlineUsers {
  user_id: string;
  last_online: Date | null;
}

export const checkUserOnline = ({
  onlineUsers,
  user_id,
}: {
  onlineUsers: IOnlineUsers[];
  user_id: string;
}) => {
  if (!onlineUsers) return false;
  return onlineUsers.some(
    (user) => user.user_id === user_id && user.last_online === null
  );
};

export const renderUserStatus = ({
  onlineUsers,
  user_id,
}: {
  onlineUsers: IOnlineUsers[];
  user_id: string;
}) => {
  const user = onlineUsers.find((user) => user.user_id === user_id);
  if (user) {
    if (user.last_online) {
      const lastOnline = dayjs(user.last_online).fromNow();
      return `Last online: ${lastOnline}`;
    }
    return "Online";
  }
  return "Offline";
};

export const scrollToBottom = (ref: RefObject<HTMLDivElement>) => {
  setTimeout(() => {
    if (ref.current) {
      ref.current.scrollTo({
        top: ref.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, 30);
};
