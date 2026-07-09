"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import ItemToolbar from "./ItemToolbar";
import type { StoryPost } from "@/lib/types";
import type { AdminDict } from "@/lib/i18n/admin";
import { locales, localeNames, type Locale } from "@/lib/i18n/config";

const inputClass =
  "w-full rounded-lg border border-olive-200 px-4 py-2 font-body text-sm";

type Field = "date_text" | "title" | "body";

function key(field: Field, lang: Locale) {
  return (lang === "tr" ? field : `${field}_${lang}`) as keyof StoryPost;
}

export default function StoryManager({
  initialPosts,
  t,
}: {
  initialPosts: StoryPost[];
  t: AdminDict;
}) {
  const [posts, setPosts] = useState<StoryPost[]>(initialPosts);
  const [langs, setLangs] = useState<Record<string, Locale>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const supabase = createClient();

  const patch = (id: string, changes: Partial<StoryPost>) =>
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...changes } : p)));

  const addPost = async () => {
    setBusy("new");
    const { data, error } = await supabase
      .from("story_posts")
      .insert({ sort_order: posts.length })
      .select()
      .single();
    setBusy(null);

    if (error || !data) {
      setMessage(t.common.error);
      return;
    }
    setPosts((prev) => [...prev, data as StoryPost]);
  };

  const savePost = async (post: StoryPost) => {
    setBusy(post.id);
    setMessage("");

    const { id, created_at, ...fields } = post;
    void created_at;

    const { error } = await supabase.from("story_posts").update(fields).eq("id", id);
    setBusy(null);
    setMessage(error ? t.common.error : t.common.saved);
    setTimeout(() => setMessage(""), 3000);
  };

  const uploadPhoto = async (post: StoryPost, file: File) => {
    setBusy(post.id);

    const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `story-${Date.now()}.${extension}`;

    const { error } = await supabase.storage.from("media").upload(path, file);
    if (error) {
      setBusy(null);
      setMessage(t.common.error);
      return;
    }

    const { data } = supabase.storage.from("media").getPublicUrl(path);
    await supabase
      .from("story_posts")
      .update({ photo_url: data.publicUrl })
      .eq("id", post.id);

    patch(post.id, { photo_url: data.publicUrl });
    setBusy(null);
  };

  const move = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= posts.length) return;

    const next = [...posts];
    [next[index], next[target]] = [next[target], next[index]];

    const reordered = next.map((post, i) => ({ ...post, sort_order: i }));
    setPosts(reordered);

    await Promise.all(
      reordered.map((post) =>
        supabase
          .from("story_posts")
          .update({ sort_order: post.sort_order })
          .eq("id", post.id)
      )
    );
  };

  const toggleVisible = async (post: StoryPost) => {
    const next = !post.is_visible;
    patch(post.id, { is_visible: next });
    await supabase.from("story_posts").update({ is_visible: next }).eq("id", post.id);
  };

  const remove = async (post: StoryPost) => {
    if (!window.confirm(t.common.confirmDelete)) return;
    await supabase.from("story_posts").delete().eq("id", post.id);
    setPosts((prev) => prev.filter((p) => p.id !== post.id));
  };

  return (
    <div className="max-w-3xl space-y-6 pb-16">
      <div className="flex items-center gap-4">
        <button
          onClick={addPost}
          disabled={busy === "new"}
          className="rounded-full bg-olive-700 px-6 py-2.5 text-sm tracking-wide text-cream transition-colors hover:bg-olive-800 disabled:opacity-50"
        >
          + {t.story.add}
        </button>
        {message && <p className="font-body text-sm text-olive-600">{message}</p>}
      </div>

      {posts.length === 0 && (
        <p className="font-body text-sm text-olive-500">{t.story.empty}</p>
      )}

      {posts.map((post, index) => {
        const lang = langs[post.id] ?? "tr";

        return (
          <div
            key={post.id}
            className={`space-y-5 rounded-2xl border bg-white p-6 ${
              post.is_visible ? "border-olive-200" : "border-rust/40 opacity-70"
            }`}
          >
            <ItemToolbar
              index={index}
              total={posts.length}
              visible={post.is_visible}
              onMove={(direction) => move(index, direction)}
              onToggle={() => toggleVisible(post)}
              onDelete={() => remove(post)}
              t={t}
            />

            <div className="flex flex-col gap-5 sm:flex-row">
              <div className="sm:w-40">
                <label className="mb-2 block font-body text-xs text-olive-500">
                  {t.story.photo}
                </label>
                {post.photo_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.photo_url}
                    alt=""
                    className="mb-2 aspect-[4/3] w-full rounded-lg border border-olive-200 object-cover"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void uploadPhoto(post, file);
                  }}
                  className="w-full font-body text-xs"
                />
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex gap-2">
                  {locales.map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setLangs((prev) => ({ ...prev, [post.id]: code }))}
                      className={`rounded-full px-4 py-1.5 text-xs tracking-wide transition-colors ${
                        lang === code
                          ? "bg-olive-700 text-cream"
                          : "border border-olive-300 text-olive-600 hover:bg-olive-100"
                      }`}
                    >
                      {localeNames[code]}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="mb-1 block font-body text-xs text-olive-500">
                    {t.story.dateText}
                  </label>
                  <input
                    type="text"
                    value={(post[key("date_text", lang)] as string) || ""}
                    onChange={(e) =>
                      patch(post.id, { [key("date_text", lang)]: e.target.value })
                    }
                    placeholder={lang === "tr" ? "" : post.date_text}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1 block font-body text-xs text-olive-500">
                    {t.story.postTitle}
                  </label>
                  <input
                    type="text"
                    value={(post[key("title", lang)] as string) || ""}
                    onChange={(e) =>
                      patch(post.id, { [key("title", lang)]: e.target.value })
                    }
                    placeholder={lang === "tr" ? "" : post.title}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1 block font-body text-xs text-olive-500">
                    {t.story.body}
                  </label>
                  <textarea
                    value={(post[key("body", lang)] as string) || ""}
                    onChange={(e) =>
                      patch(post.id, { [key("body", lang)]: e.target.value })
                    }
                    placeholder={lang === "tr" ? "" : post.body}
                    rows={6}
                    className={inputClass}
                  />
                </div>

                <button
                  onClick={() => savePost(post)}
                  disabled={busy === post.id}
                  className="rounded-full bg-olive-700 px-6 py-2 text-sm tracking-wide text-cream transition-colors hover:bg-olive-800 disabled:opacity-50"
                >
                  {busy === post.id ? t.common.saving : t.common.save}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
