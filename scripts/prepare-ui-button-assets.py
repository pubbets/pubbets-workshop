from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image


BUTTON_DIR = Path("assets/ui/buttons")


def is_edge_background(pixel: tuple[int, int, int, int]) -> bool:
    red, green, blue, alpha = pixel
    if alpha == 0:
        return True
    is_white_canvas = red >= 238 and green >= 238 and blue >= 238 and max(red, green, blue) - min(red, green, blue) <= 16
    is_canva_green_screen = green >= 210 and red <= 45 and blue <= 45
    return is_white_canvas or is_canva_green_screen


def remove_connected_edge_background(path: Path, output_path: Path) -> str:
    image = Image.open(path).convert("RGBA")
    width, height = image.size
    pixels = image.load()
    visited: set[tuple[int, int]] = set()
    queue: deque[tuple[int, int]] = deque()

    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height - 1))
    for y in range(height):
        queue.append((0, y))
        queue.append((width - 1, y))

    while queue:
        x, y = queue.popleft()
        if (x, y) in visited:
            continue
        visited.add((x, y))
        if not is_edge_background(pixels[x, y]):
            continue

        pixels[x, y] = (255, 255, 255, 0)
        if x > 0:
            queue.append((x - 1, y))
        if x < width - 1:
            queue.append((x + 1, y))
        if y > 0:
            queue.append((x, y - 1))
        if y < height - 1:
            queue.append((x, y + 1))

    bbox = image.getchannel("A").getbbox()
    if bbox:
        image = image.crop(bbox)

    image.save(output_path, optimize=True)
    return f"{path.name}: {width}x{height} -> {image.width}x{image.height}"


def main() -> None:
    sources = (
        sorted(BUTTON_DIR.glob("*-export.jpg"))
        + sorted(BUTTON_DIR.glob("ui-button-skip-this-step-source.jpg"))
        + sorted(BUTTON_DIR.glob("ui-button-no-thanks-source.png"))
    )
    for source in sources:
        output = source.with_name(
            source.name
            .replace("-export.jpg", "-clean.png")
            .replace("-source.jpg", "-clean.png")
            .replace("-source.png", "-clean.png")
        )
        print(remove_connected_edge_background(source, output))


if __name__ == "__main__":
    main()
