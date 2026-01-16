export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const time = new Date().toISOString();

  return (
    <main style={{ padding: "40px" }}>
      <h1>Refund Status Dashboard</h1>
      <p>This page is rendered on every request.</p>
      <p>Current server time:</p>
      <strong>{time}</strong>
    </main>
  );
}
