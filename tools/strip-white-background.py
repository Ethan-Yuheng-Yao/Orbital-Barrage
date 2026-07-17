"""
Strip flat light backgrounds from PNGs (typical white / gray sheet behind sprites).

1) Flood from image edges into "light gray / white" pixels (low saturation, high luminance).
2) Flood from ALL transparent pixels into the same class — removes enclosed pockets of
   background that step (1) can miss.
3) Set RGB to 0 where alpha is 0 (avoids white/colored fringes when compositing).
"""
from __future__ import annotations

import sys
from collections import deque
from pathlib import Path

from PIL import Image


def is_light_background(r: int, g: int, b: int, thresh: int, sat_max: int) -> bool:
    if r < thresh or g < thresh or b < thresh:
        return False
    return max(r, g, b) - min(r, g, b) <= sat_max


def is_pure_black_background(r: int, g: int, b: int) -> bool:
    """Letterbox black only (stricter than dark sprite shading)."""
    return r <= 8 and g <= 8 and b <= 8


def flood_light_background_from_edges(
    px, w: int, h: int, thresh: int, sat_max: int
) -> None:
    seen = [[False] * w for _ in range(h)]
    q: deque[tuple[int, int]] = deque()

    def try_seed(x: int, y: int) -> None:
        if x < 0 or x >= w or y < 0 or y >= h or seen[y][x]:
            return
        r, g, b, a = px[x, y]
        if a < 8:
            seen[y][x] = True
            q.append((x, y))
            return
        if not is_light_background(r, g, b, thresh, sat_max):
            return
        seen[y][x] = True
        q.append((x, y))

    for x in range(w):
        try_seed(x, 0)
        try_seed(x, h - 1)
    for y in range(h):
        try_seed(0, y)
        try_seed(w - 1, y)

    while q:
        x, y = q.popleft()
        r, g, b, a = px[x, y]
        if a >= 8:
            px[x, y] = (r, g, b, 0)
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if nx < 0 or nx >= w or ny < 0 or ny >= h or seen[ny][nx]:
                continue
            r2, g2, b2, a2 = px[nx, ny]
            if a2 < 8:
                seen[ny][nx] = True
                q.append((nx, ny))
                continue
            if is_light_background(r2, g2, b2, thresh, sat_max):
                seen[ny][nx] = True
                q.append((nx, ny))


def flood_pure_black_from_edges(px, w: int, h: int) -> None:
    """Remove #000-style backdrop connected to borders (e.g. boss on black sheet)."""
    seen = [[False] * w for _ in range(h)]
    q: deque[tuple[int, int]] = deque()

    def try_seed(x: int, y: int) -> None:
        if x < 0 or x >= w or y < 0 or y >= h or seen[y][x]:
            return
        r, g, b, a = px[x, y]
        if a < 8:
            seen[y][x] = True
            q.append((x, y))
            return
        if not is_pure_black_background(r, g, b):
            return
        seen[y][x] = True
        q.append((x, y))

    for x in range(w):
        try_seed(x, 0)
        try_seed(x, h - 1)
    for y in range(h):
        try_seed(0, y)
        try_seed(w - 1, y)

    while q:
        x, y = q.popleft()
        r, g, b, a = px[x, y]
        if a >= 8:
            px[x, y] = (r, g, b, 0)
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if nx < 0 or nx >= w or ny < 0 or ny >= h or seen[ny][nx]:
                continue
            r2, g2, b2, a2 = px[nx, ny]
            if a2 < 8:
                seen[ny][nx] = True
                q.append((nx, ny))
                continue
            if is_pure_black_background(r2, g2, b2):
                seen[ny][nx] = True
                q.append((nx, ny))


def expand_pure_black_from_transparency(px, w: int, h: int) -> None:
    seen = [[False] * w for _ in range(h)]
    q: deque[tuple[int, int]] = deque()
    for y in range(h):
        for x in range(w):
            if px[x, y][3] < 8 and not seen[y][x]:
                seen[y][x] = True
                q.append((x, y))
    while q:
        x, y = q.popleft()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if nx < 0 or nx >= w or ny < 0 or ny >= h or seen[ny][nx]:
                continue
            seen[ny][nx] = True
            r2, g2, b2, a2 = px[nx, ny]
            if a2 < 8:
                q.append((nx, ny))
                continue
            if is_pure_black_background(r2, g2, b2):
                px[nx, ny] = (r2, g2, b2, 0)
                q.append((nx, ny))


def expand_light_background_from_transparency(
    px, w: int, h: int, thresh: int, sat_max: int
) -> None:
    seen = [[False] * w for _ in range(h)]
    q: deque[tuple[int, int]] = deque()

    for y in range(h):
        for x in range(w):
            _r, _g, _b, a = px[x, y]
            if a < 8 and not seen[y][x]:
                seen[y][x] = True
                q.append((x, y))

    while q:
        x, y = q.popleft()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if nx < 0 or nx >= w or ny < 0 or ny >= h or seen[ny][nx]:
                continue
            seen[ny][nx] = True
            r2, g2, b2, a2 = px[nx, ny]
            if a2 < 8:
                q.append((nx, ny))
                continue
            if is_light_background(r2, g2, b2, thresh, sat_max):
                px[nx, ny] = (r2, g2, b2, 0)
                q.append((nx, ny))


def zero_rgb_when_transparent(px, w: int, h: int) -> None:
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 8:
                px[x, y] = (0, 0, 0, 0)


def process_png(path: Path) -> None:
    img = Image.open(path).convert("RGBA")
    w, h = img.size
    px = img.load()
    # Tunables: light gray “sheet” backdrops; keeps saturated sprite colors.
    thresh, sat_max = 228, 52
    flood_light_background_from_edges(px, w, h, thresh, sat_max)
    expand_light_background_from_transparency(px, w, h, thresh, sat_max)
    flood_pure_black_from_edges(px, w, h)
    expand_pure_black_from_transparency(px, w, h)
    zero_rgb_when_transparent(px, w, h)
    img.save(path, optimize=True)
    print(f"Updated {path}")


def main() -> None:
    root = Path(__file__).resolve().parent.parent
    graphics = root / "graphics"
    for name in ("bosslaser.png", "enemydrone.png"):
        p = graphics / name
        if not p.is_file():
            print(f"Skip (missing): {p}", file=sys.stderr)
            continue
        process_png(p)


if __name__ == "__main__":
    main()
