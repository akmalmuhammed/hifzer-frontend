import { redirect } from "next/navigation";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const nextParam = params.next;
  const next =
    typeof nextParam === "string" && nextParam.length > 0 ? nextParam : "/today";
  redirect(`/sign-in?redirect_url=${encodeURIComponent(next)}`);
}
