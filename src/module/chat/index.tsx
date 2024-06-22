"use client";
import apiAuthRequest from "@/apiRequest/ApiAuth";
import apiConversation, {IConversationBody} from "@/apiRequest/ApiConversation";
import {AppContext} from "@/app/(home)/AppProvider";
import {SpinnerIcon} from "@/components/Icon";
import {QUERY_KEY} from "@/hooks/QUERY_KEY";
import socket from "@/lib/socket";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {
  FormEvent,
  UIEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const username = ["user666998f28d477b9b06aec7a5", "lqthai123"];

export default function ChatPage() {
  const {user} = useContext(AppContext);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<IConversationBody[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 30);
  };

  const {data: userByUsername} = useQuery({
    queryKey: [QUERY_KEY.GET_USER_BY_USERNAME, userName],
    queryFn: () => apiAuthRequest.getUserByUsername(userName),
    enabled: !!userName,
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
    if (!conversations) return;
    const newMessages = conversations.pages
      ?.map((page) => {
        return page.payload.data;
      })
      .flat();
    setMessages((prevMessages) => {
      const mergedMessages = [...prevMessages, ...newMessages].reverse();
      const uniqueMessages = Array.from(
        new Map(mergedMessages.map((msg) => [msg._id, msg])).values()
      );
      return uniqueMessages;
    });

    if (isFirstLoad && chatContainerRef) {
      scrollToBottom();
      setIsFirstLoad(false);
    }
  }, [conversations, isFirstLoad]);

  useEffect(() => {
    if (!user || !user._id) return;
    socket.auth = {_id: user._id};
    socket.connect();
    socket.on("receive_message", (data: any) => {
      console.log(data);
      const {payload} = data;
      setMessages((message) => [...message, payload]);
      scrollToBottom();
    });
    return () => {
      socket.disconnect();
    };
  }, []);

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
    scrollToBottom();
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
    <div className="p-52">
      <h1 className="font-bold text-xl">Hello, I&apos;m {user?.name}</h1>
      <div className="my-2">
        {username.map((username) => (
          <button
            key={username}
            onClick={() => setUserName(username)}
            className="border border-blue-400 mb-4 p-1 rounded-xl"
          >
            Chat with {username}
          </button>
        ))}
      </div>
      <h2>Chat App</h2>
      <div
        className="bg-white p-2 mb-3 w-[400px] max-h-[200px] overflow-y-scroll"
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
            {messages.map((conversation) => (
              <div key={conversation?._id}>
                <div className="flex">
                  <div
                    className={`bg-blue-400 max-w-[200px] mb-1 p-1 mt-auto ${
                      user?._id === conversation?.sender_id ? "ml-auto" : ""
                    }`}
                  >
                    <p>{conversation.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      <form onSubmit={send}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
