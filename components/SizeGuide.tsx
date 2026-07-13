// ponytail: generic saree measurements — replace with your actual size chart when ready.
export default function SizeGuide() {
  return (
    <details style={{ marginTop: "1rem" }}>
      <summary style={{ cursor: "pointer", fontWeight: 600 }}>Size guide</summary>
      <table style={{ width: "100%", marginTop: "0.5rem", fontSize: "0.9rem", borderCollapse: "collapse" }}>
        <thead>
          <tr><th style={{ textAlign: "left" }}>Item</th><th style={{ textAlign: "left" }}>Length</th></tr>
        </thead>
        <tbody>
          <tr><td>Saree</td><td>5.5 m (+ 0.8 m blouse piece, standard)</td></tr>
          <tr><td>Blouse piece</td><td>0.8 m, unstitched</td></tr>
        </tbody>
      </table>
    </details>
  );
}
