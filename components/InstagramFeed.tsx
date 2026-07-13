// Instagram Basic Display / Graph API feed — needs a long-lived access token.
// Get one via https://developers.facebook.com/docs/instagram-basic-display-api
const TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;

type InstagramPost = { id: string; media_url: string; permalink: string };

export default async function InstagramFeed() {
  if (!TOKEN) return null; // ponytail: hidden until INSTAGRAM_ACCESS_TOKEN is set

  const res = await fetch(
    `https://graph.instagram.com/me/media?fields=id,media_url,permalink&access_token=${TOKEN}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return null;
  const { data: posts }: { data: InstagramPost[] } = await res.json();

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "0.5rem" }}>
      {posts.slice(0, 8).map((p) => (
        <a key={p.id} href={p.permalink} target="_blank" rel="noopener noreferrer">
          {/* eslint-disable-next-line @next/next/no-img-element -- external, unpredictable-domain images */}
          <img src={p.media_url} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 8 }} />
        </a>
      ))}
    </div>
  );
}
