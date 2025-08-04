import { seedTransactions } from "@/actions/ranData";

export async function GET() {
  const result = await seedTransactions();
  return Response.json(result);
}