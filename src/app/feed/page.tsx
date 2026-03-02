import { FeedClient } from "./FeedClient";

export default function FeedPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  return <FeedClient searchParams={searchParams} />;
}

