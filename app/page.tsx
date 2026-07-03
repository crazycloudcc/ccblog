import { HomeView } from "@/components/home/HomeView";
import { getPosts } from "@/lib/posts";

export default function HomePage() {
  const posts = getPosts();

  return <HomeView posts={posts} />;
}
