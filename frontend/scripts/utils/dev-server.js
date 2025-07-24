import { spawn } from "child_process";

/**
 * Vite 개발 서버를 백그라운드에서 시작합니다.
 * @returns {ChildProcess} Vite 프로세스
 */
export function startViteDevServer() {
  console.log("🚀 Starting Vite development server...");
  return spawn("yarn", ["dev"], {
    stdio: "inherit",
    detached: true,
  });
}

/**
 * 프로세스를 안전하게 종료합니다.
 * @param {ChildProcess} process - 종료할 프로세스
 * @param {string} name - 프로세스 이름 (로그용)
 */
export function killProcess(process, name = "Process") {
  try {
    process.kill(-process.pid);
    console.log(`✅ ${name} terminated successfully`);
  } catch (error) {
    console.log(`⚠️ ${name} was already terminated`);
  }
}

/**
 * 프로세스 종료 핸들러를 설정합니다.
 * @param {ChildProcess} viteProcess - Vite 프로세스
 */
export function setupProcessHandlers(viteProcess) {
  process.on("SIGINT", () => {
    console.log("\n🛑 Shutting down...");
    killProcess(viteProcess, "Vite server");
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    console.log("\n🛑 Received SIGTERM, shutting down...");
    killProcess(viteProcess, "Vite server");
    process.exit(0);
  });
}
