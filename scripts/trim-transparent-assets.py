from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageChops


def trim_image(path: Path, padding: int, trim_white: bool) -> str | None:
    with Image.open(path) as image:
        crop_source = image
        output_mode = image.mode

        if image.mode not in ("RGBA", "LA"):
            if "transparency" not in image.info:
                if not trim_white:
                    return None

                rgb = image.convert("RGB")
                background = Image.new("RGB", rgb.size, (255, 255, 255))
                diff = ImageChops.difference(rgb, background)
                diff = diff.point(lambda value: 255 if value > 12 else 0)
                bbox = diff.getbbox()
                if bbox is None:
                    return "skipped-empty"
            else:
                image = image.convert("RGBA")
                crop_source = image
                output_mode = "RGBA"
                alpha = image.getchannel("A")
                bbox = alpha.getbbox()
        else:
            image = image.convert("RGBA")
            crop_source = image
            output_mode = "RGBA"
            alpha = image.getchannel("A")
            bbox = alpha.getbbox()

        if bbox is None:
            return "skipped-empty"

        left, top, right, bottom = bbox
        left = max(0, left - padding)
        top = max(0, top - padding)
        right = min(image.width, right + padding)
        bottom = min(image.height, bottom + padding)

        if (left, top, right, bottom) == (0, 0, image.width, image.height):
            return None

        trimmed = crop_source.crop((left, top, right, bottom))
        if trimmed.mode != output_mode:
            trimmed = trimmed.convert(output_mode)
        trimmed.save(path, optimize=True)
        return f"{image.width}x{image.height} -> {trimmed.width}x{trimmed.height}"


def main() -> None:
    parser = argparse.ArgumentParser(description="Trim transparent or white padding from app-owned image assets.")
    parser.add_argument("roots", nargs="+", type=Path)
    parser.add_argument("--padding", type=int, default=24)
    parser.add_argument("--trim-white", action="store_true", help="Also trim near-white canvas from opaque exports.")
    args = parser.parse_args()

    changed: list[tuple[Path, str]] = []
    skipped_empty: list[Path] = []

    for root in args.roots:
        files = list(root.rglob("*.png")) + list(root.rglob("*.jpg")) + list(root.rglob("*.jpeg"))
        for path in sorted(files):
            result = trim_image(path, args.padding, args.trim_white)
            if result == "skipped-empty":
                skipped_empty.append(path)
            elif result:
                changed.append((path, result))

    for path, result in changed:
        print(f"trimmed {path}: {result}")

    if skipped_empty:
        for path in skipped_empty:
            print(f"skipped empty-transparent {path}")

    print(f"trimmed_count={len(changed)}")


if __name__ == "__main__":
    main()
