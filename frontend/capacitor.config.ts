import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "io.cursor.todolist",
  appName: "TodoList",
  webDir: "dist",
  server: {
    url: "http://10.120.90.211:5173",
    cleartext: true,
  },
};

export default config;
