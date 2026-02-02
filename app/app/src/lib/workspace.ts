import { cookies } from "next/headers";

export async function getWorkspaceKey(): Promise<string> {
  const wk = (await cookies()).get("wk")?.value;
  // middleware powinien zawsze ustawić, ale zostawiamy bezpiecznik
  return wk ?? "wk_missing";
}
