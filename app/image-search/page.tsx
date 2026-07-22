import ImageSearchUpload from "@/components/ImageSearchUpload";

export default function ImageSearchPage() {
  return (
    <main>
      <h1>Search by photo</h1>
      <p style={{ color: "#666" }}>Upload a photo of a saree — we'll find the closest matches in our catalogue.</p>
      <ImageSearchUpload />
    </main>
  );
}
