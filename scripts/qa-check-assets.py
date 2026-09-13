#!/usr/bin/env python3
"""Overlay QA checker for Pubbets Workshop artwork.

Checks selectable option artwork against the locked puppet base:

  1. Format        - transparent PNG (RGBA/LA/P with alpha), no baked background
  2. Canvas        - matches the master canvas size (default 2000x3000)
  3. Transparency  - alpha channel present and actually used (not opaque)
  4. Contamination - no unexpected opaque/edge content (manual visual check helper)
  5. Naming        - lowercase letters, numbers, hyphens only; matches V1 pattern
  6. Overlay       - when --base is given, produces a composite overlay image so
                     garment joins (neck, shoulders, sleeves, waist, hem, legs)
                     can be verified visually against the base layer

Usage:
  python scripts/qa-check-assets.py [--dir assets/thumbnails] [--base FINAL_PUPPET_BASE.png]
                                    [--expected 2000 3000] [--out overlay-output/]

Exit code 0 = all checks passed; 1 = failures found (CI-friendly).
Prints a per-file PASS/FAIL report and writes overlay composites (when --base
and --out are given) into <out>/overlay-<name>.png for visual inspection.
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

from PIL import Image

NAME_PATTERN = re.compile(r"^[a-z0-9][a-z0-9-]*\.(png|webp)$")
IMAGE_EXTS = (".png", ".webp")


def check_format(image: Image.Image) -> list[str]:
    problems: list[str] = []
    if image.mode not in ("RGBA", "LA"):
        if "transparency" not in image.info:
            problems.append(f"no alpha channel (mode={image.mode})")
        else:
            image = image.convert("RGBA")
    # Baked background detection: fully opaque pixels that touch the canvas edge.
    from PIL import ImageChops

    rgba = image.convert("RGBA")
    alpha = rgba.getchannel("A")
    w, h = rgba.size
    # A 1px border strip sampled along the canvas edge.
    border = Image.new("L", (w, h), 0)
    border.paste(255, (0, 0, w, 1))
    border.paste(255, (0, h - 1, w, h))
    border.paste(255, (0, 0, 1, h))
    border.paste(255, (w - 1, 0, w, h))
    edge_hits = ImageChops.multiply(alpha, border).getbbox()
    content_bbox = alpha.getbbox()
    if content_bbox is None:
        problems.append("fully transparent canvas (no content?)")
    elif edge_hits is not None:
        # Content reaches the canvas edge somewhere — flag for crop review
        # (full-canvas garments legitimately touch edges; isolated parts should not).
        problems.append("content touches canvas edge - check crop")
    return problems


def check_canvas(image: Image.Image, expected: tuple[int, int], is_thumbnail: bool) -> list[str]:
    problems: list[str] = []
    if is_thumbnail:
        # Selection-button images have their own small square format (e.g. 180x180,
        # 600x600); they are not master-canvas layers.
        if image.size[0] != image.size[1]:
            problems.append(f"thumbnail not square ({image.size[0]}x{image.size[1]})")
    elif image.size != expected:
        problems.append(f"canvas {image.size[0]}x{image.size[1]} != expected {expected[0]}x{expected[1]}")
    return problems


def check_transparency(image: Image.Image) -> list[str]:
    problems: list[str] = []
    alpha = image.convert("RGBA").getchannel("A")
    extrema = alpha.getextrema()
    if extrema == (255, 255):
        problems.append("alpha channel unused (opaque image)")
    return problems


def check_name(path: Path) -> list[str]:
    problems: list[str] = []
    if not NAME_PATTERN.match(path.name):
        problems.append(f"filename '{path.name}' violates pattern (lowercase letters/numbers/hyphens only)")
    return problems


def make_overlay(image: Image.Image, base: Image.Image, out_dir: Path, name: str) -> Path | None:
    """Composite the asset over the base and save it for visual verification."""
    if image.size != base.size:
        # Still produce the overlay, but note the size mismatch in the filename.
        suffix = "-SIZEMISMATCH"
    else:
        suffix = ""
    canvas = base.convert("RGBA").copy()
    canvas.alpha_composite(image.convert("RGBA"))
    out_path = out_dir / f"overlay-{name}{suffix}.png"
    canvas.save(out_path)
    return out_path


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dir", default="assets/thumbnails", help="directory of artwork to check")
    parser.add_argument("--base", default=None, help="locked base layer image (for overlay output)")
    parser.add_argument("--expected", nargs=2, type=int, default=[2000, 3000], help="expected canvas W H")
    parser.add_argument("--out", default="overlay-output", help="output dir for overlay composites")
    args = parser.parse_args()

    root = Path(args.dir)
    if not root.is_dir():
        print(f"ERROR: directory not found: {root}")
        return 2

    base: Image.Image | None = None
    if args.base:
        base_path = Path(args.base)
        if not base_path.is_file():
            print(f"ERROR: base image not found: {base_path}")
            return 2
        base = Image.open(base_path).convert("RGBA")

    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)

    files = sorted(p for p in root.rglob("*") if p.suffix.lower() in IMAGE_EXTS)
    if not files:
        print(f"NOTE: no .png files found in {root}")
        return 0

    # Thumbnails are the small square selection-button images; anything else is
    # expected to be a full-size master-canvas layer.
    is_thumbnail_dir = "thumbnail" in root.name.lower() or "tn" in root.name.lower()
    is_thumbnail = is_thumbnail_dir

    failures = 0
    for path in files:
        problems: list[str] = []
        with Image.open(path) as image:
            problems += check_format(image)
            problems += check_canvas(image, tuple(args.expected), is_thumbnail)
            problems += check_transparency(image)
            problems += check_name(path)
            if base is not None:
                overlay = make_overlay(image, base, out_dir, path.stem)
                if overlay:
                    pass  # overlay written; report path below
            else:
                overlay = None
        status = "PASS" if not problems else "FAIL"
        if problems:
            failures += 1
        detail = "; ".join(problems) if problems else ("overlay -> " + str(overlay.relative_to(out_dir)) if overlay else "ok")
        print(f"[{status}] {path.name}: {detail}")

    print(f"\n{len(files)} file(s) checked, {failures} failure(s).")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
