"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MessageSquare, MessageSquareOff } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { use } from "react";
import MDEditor from "@uiw/react-md-editor";
import { useTheme } from "next-themes";

interface Category {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  status: z.enum(["draft", "published"]),
  published_at: z.string().optional(),
  category_id: z.string().optional(),
  tags: z.array(z.string()).optional(),
  comments_enabled: z.boolean().default(true),
});

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [commentsEnabled, setCommentsEnabled] = useState(true);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [status, setStatus] = useState("draft");
  const [published_at, setPublished_at] = useState("");
  const [category_id, setCategory_id] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      status: "draft",
      published_at: "",
      category_id: "",
      tags: [],
      comments_enabled: true,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch post data
        const postResponse = await fetch(`/api/admin/blog/posts/${resolvedParams.id}`);
        if (!postResponse.ok) throw new Error("Failed to fetch post");
        const postData = await postResponse.json();
        
        // Format the data for the form
        const formattedData = {
          title: postData.title,
          slug: postData.slug,
          content: postData.content,
          excerpt: postData.excerpt || "",
          status: postData.status || "draft",
          published_at: postData.published_at ? new Date(postData.published_at).toISOString().split('T')[0] : "",
          category_id: postData.category_id?.toString() || "",
          tags: Array.isArray(postData.tags) 
            ? postData.tags
                .filter((tag: any) => tag && tag.id) // Filter out null/undefined tags
                .map((tag: any) => tag.id.toString())
            : [],
          comments_enabled: postData.comments_enabled ?? true,
        };

        form.reset(formattedData);
        setCommentsEnabled(postData.comments_enabled ?? true);
        setTitle(postData.title);
        setSlug(postData.slug);
        setContent(postData.content);
        setExcerpt(postData.excerpt || "");
        setStatus(postData.status || "draft");
        setPublished_at(postData.published_at ? new Date(postData.published_at).toISOString().split('T')[0] : "");
        setCategory_id(postData.category_id?.toString() || "");
        
        // Safely handle tags
        if (Array.isArray(postData.tags)) {
          setTags(postData.tags
            .filter((tag: any) => tag && tag.id)
            .map((tag: any) => tag.id.toString()));
        } else {
          setTags([]);
        }

        // Fetch categories
        const categoriesResponse = await fetch("/api/admin/categories");
        if (!categoriesResponse.ok) throw new Error("Failed to fetch categories");
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        // Fetch available tags
        const tagsResponse = await fetch("/api/admin/tags");
        if (!tagsResponse.ok) throw new Error("Failed to fetch tags");
        const tagsData = await tagsResponse.json();
        setAvailableTags(tagsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load post data");
      }
    };

    fetchData();
  }, [resolvedParams.id, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      
      // Format the data for the API
      const postData = {
        ...values,
        published_at: values.status === "published" ? values.published_at : null,
        tags: values.tags?.map(tagId => parseInt(tagId)) || [],
        comments_enabled: commentsEnabled,
      };

      const response = await fetch(`/api/admin/blog/posts/${resolvedParams.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("Failed to update post");
      }

      toast.success("Post updated successfully");
      router.push("/admin/posts");
      router.refresh();
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to update post");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Post</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-foreground mb-1">
                  Title *
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-background dark:bg-gray-700 border border-input dark:border-gray-600 rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              
              {/* Comments Toggle Button */}
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setCommentsEnabled(!commentsEnabled)}
                  className={`px-4 py-2 rounded-md text-sm font-medium flex items-center transition-colors ${
                    commentsEnabled
                      ? "bg-primary/20 text-primary hover:bg-primary/30 dark:bg-primary/30 dark:hover:bg-primary/40"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 dark:bg-gray-700 dark:hover:bg-gray-600"
                  }`}
                >
                  {commentsEnabled ? "Comments Enabled" : "Comments Disabled"}
                </button>
              </div>
              
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-foreground mb-1">
                  Content *
                </label>
                <div data-color-mode={theme === 'dark' ? 'dark' : 'light'} className="w-full mb-4">
                  <MDEditor
                    value={content}
                    onChange={(val: string | undefined) => setContent(val || '')}
                    height={400}
                    preview="edit"
                  />
                </div>
              </div>
            </div>
            
            <div className="md:col-span-1 space-y-6">
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter post slug" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter post excerpt"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select post status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("status") === "published" && (
                <FormField
                  control={form.control}
                  name="published_at"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Publication Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        const currentTags = field.value || [];
                        if (!currentTags.includes(value)) {
                          field.onChange([...currentTags, value]);
                        }
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tags" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableTags.map((tag) => (
                          <SelectItem key={tag.id} value={tag.id.toString()}>
                            {tag.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {field.value?.map((tagId) => {
                        const tag = availableTags.find((t) => t.id.toString() === tagId);
                        return tag ? (
                          <div
                            key={tag.id}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm flex items-center gap-1"
                          >
                            {tag.name}
                            <button
                              type="button"
                              onClick={() => {
                                field.onChange(field.value?.filter((id) => id !== tagId));
                              }}
                              className="text-blue-800 hover:text-blue-900"
                            >
                              ×
                            </button>
                          </div>
                        ) : null;
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Form>
    </div>
  );
} 