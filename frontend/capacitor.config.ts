import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "io.cursor.todolist",
  appName: "Todo List",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
  ios: {
    contentInset: "automatic",
    preferredContentMode: "mobile",
    scheme: "app",
    backgroundColor: "#ffffff",
    limitsNavigationsToAppBoundDomains: true,
  },
};

export default config;
