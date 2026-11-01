import rss from "@astrojs/rss";
import { getSortedPosts } from "@utils/content-utils";
import { url } from "@utils/url-utils";
import type { APIContext } from "astro";
import { siteConfig } from "@/config";

export async function GET(context: APIContext) {
	const blog = await getSortedPosts();

	return rss({
		title: siteConfig.title,
		description: siteConfig.subtitle || "No description",
		site: new URL(url("/"), context.site ?? "http://localhost:4321").href,
		items: blog.map((post) => {
			return {
				title: post.data.title,
				pubDate: post.data.published,
				description: post.data.description || "",
				link: url(`/posts/${post.slug}/`),
				// 摘要订阅：正文图片由 Astro 优化，不在 RSS 中输出失效的相对地址。
			};
		}),
		customData: `<language>${siteConfig.lang}</language>`,
	});
}
