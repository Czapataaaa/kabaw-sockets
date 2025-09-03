import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Send } from "lucide-react";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { ScrollArea } from "@/components/atoms/scroll-area";
import { Avatar, AvatarFallback } from "@/components/atoms/avatar";

const ChatMessages = () => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.message);
  const username = useSelector((state) => state.user.username);
  const connected = useSelector((state) => state.connection.connected);

  const [currentMessage, setCurrentMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message to server via WebSocket
  const sendMessage = () => {
    if (currentMessage.trim() && connected) {
      dispatch({
        type: "chat/sendMessage",
        payload: { type: "message", content: currentMessage },
      });
      setCurrentMessage("");
    }
  };

  // Listen for send-chat-message event in middleware
  useEffect(() => {
    // Remove custom event listener logic
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    if (diff < 1000 * 60) return "just now";
    if (diff < 1000 * 60 * 60) return `${Math.floor(diff / (1000 * 60))}m ago`;
    if (diff < 1000 * 60 * 60 * 24)
      return `${Math.floor(diff / (1000 * 60 * 60))}h ago`;
    return date.toLocaleDateString();
  };

  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const getAvatarColor = (name) => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
    ];
    return colors[name.charCodeAt(0) % colors.length];
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full max-h-[500px] p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message, index) => {
              const showAvatar =
                index === 0 ||
                messages[index - 1].username !== message.username;
              const isConsecutive =
                index > 0 && messages[index - 1].username === message.username;

              if (
                message.type === "system" ||
                message.type === "user_connected"
              ) {
                return (
                  <div
                    key={message.timestamp + message.content}
                    className="flex justify-center group -mx-2 px-2 py-1 rounded mt-4"
                  >
                    <div className="bg-yellow-100 dark:bg-yellow-900 px-3 py-2 rounded-lg text-sm leading-relaxed break-words text-center font-italic w-full">
                      {message.content}
                    </div>
                  </div>
                );
              }

              const isCurrentUser = message.username === username;

              if (isCurrentUser) {
                // Current user messages - right aligned
                return (
                  <div
                    key={message.timestamp + message.content}
                    className={`flex justify-end group -mx-2 px-2 py-1 rounded ${
                      isConsecutive ? "mt-1" : "mt-4"
                    }`}
                  >
                    <div className="max-w-[70%] min-w-0">
                      {showAvatar && (
                        <div className="flex items-center justify-end gap-2 mb-1">
                          <span className="text-xs text-muted-foreground">
                            {formatTime(message.timestamp)}
                          </span>
                          <span className="font-semibold text-sm">
                            {message.username}
                          </span>
                        </div>
                      )}
                      <div className="bg-primary text-primary-foreground px-3 py-2 rounded-lg text-sm leading-relaxed break-words">
                        {message.content}
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-3">
                      {showAvatar ? (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {getInitials(message.username)}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="w-8 h-8 flex items-center justify-center">
                          <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                            {formatTime(message.timestamp).split(" ")[0]}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              } else {
                // Other users' messages - left aligned
                return (
                  <div
                    key={message.timestamp + message.content}
                    className={`flex gap-3 group hover:bg-muted/30 -mx-2 px-2 py-1 rounded ${
                      isConsecutive ? "mt-1" : "mt-4"
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {showAvatar ? (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback
                            className={`text-white text-xs ${getAvatarColor(
                              message.username
                            )}`}
                          >
                            {getInitials(message.username)}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="w-8 h-8 flex items-center justify-center">
                          <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                            {formatTime(message.timestamp).split(" ")[0]}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 max-w-[70%]">
                      {showAvatar && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">
                            {message.username}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                      )}
                      <div className="bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded-lg text-sm text-foreground leading-relaxed break-words inline-block">
                        {message.content}
                      </div>
                    </div>
                  </div>
                );
              }
            })}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>
      {/* Message Input */}
      <div className="border-t bg-background p-4">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <Input
              placeholder="Type a message..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="min-h-[40px] resize-none pr-12 bg-muted/50 border-0 focus-visible:ring-1"
              style={{ lineHeight: "1.5" }}
              disabled={!connected}
            />
          </div>
          <Button
            onClick={sendMessage}
            disabled={!currentMessage.trim() || !connected}
            size="sm"
            className="h-10 px-4"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatMessages;
