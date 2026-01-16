export default function HomePage() {
  return (
    <main style={{ padding: "40px" }}>
      <h1>Intercity Bus Refund Transparency System</h1>

      <p>Environment: {process.env.NEXT_PUBLIC_APP_ENV}</p>

      <p>
        This application aims to bring transparency and accountability to
        intercity bus ticket cancellations and refunds.
      </p>
    </main>
  );
}
