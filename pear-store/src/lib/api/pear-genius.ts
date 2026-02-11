const PEAR_GENIUS_URL =
  process.env.NEXT_PUBLIC_PEAR_GENIUS_URL || "http://localhost:8000";

export interface CreateSessionResponse {
  session_id: string;
  welcome_message: string;
}

export async function createChatSession(): Promise<CreateSessionResponse> {
  const res = await fetch(`${PEAR_GENIUS_URL}/api/chat/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Failed to create session: ${res.status}`);
  }

  return res.json();
}

export async function getSession(
  sessionId: string
): Promise<boolean> {
  try {
    const res = await fetch(
      `${PEAR_GENIUS_URL}/api/chat/sessions/${sessionId}`
    );
    return res.ok;
  } catch {
    return false;
  }
}

export async function sendChatMessage(
  sessionId: string,
  message: string
): Promise<Response> {
  const res = await fetch(
    `${PEAR_GENIUS_URL}/api/chat/sessions/${sessionId}/messages`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to send message: ${res.status}`);
  }

  return res;
}
