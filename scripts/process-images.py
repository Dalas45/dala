"""
Dalas - foto-pipeline
=====================
Leest de officiele productfoto's uit `_source/nieuw/<slug>/`, corrigeert de
EXIF-orientatie, schaalt naar webformaat, geeft ze een beschrijvende
SEO-bestandsnaam en schrijft:

  public/images/dresses/<slug>/trouwjurk-<slug>-dalas-NN-<hash>.webp  (max 1800px, WebP q82)
  public/images/og/dalas-trouwjurken.jpg                              (1200x630 Open Graph, blijft JPEG)
  src/data/images.generated.ts                                        (paden, afmetingen en blur)

De <hash> is de eerste acht tekens van de SHA-1 van de bestandsinhoud. Daardoor
krijgt een vervangen foto automatisch een nieuwe URL, en zien terugkerende
bezoekers nooit de oude versie uit hun browsercache. Alleen zo is de
`immutable`-cacheheader van een jaar ook echt veilig.

Next.js Image levert hieruit AVIF en WebP in de juiste responsive maten.
De originelen blijven onaangeroerd in `_source/` (staat in .gitignore, wordt niet gedeployed).

Gebruik:  python scripts/process-images.py   (of: npm run images)
Vereist:  Python 3.10+ met `pip install pillow pillow-heif`

MAPPENSTRUCTUUR IN _source/
  nieuw/<slug>/              de huidige productfoto's; deze bepalen wat op de site staat
  _vorige-website-fotos/     de eerder gebruikte foto's, bewaard maar niet meer in gebruik
  <Naam jurk>/               de originele ZIP-uitpak van de eerste aanlevering

EEN JURK TOEVOEGEN OF VERVANGEN
  1. Zet de foto's in `_source/nieuw/<slug>/`.
  2. Draai `npm run images`.
  3. Zorg dat dezelfde slug in `src/data/dresses.ts` staat, met even veel
     `imageAlts`-regels als er foto's zijn.

De bestandspaden staan NIET in `dresses.ts`: dit script schrijft ze in
`dressImagePaths` en de site zoekt ze daar op. Je hoeft dus nooit handmatig een
pad bij te werken, alleen de alt-teksten.

De bestanden worden per map alfabetisch genummerd. Wil je een andere volgorde
(bijvoorbeeld een bepaalde foto als hoofdfoto), zet de slug dan in ORDER
hieronder met de bestandsnamen in de gewenste volgorde.
"""

from __future__ import annotations

import base64
import hashlib
import io
import json
import sys
from pathlib import Path

from PIL import Image, ImageOps

try:
    import pillow_heif  # type: ignore

    pillow_heif.register_heif_opener()
except ImportError:  # pragma: no cover
    print("pillow-heif ontbreekt: `pip install pillow-heif` (nodig voor .HEIC).", file=sys.stderr)
    sys.exit(1)

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "_source" / "nieuw"
OUT = ROOT / "public" / "images" / "dresses"
# Sieraden volgen dezelfde opzet: een map per item in `_source/sieraden/<slug>/`.
JEWELLERY_SRC = ROOT / "_source" / "sieraden"
JEWELLERY_OUT = ROOT / "public" / "images" / "sieraden"
OG_OUT = ROOT / "public" / "images" / "og"
MANIFEST = ROOT / "src" / "data" / "images.generated.ts"

MAX_WIDTH = 1800
MAX_HEIGHT = 1800
# WebP q82 met method=6 haalt bij deze fotografie ongeveer de kwaliteit van
# JPEG q84 op ruwweg de helft van de bytes. Het bronbestand is wat Next.js
# inleest en opnieuw codeert naar AVIF/WebP; hoe lichter dat is, hoe kleiner de
# repo en de deploy, zonder dat de bezoeker iets inlevert.
QUALITY = 82
WEBP_METHOD = 6
# De Open Graph-afbeelding blijft JPEG: WhatsApp, iMessage en een deel van de
# oudere linkvoorbeelden tonen een WebP-preview niet.
OG_QUALITY = 85
BLUR_SIZE = 16
VALID_SUFFIXES = {".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"}
# Alles wat een eerdere draai kan hebben achtergelaten, inclusief de JPEG's van
# vóór de overstap naar WebP.
GENERATED_SUFFIXES = ("jpg", "webp")

# Afwijkende volgorde per jurk. De eerste foto is altijd de hoofdfoto, die op de
# kaarten en in de metadata wordt gebruikt.
ORDER: dict[str, list[str]] = {
    # De volle baljurk met overrok is als hoofdfoto herkenbaarder dan de
    # getailleerde variant zonder overrok.
    "wit-2-in-1": [
        "White_wedding_dress_on_mannequin_2K_20260920222625.jpeg",
        "Wedding_gown_displayed_on_mannequin_2K_20260920222605.jpeg",
    ],
    # Zonder deze regel wint de alfabetische volgorde en komt "achter" vooraan.
    # De voorkant hoort de hoofdfoto te zijn.
    "strik": [
        "strik-voor.png",
        "strik-achter.png",
    ],
}

# Open Graph-afbeelding: (slug, index van de foto, focuspunt verticaal 0..1)
OG_SOURCE = ("queen", 0, 0.18)


def load(path: Path) -> Image.Image:
    im = Image.open(path)
    im = ImageOps.exif_transpose(im)
    return im.convert("RGB")


def blur_data_url(im: Image.Image) -> str:
    small = im.copy()
    small.thumbnail((BLUR_SIZE, BLUR_SIZE))
    buf = io.BytesIO()
    small.save(buf, format="JPEG", quality=40)
    return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode("ascii")


def source_files(slug: str, base: Path = SRC) -> list[Path]:
    """Bronbestanden van een item, in de volgorde waarin ze op de site komen."""
    folder = base / slug
    found = sorted(p for p in folder.iterdir() if p.is_file() and p.suffix.lower() in VALID_SUFFIXES)
    preferred = ORDER.get(slug)
    if not preferred:
        return found

    by_name = {p.name: p for p in found}
    ordered = [by_name.pop(name) for name in preferred if name in by_name]
    # Bestanden die niet in ORDER staan, komen erachter; zo raakt er nooit iets kwijt.
    return ordered + sorted(by_name.values())


def encode_jpeg(im: Image.Image, quality: int) -> bytes:
    buf = io.BytesIO()
    im.save(buf, format="JPEG", quality=quality, optimize=True, progressive=True)
    return buf.getvalue()


def encode_webp(im: Image.Image, quality: int) -> bytes:
    buf = io.BytesIO()
    # `method=6` is de traagste maar zuinigste zoekstand van de encoder. Dit
    # draait offline, dus die tijd mag het kosten.
    im.save(buf, format="WEBP", quality=quality, method=WEBP_METHOD)
    return buf.getvalue()


def process_item(slug: str, *, base: Path, out_root: Path, prefix: str, url_folder: str) -> list[dict]:
    """
    Verwerkt alle foto's van één item (een jurk of een sieraad).

    `prefix` bepaalt het begin van de bestandsnaam, bijvoorbeeld "trouwjurk" of
    "sieraad"; `url_folder` is de map onder /images waar het resultaat belandt.
    """
    out_dir = out_root / slug
    out_dir.mkdir(parents=True, exist_ok=True)

    # Eerder gegenereerde bestanden weghalen, zodat er na een vervanging geen
    # verweesde foto's blijven staan. De hash in de naam maakt het anders
    # onmogelijk om oude versies te herkennen.
    for suffix in GENERATED_SUFFIXES:
        for stale in out_dir.glob(f"{prefix}-*.{suffix}"):
            stale.unlink()

    entries = []
    for i, src in enumerate(source_files(slug, base), start=1):
        im = load(src)
        im.thumbnail((MAX_WIDTH, MAX_HEIGHT), Image.Resampling.LANCZOS)

        # Hash over de definitieve bytes: verandert de foto, dan verandert de URL.
        data = encode_webp(im, QUALITY)
        digest = hashlib.sha1(data).hexdigest()[:8]
        name = f"{prefix}-{slug}-dalas-{i:02d}-{digest}.webp"

        dest = out_dir / name
        dest.write_bytes(data)
        entries.append(
            {
                "src": f"/images/{url_folder}/{slug}/{name}",
                "width": im.width,
                "height": im.height,
                "blurDataURL": blur_data_url(im),
            }
        )
        print(f"  {name}  {im.width}x{im.height}  {len(data) // 1024} KB")
    return entries


def process_dress(slug: str) -> list[dict]:
    return process_item(slug, base=SRC, out_root=OUT, prefix="trouwjurk", url_folder="dresses")


def process_jewellery(slug: str) -> list[dict]:
    return process_item(slug, base=JEWELLERY_SRC, out_root=JEWELLERY_OUT, prefix="sieraad", url_folder="sieraden")


def make_og() -> dict:
    slug, idx, focus_y = OG_SOURCE
    src = source_files(slug)[idx]
    im = load(src)

    target_w, target_h = 1200, 630
    ratio = target_w / target_h
    w, h = im.size
    crop_w, crop_h = w, int(w / ratio)
    if crop_h > h:
        crop_h, crop_w = h, int(h * ratio)
    top = int((h - crop_h) * focus_y)
    left = (w - crop_w) // 2
    im = im.crop((left, top, left + crop_w, top + crop_h)).resize((target_w, target_h), Image.Resampling.LANCZOS)

    OG_OUT.mkdir(parents=True, exist_ok=True)
    dest = OG_OUT / "dalas-trouwjurken.jpg"
    dest.write_bytes(encode_jpeg(im, OG_QUALITY))
    print(f"  dalas-trouwjurken.jpg  {target_w}x{target_h}  {dest.stat().st_size // 1024} KB")
    return {
        "src": "/images/og/dalas-trouwjurken.jpg",
        "width": target_w,
        "height": target_h,
        "blurDataURL": blur_data_url(im),
    }


def main() -> None:
    if not SRC.is_dir():
        print(f"Bronmap ontbreekt: {SRC}", file=sys.stderr)
        sys.exit(1)

    manifest: dict[str, dict] = {}
    paths_by_slug: dict[str, list[str]] = {}
    jewellery_by_slug: dict[str, list[str]] = {}
    slugs = sorted(p.name for p in SRC.iterdir() if p.is_dir())

    for slug in slugs:
        print(f"[{slug}]")
        entries = process_dress(slug)
        paths_by_slug[slug] = [e["src"] for e in entries]
        for entry in entries:
            manifest[entry["src"]] = {k: v for k, v in entry.items() if k != "src"}

    jewellery_slugs = sorted(p.name for p in JEWELLERY_SRC.iterdir() if p.is_dir()) if JEWELLERY_SRC.is_dir() else []
    for slug in jewellery_slugs:
        print(f"[sieraad: {slug}]")
        entries = process_jewellery(slug)
        jewellery_by_slug[slug] = [e["src"] for e in entries]
        for entry in entries:
            manifest[entry["src"]] = {k: v for k, v in entry.items() if k != "src"}

    print("[og]")
    og = make_og()
    manifest[og["src"]] = {k: v for k, v in og.items() if k != "src"}

    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    meta_body = json.dumps(manifest, indent=2, ensure_ascii=False)
    paths_body = json.dumps(paths_by_slug, indent=2, ensure_ascii=False)
    MANIFEST.write_text(
        "// GEGENEREERD door scripts/process-images.py - niet handmatig bewerken.\n"
        "// Draai `npm run images` om dit bestand te vernieuwen.\n\n"
        "export interface GeneratedImage {\n  width: number;\n  height: number;\n  blurDataURL: string;\n}\n\n"
        "/** Afmetingen en blur-placeholder per geoptimaliseerd bestand. */\n"
        f"export const generatedImages: Record<string, GeneratedImage> = {meta_body} as const;\n\n"
        "/**\n"
        " * De foto's per jurk, in de volgorde waarin ze worden getoond; de eerste is\n"
        " * de hoofdfoto. De bestandsnaam bevat een hash van de inhoud, zodat een\n"
        " * vervangen foto automatisch een nieuwe URL krijgt en niemand een oude\n"
        " * versie uit zijn cache te zien krijgt.\n"
        " */\n"
        f"export const dressImagePaths: Record<string, string[]> = {paths_body} as const;\n\n"
        "/** Idem voor de sieraden, per slug uit `src/data/jewellery.ts`. */\n"
        f"export const jewelleryImagePaths: Record<string, string[]> = "
        f"{json.dumps(jewellery_by_slug, indent=2, ensure_ascii=False)} as const;\n",
        encoding="utf-8",
    )
    print(f"\nManifest geschreven: {MANIFEST.relative_to(ROOT)} ({len(manifest)} afbeeldingen)")

    # Overzicht zodat je meteen ziet hoeveel alt-teksten elk item nodig heeft.
    print("\nAantal foto's per jurk (evenveel `imageAlts` in src/data/dresses.ts):")
    for slug in slugs:
        print(f"  {slug:18} {len(paths_by_slug[slug])}")
    if jewellery_by_slug:
        print("\nAantal foto's per sieraad (evenveel `imageAlts` in src/data/jewellery.ts):")
        for slug in jewellery_slugs:
            print(f"  {slug:18} {len(jewellery_by_slug[slug])}")


if __name__ == "__main__":
    main()
