import { redirect } from "next/navigation";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const nextParam = params.next;
  const next =
    typeof nextParam === "string" && nextParam.length > 0 ? nextParam : "/assessment";
  redirect(`/sign-up?redirect_url=${encodeURIComponent(next)}`);
}
