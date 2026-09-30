import type { JsonLd } from "@/lib/schema";

/**
 * Rendert JSON-LD. `undefined`-schema's worden overgeslagen, zodat ontbrekende
 * gegevens (bv. geen adres) geen lege structured data opleveren.
 */
export function StructuredData({ schema }: { schema: Array<JsonLd | undefined> | JsonLd | undefined }) {
  const list = (Array.isArray(schema) ? schema : [schema]).filter((s): s is JsonLd => Boolean(s));
  if (list.length === 0) return null;
  return (
    <>
      {list.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          // JSON.stringify-output; `<` wordt geëscaped om script-injectie te voorkomen.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item).replace(/</g, "\\u003c") }}
        />
      ))}
    </>
  );
}
