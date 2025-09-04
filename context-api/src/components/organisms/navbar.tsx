import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Wifi, WifiOff } from "lucide-react";

export default function ChatUIDesign() {
  const [messageInput, setMessageInput] = useState("");

  // Mock data for demonstration
  const [isConnected] = useState(true);
  const [username] = useState("testKabaw");

  const mockMessages = [
    {
      id: 1,
      type: "system",
      content: "Connected as testKabaw to channel general",
    },
    {
      id: 2,
      type: "message",
      username: "Alice",
      content: "Hey everyone! How is everyone doing today?",
      timestamp: "10:30 AM",
    },
    {
      id: 3,
      type: "message",
      username: "testKabaw",
      content: "Doing great! Just testing out this new chat interface.",
      timestamp: "10:32 AM",
    },
    {
      id: 4,
      type: "message",
      username: "Bob",
      content: "The new design looks really clean!",
      timestamp: "10:33 AM",
    },
    {
      id: 5,
      type: "system",
      content: "Charlie joined the channel",
    },
    {
      id: 6,
      type: "message",
      username: "Charlie",
      content: "Hello everyone! 👋",
      timestamp: "10:35 AM",
    },
  ];

  // Desktop Layout
  const DesktopLayout = () => (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="grid grid-cols-3 gap-6 h-96">
        {/* Connection Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Connection Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <Input defaultValue="testKabaw" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Channel</label>
              <Input defaultValue="general" />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1">Connect</Button>
              <Button variant="outline" className="flex-1">
                Disconnect
              </Button>
            </div>

            {/* Status Section */}
            <div className="mt-6">
              <div className="bg-muted p-3 rounded-lg text-center">
                <h3 className="font-medium mb-2">Status</h3>
                <Badge
                  variant={isConnected ? "default" : "secondary"}
                  className="flex items-center justify-center gap-1"
                >
                  {isConnected ? (
                    <Wifi className="w-3 h-3" />
                  ) : (
                    <WifiOff className="w-3 h-3" />
                  )}
                  {isConnected ? "Connected" : "Disconnected"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat Messages */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Chat Messages</CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-full flex flex-col">
            <ScrollArea className="flex-1 px-4">
              <div className="space-y-3 py-4">
                {mockMessages.map((message) => (
                  <div key={message.id}>
                    {message.type === "system" ? (
                      <div className="text-center">
                        <Badge variant="secondary" className="text-xs">
                          {message.content}
                        </Badge>
                      </div>
                    ) : (
                      <div
                        className={`flex ${
                          message.username === username
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.username === username
                              ? "bg-primary text-primary-foreground ml-4"
                              : "bg-muted mr-4"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">
                              {message.username}
                            </span>
                            <span className="text-xs opacity-70">
                              {message.timestamp}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed">
                            {message.content}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button size="sm">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
  return <DesktopLayout />;
}
