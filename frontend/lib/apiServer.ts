import axios from "axios";
import { cookies } from "next/headers";

export const fetchMeServer = async () => {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) return null;

  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
      headers: { Cookie: `session=${session}` },
    });
    return res.data;
  } catch (err) {
    console.error("fetchMeServer error:", err);
    return null;
  }
};
