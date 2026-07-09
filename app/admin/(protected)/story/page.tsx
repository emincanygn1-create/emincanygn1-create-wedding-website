import { getStoryPosts } from "@/lib/content";
import StoryManager from "@/components/admin/StoryManager";
import { getAdminLocaleAndDict } from "@/lib/i18n/admin-server";

export const dynamic = "force-dynamic";

export default async function StoryAdminPage() {
  const [posts, { t }] = await Promise.all([
    getStoryPosts(),
    getAdminLocaleAndDict(),
  ]);

  return (
    <div>
      <h1 className="mb-2 font-display text-3xl text-olive-800">{t.story.title}</h1>
      <p className="mb-8 max-w-2xl font-body text-sm text-olive-500">{t.story.intro}</p>
      <StoryManager initialPosts={posts} t={t} />
    </div>
  );
}
