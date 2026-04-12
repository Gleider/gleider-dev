export default function Loading() {
  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-48 rounded bg-gray-800" />
        <div className="h-4 w-96 max-w-full rounded bg-gray-800" />
        <div className="grid gap-6 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 rounded-lg bg-gray-900 border border-gray-800" />
          ))}
        </div>
      </div>
    </section>
  );
}
