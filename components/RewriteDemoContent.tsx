const SAMPLE_PARAGRAPHS = [
  "Our platform leverage cutting-edge AI to help teams work more better and faster than ever before. Users can easy integrate it into there existing workflows without alot of setup.",
  "The dashboard show real-time analytics and let managers to track performance metrics across multiple departments. It was designed with simplicity in mind, though some users find the interface kinda confusing at first.",
  "We are excited to announce that our new feature will allows customers to automate repetitive tasks using natural language commands, which should significently reduce manual work.",
];

export function RewriteDemoContent() {
  return (
    <article className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 sm:p-8 space-y-5 select-text">
      <h2 className="text-lg font-semibold text-white">
        Product update draft
      </h2>
      {SAMPLE_PARAGRAPHS.map((paragraph, i) => (
        <p key={i} className="text-sm text-gray-300 leading-relaxed">
          {paragraph}
        </p>
      ))}
    </article>
  );
}
