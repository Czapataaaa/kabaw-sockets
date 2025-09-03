import { useSelector, useDispatch } from "react-redux";
import { setUsername, setChannel } from "@/app/features/User";
import { setConnected, setDisconnected } from "@/app/features/Connection";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Card, CardContent } from "@/components/atoms/card";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function ConnectionForm({ className, ...props }) {
  const dispatch = useDispatch();
  const username = useSelector((state) => state.user.username);
  const channel = useSelector((state) => state.user.channel);
  const connected = useSelector((state) => state.connection.connected);
  const navigate = useNavigate();

  useEffect(() => {
    if (connected) {
      navigate("/dashboard");
    }
  }, [connected, navigate]);

  const [localUsername, setLocalUsername] = useState(username);
  const [localChannel, setLocalChannel] = useState(channel);

  const handleConnect = (e) => {
    e.preventDefault();
    dispatch(setUsername(localUsername));
    dispatch(setChannel(localChannel));
    dispatch(setConnected());
  };

  const handleDisconnect = () => {
    dispatch(setDisconnected());
    // Here you would also close your WebSocket connection
  };

  return (
    <div className="flex justify-center items-center">
      <Card className="bg-black text-white shadow-xl rounded-2xl w-full max-w-4xl">
        <CardContent className="p-8">
          <form
            className={cn("flex flex-col gap-6", className)}
            {...props}
            onSubmit={handleConnect}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold">
                Running on port 6969 - Testing cross-origin WebSocket to port
                8080
              </h1>
              <p className="text-muted-foreground text-sm text-balance">
                Enter your name and channel below to connect
              </p>
            </div>

            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Kabaw Pro"
                  required
                  value={localUsername}
                  onChange={(e) => setLocalUsername(e.target.value)}
                  disabled={connected}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="channel">Channel</Label>
                <Input
                  id="channel"
                  type="text"
                  placeholder="general"
                  required
                  value={localChannel}
                  onChange={(e) => setLocalChannel(e.target.value)}
                  disabled={connected}
                />
              </div>
              <Button type="submit" className="w-full" disabled={connected}>
                Connect
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full bg-white text-black hover:bg-gray-200"
                onClick={handleDisconnect}
                disabled={!connected}
              >
                Disconnect
              </Button>
            </div>

            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
