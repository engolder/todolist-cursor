import { CapacitorConfig } from "@capacitor/cli";
import { KeyboardResize } from "@capacitor/keyboard";

const config: CapacitorConfig = {
  appId: "io.cursor.todolist",
  appName: "TodoList",
  webDir: "dist",
  plugins: {
    Keyboard: {
      resize: KeyboardResize.Body,
    },
  },
};

export default config;
