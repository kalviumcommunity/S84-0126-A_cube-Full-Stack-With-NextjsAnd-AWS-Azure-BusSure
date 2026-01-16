export const revalidate = 60;

export default function PoliciesPage() {
  return (
    <main style={{ padding: "40px" }}>
      <h1>Cancellation & Refund Policies</h1>
      <p>
        These policies are mostly static but may change occasionally.
      </p>
      <p>
        This page uses Incremental Static Regeneration and revalidates every 60
        seconds.
      </p>
    </main>
  );
}
