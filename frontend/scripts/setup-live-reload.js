import { getLocalIP, logNetworkInfo } from "./utils/network.js";
import { execSync } from "child_process";

/**
 * iOS Live Reload를 자동으로 실행합니다.
 */
function setupLiveReload() {
  const ip = getLocalIP();
  logNetworkInfo(ip);
  const port = 5173;
  const scheme = "App";

  // iOS 프로젝트 동기화
  console.log("🔄 Syncing iOS project (cap sync ios)...");
  execSync("npx cap sync ios", { stdio: "inherit" });

  // 부팅된 시뮬레이터의 UDID 가져오기
  let targetOption = "";
  try {
    const bootedLine = execSync("xcrun simctl list devices | grep '(Booted)'", { 
      encoding: "utf-8", 
      stdio: "pipe" 
    }).trim();
    
    if (bootedLine) {
      // UDID 추출 (괄호 안의 첫 번째 값)
      const udidMatch = bootedLine.match(/\(([A-F0-9-]+)\)/);
      if (udidMatch && udidMatch[1]) {
        const udid = udidMatch[1];
        targetOption = ` --target ${udid}`;
        console.log("📱 Using currently booted simulator automatically");
      }
    } else {
      console.log("📱 No booted simulator found, Capacitor will show device selection");
    }
  } catch (error) {
    console.log("📱 Capacitor will show device selection");
  }

  // Live Reload로 iOS 앱 실행
  console.log("📱 Starting iOS app with Live Reload...");
  execSync(
    `npx cap run ios --live-reload --host ${ip} --port ${port} --scheme ${scheme}${targetOption}`,
    { stdio: "inherit" }
  );

  console.log("🚀 iOS Live Reload started automatically!");
}

// 스크립트 실행
setupLiveReload();
