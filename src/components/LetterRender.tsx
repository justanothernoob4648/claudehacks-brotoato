import type { Letter } from "@/lib/types";

export function LetterRender({
  letter,
  streamingText,
  speaker,
}: {
  letter?: Letter;
  streamingText?: string;
  speaker?: string;
}) {
  if (!letter && !streamingText) {
    return (
      <div className="whisper-border rounded-[var(--radius-hero)] bg-[var(--bg-warm)] p-12 text-center max-w-2xl mx-auto">
        <p className="caption-muted">
          The letter will appear here once the Narrator finishes.
        </p>
      </div>
    );
  }

  if (!letter && streamingText) {
    return (
      <article className="whisper-in whisper-border deep-shadow rounded-[var(--radius-hero)] bg-white p-10 md:p-14 max-w-2xl mx-auto">
        <p className="caption-muted mb-4">
          Streaming — {streamingText.length} characters
        </p>
        <div className="text-[17px] leading-[1.7] text-[var(--text-primary)] whitespace-pre-wrap">
          {streamingText}
          <span className="whisper-blink">▍</span>
        </div>
      </article>
    );
  }

  if (!letter) return null;

  return (
    <article className="whisper-in whisper-border deep-shadow rounded-[var(--radius-hero)] bg-white p-10 md:p-14 max-w-2xl mx-auto">
      <header className="mb-8">
        <p className="micro text-[var(--text-muted)] mb-3">
          A letter from {letter.speaker}
        </p>
        <h2 className="heading-md text-[var(--text-primary)]">
          {letter.salutation}
        </h2>
      </header>

      <div className="flex flex-col gap-8">
        {letter.sections.map((section, i) => (
          <section key={i} className="flex flex-col gap-3">
            {section.heading ? (
              <h3 className="heading-card text-[20px] text-[var(--text-primary)]">
                {section.heading}
              </h3>
            ) : null}

            {section.imageUrl ? (
              <figure className="my-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={section.imageUrl}
                  alt={section.imageCredit ?? "archival image"}
                  className="w-full rounded-[var(--radius-card)] whisper-border"
                  loading="lazy"
                />
                {section.imageCredit ? (
                  <figcaption className="caption-muted mt-2">
                    {section.imageCredit}
                  </figcaption>
                ) : null}
              </figure>
            ) : null}

            <p className="text-[17px] leading-[1.7] text-[var(--text-primary)] whitespace-pre-wrap">
              {renderWithFootnoteLinks(section.body, section.footnotes)}
            </p>

            {section.footnotes && section.footnotes.length > 0 ? (
              <ol className="mt-2 pl-4 flex flex-col gap-1 border-t border-[rgba(0,0,0,0.06)] pt-3">
                {section.footnotes.map((fn) => (
                  <li key={fn.marker} className="caption-muted">
                    <sup className="mr-1">{fn.marker}</sup>
                    {fn.url ? (
                      <a
                        href={fn.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="hover:text-[var(--accent)] hover:underline"
                      >
                        {fn.text}
                      </a>
                    ) : (
                      fn.text
                    )}
                  </li>
                ))}
              </ol>
            ) : null}
          </section>
        ))}
      </div>

      <footer className="mt-10 pt-6 border-t border-[rgba(0,0,0,0.06)]">
        <p className="text-[17px] leading-[1.7] text-[var(--text-primary)] whitespace-pre-wrap">
          {letter.signoff}
        </p>
      </footer>
    </article>
  );
}

// Replace "[^1]" markers in markdown body with styled superscript links.
function renderWithFootnoteLinks(
  body: string,
  footnotes?: Array<{ marker: string; text: string; url?: string }>,
): React.ReactNode {
  if (!footnotes || footnotes.length === 0) return body;
  const parts = body.split(/(\[\^\w+\])/g);
  return parts.map((part, i) => {
    const m = /^\[\^(\w+)\]$/.exec(part);
    if (!m) return <span key={i}>{part}</span>;
    const marker = m[1];
    const fn = footnotes.find((f) => f.marker === marker);
    if (!fn) return <span key={i}>{part}</span>;
    return (
      <sup key={i} className="text-[var(--accent)] ml-[1px]">
        {fn.url ? (
          <a
            href={fn.url}
            target="_blank"
            rel="noreferrer noopener"
            className="hover:underline"
          >
            {marker}
          </a>
        ) : (
          marker
        )}
      </sup>
    );
  });
}
