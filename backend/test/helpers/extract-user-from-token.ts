export default function extractUserIdFromToken(token: string): number {
  const { userId } = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
  return Number(userId);
}
