"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tables } from "@/types/supabase";

type NewsArticle = Tables<"news">;

interface NewsFormProps {
  article?: NewsArticle;
  userId: string;
}

export default function NewsForm({ article, userId }: NewsFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [title, setTitle] = useState(article?.title || "");
  const [summary, setSummary] = useState(article?.summary || "");
  const [content, setContent] = useState(article?.content || "");
  const [featuredImage, setFeaturedImage] = useState(
    article?.featured_image || "",
  );
  const [published, setPublished] = useState(article?.published || false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      let imageUrl = featuredImage;

      // Upload image if a new one is selected
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `news/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from("media")
          .upload(filePath, imageFile);

        if (uploadError) {
          throw new Error(`Error uploading image: ${uploadError.message}`);
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("media")
          .getPublicUrl(filePath);
        imageUrl = urlData.publicUrl;
      }

      const now = new Date().toISOString();
      const publishedAt = published ? article?.published_at || now : null;

      if (article) {
        // Update existing article
        const { error } = await supabase
          .from("news")
          .update({
            title,
            summary,
            content,
            featured_image: imageUrl,
            published,
            published_at: publishedAt,
            updated_at: now,
          })
          .eq("id", article.id);

        if (error) throw new Error(error.message);
      } else {
        // Create new article
        const { error } = await supabase.from("news").insert({
          title,
          summary,
          content,
          featured_image: imageUrl,
          author_id: userId,
          published,
          published_at: publishedAt,
          created_at: now,
          updated_at: now,
        });

        if (error) throw new Error(error.message);
      }

      router.push("/dashboard/news");
      router.refresh();
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-lg shadow"
    >
      {formError && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-4">
          {formError}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Summary</Label>
        <Textarea
          id="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="featuredImage">Current Featured Image</Label>
        {featuredImage && (
          <div className="mt-2 mb-4">
            <img
              src={featuredImage}
              alt="Featured"
              className="w-full max-w-md h-auto rounded-md"
            />
          </div>
        )}
        <Input
          id="featuredImage"
          type="text"
          value={featuredImage}
          onChange={(e) => setFeaturedImage(e.target.value)}
          placeholder="Image URL (optional)"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUpload">Upload New Image</Label>
        <Input
          id="imageUpload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        {imageFile && (
          <p className="text-sm text-gray-500 mt-1">
            Selected: {imageFile.name}
          </p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="published"
          checked={published}
          onCheckedChange={(checked) => setPublished(checked as boolean)}
        />
        <Label htmlFor="published" className="cursor-pointer">
          Publish article
        </Label>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/news")}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-[#640015] hover:bg-[#111827]"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? article
              ? "Updating..."
              : "Creating..."
            : article
              ? "Update Article"
              : "Create Article"}
        </Button>
      </div>
    </form>
  );
}
