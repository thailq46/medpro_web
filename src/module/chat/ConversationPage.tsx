"use client";
import apiAuthRequest from "@/apiRequest/ApiAuth";
import apiConversation, {
  IConversationBody,
  IGetUserChatWithMeBody,
} from "@/apiRequest/ApiConversation";
import {AppContext} from "@/app/(home)/AppProvider";
import {CirclePlusIcon, SpinnerIcon} from "@/components/Icon";
import {QUERY_KEY} from "@/hooks/QUERY_KEY";
import socket from "@/lib/socket";
import {
  IOnlineUsers,
  checkUserOnline,
  renderUserStatus,
  scrollToBottom,
} from "@/module/chat/helper";
import {ImageIcon, PaperPlaneIcon, VideoIcon} from "@radix-ui/react-icons";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import clsx from "clsx";
import dayjs from "dayjs";
import Image from "next/image";
import {
  FormEvent,
  UIEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./Chat.module.scss";

interface IConversationProps {
  userSelected: IGetUserChatWithMeBody;
  onlineUsers: IOnlineUsers[];
  messages: IConversationBody[];
  setMessages: (
    value:
      | IConversationBody[]
      | ((prev: IConversationBody[]) => IConversationBody[])
  ) => void;
}

export default function ConversationPage({
  userSelected,
  onlineUsers,
  messages,
  setMessages,
}: IConversationProps) {
  const {user} = useContext(AppContext);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isTextareaScrolled, setIsTextareaScrolled] = useState<boolean>(false);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  const [openImageVideoUpload, setOpenImageVideoUpload] =
    useState<boolean>(false);
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    const adjustTextareaHeight = () => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
        setIsTextareaScrolled(textarea.scrollHeight >= 53);
      }
    };
    if (textareaRef.current) {
      textareaRef.current.addEventListener("input", adjustTextareaHeight);
    }
    return () => {
      if (textareaRef.current) {
        textareaRef.current.removeEventListener("input", adjustTextareaHeight);
      }
    };
  }, []);

  const {data: userByUsername} = useQuery({
    queryKey: [QUERY_KEY.GET_USER_BY_USERNAME, userSelected?.username],
    queryFn: () =>
      apiAuthRequest.getUserByUsername(userSelected?.username as string),
    enabled: !!userSelected?.username,
  });

  const {
    data: conversations,
    status,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [
      QUERY_KEY.GET_CONVERSATION_BY_RECEIVER_ID,
      {receiver_id: userByUsername?.payload?.data?._id as string},
    ],
    queryFn: ({pageParam}) => {
      return apiConversation.getByReceiverId({
        receiver_id: userByUsername?.payload?.data?._id as string,
        params: {limit: 10, page: pageParam},
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (
        lastPage.payload.meta.total_page === lastPage.payload.meta.current_page
      ) {
        return undefined;
      }
      return (lastPage.payload.meta.current_page as number) + 1;
    },
    enabled: !!userByUsername?.payload?.data?._id,
  });

  useEffect(() => {
    if (!user || !user._id) return;

    socket.on("receive_message", (data: any) => {
      console.log(data);
      const {payload} = data;
      setMessages((message) => [...message, payload]);
      scrollToBottom(chatContainerRef);
    });

    socket.on("connect_error", (err: any) => {
      console.log(err.data);
    });

    socket.on("disconnect", (reason) => {
      console.log(reason);
    });

    return () => {
      socket.disconnect();
    };
  }, [setMessages, user]);

  useEffect(() => {
    if (!conversations) return;
    const newConversations = conversations.pages
      ?.map((conversation) => {
        return conversation.payload.data;
      })
      .flat();
    setMessages((prevConversations) => {
      const mergedConversations = [
        ...prevConversations,
        ...newConversations,
      ].reverse();
      const uniqueConversations = Array.from(
        new Map(mergedConversations.map((msg) => [msg._id, msg])).values()
      );
      return uniqueConversations;
    });
    if (isFirstLoad && chatContainerRef) {
      scrollToBottom(chatContainerRef);
      setIsFirstLoad(false);
    }
  }, [conversations, isFirstLoad, setMessages]);

  const handleUploadImageVideoOpen = () => {
    setOpenImageVideoUpload((preve) => !preve);
  };

  const send = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const conversation = {
      content: value,
      sender_id: user?._id,
      receiver_id: userByUsername?.payload?.data?._id,
    };
    socket.emit("send_message", {
      payload: conversation,
    });
    setValue("");
    setMessages((message) => [
      ...message,
      {
        ...conversation,
        _id: new Date().getTime().toString(),
      },
    ]);
    scrollToBottom(chatContainerRef);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      setIsTextareaScrolled(false);
    }
  };

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const element = e.target as HTMLDivElement;
    if (element.scrollTop === 0 && hasNextPage) {
      fetchNextPage();
      setTimeout(() => {
        chatContainerRef.current?.scrollTo({top: 1, behavior: "smooth"});
      }, 0);
    }
  };

  return (
    <div className={styles.main}>
      <nav className={styles.nav}>
        <div className={styles.navAvatar}>
          <Image
            src={userSelected?.avatar || "/img/avatar/avatar.jpg"}
            alt="avatar"
            width={150}
            height={150}
          />
          {checkUserOnline({
            onlineUsers,
            user_id: userSelected?._id as string,
          }) && (
            <div className={styles.circle}>
              <div className={styles.online}></div>
            </div>
          )}
        </div>
        <div>
          <h3 className={styles.name}>{userSelected?.name}</h3>
          <p className={styles.msg}>
            {renderUserStatus({
              onlineUsers,
              user_id: userSelected?._id as string,
            })}
          </p>
        </div>
      </nav>
      <div
        className={styles.messageDisplay}
        onScroll={handleScroll}
        ref={chatContainerRef}
      >
        {status === "pending" ? (
          <p>Loading....</p>
        ) : status === "error" ? (
          <p>Error: {error.message}</p>
        ) : (
          <>
            {isFetchingNextPage && (
              <div className="flex items-center justify-center">
                <SpinnerIcon className="w-5 h-5 animate-spin" />
              </div>
            )}
            <div className="flex flex-col gap-2 py-2 mx-2">
              {messages.map((conversation) => (
                <div
                  className={clsx(
                    "p-1 py-1 rounded w-fit max-w-[380px] md:max-w-sm lg:max-w-md",
                    user?._id === conversation?.sender_id
                      ? "ml-auto bg-teal-100"
                      : "bg-white"
                  )}
                  key={conversation._id}
                >
                  {/* <div className="w-full relative">
                {true && (
                  <img
                    src={userSelected?.avatar}
                    className="w-full h-full object-scale-down"
                  />
                )}
              </div> */}
                  <p className="px-2">{conversation.content}</p>
                  <p className="text-xs ml-auto w-fit">
                    {dayjs(conversation.created_at).format("hh:mm")}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <div className={styles.footer}>
        <div className="flex items-center justify-between gap-5">
          <div className="flex items-center">
            <div className="relative ">
              <button
                onClick={handleUploadImageVideoOpen}
                className="flex justify-center items-center w-11 h-11 rounded-full"
              >
                <CirclePlusIcon className="w-6 h-6" />
              </button>

              {/**video and image */}
              {openImageVideoUpload && (
                <div className="bg-white shadow rounded absolute bottom-14 w-36 p-2">
                  <form>
                    <label
                      htmlFor="uploadImage"
                      className="flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer"
                    >
                      <div className="text-primary">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                      <p>Image</p>
                    </label>
                    <label
                      htmlFor="uploadVideo"
                      className="flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer"
                    >
                      <div className="text-purple-500">
                        <VideoIcon className="w-5 h-5" />
                      </div>
                      <p>Video</p>
                    </label>
                    <input
                      type="file"
                      id="uploadImage"
                      onChange={() => console.log(123)}
                      className="hidden"
                    />

                    <input
                      type="file"
                      id="uploadVideo"
                      onChange={() => console.log(123)}
                      className="hidden"
                    />
                  </form>
                </div>
              )}
            </div>
          </div>
          <form onSubmit={send} className="w-full flex items-center">
            <div className={styles.inputMsg}>
              <div className="flex flex-1 w-full">
                <textarea
                  ref={textareaRef}
                  placeholder="Aa"
                  dir="auto"
                  rows={1}
                  className={styles.messageBox}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
              <CirclePlusIcon
                className={clsx("w-6 h-6", isTextareaScrolled && "self-end")}
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center mr-3 p-2 cursor-pointer"
            >
              <PaperPlaneIcon className="w-5 h-5 text-textSecondary" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
