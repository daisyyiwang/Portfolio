"""Generates the original Resort-direction artwork (tropical wallpaper tile + palm silhouette).
Run: python3 scripts/make-resort-assets.py  -> public/images/resort/*.svg
"""
import math, os

OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'images', 'resort')
LEAF, LEAF_DARK, FLOWER, GOLD, INK = '#2f6b4f', '#24543e', '#e8735c', '#d9a441', '#1d2b25'
T = 240  # tile size


def monstera():
    # Heart-shaped leaf; slits and midrib are holes via evenodd.
    outline = 'M0,-46 C34,-50 60,-22 58,8 C56,40 28,58 0,50 C-28,58 -56,40 -58,8 C-60,-22 -34,-50 0,-46 Z'
    holes = ['M-1.5,-40 L1.5,-40 L1.5,46 L-1.5,46 Z']
    for side in (-1, 1):
        for i, y in enumerate((-30, -12, 6, 24)):
            x0, x1 = side * 10, side * (58 - abs(y) * 0.3)
            w = 2.2 + i * 0.3
            holes.append(f'M{x0},{y} L{x1},{y - 8 - w} L{x1},{y - 8 + w} Z')
        holes.append(f'M{side*22},{-4} m-3,0 a3,4 0 1,0 6,0 a3,4 0 1,0 -6,0')
    return f'<path fill="{LEAF}" fill-rule="evenodd" d="{outline} {" ".join(holes)}"/>'


def frond(length=110):
    parts = [f'<path d="M0,0 Q8,{-length/2} 0,{-length}" stroke="{LEAF_DARK}" stroke-width="2.4" fill="none"/>']
    n = 11
    for i in range(1, n):
        t = i / n
        y = -length * t
        x = 8 * math.sin(math.pi * t) * 0.9
        l = 34 * (1 - t * 0.75)
        for side in (-1, 1):
            ang = side * (58 - t * 20)
            parts.append(f'<ellipse cx="{x + side * l/2 * math.sin(math.radians(abs(ang)))}" cy="{y - l/2 * math.cos(math.radians(abs(ang)))}" rx="3.2" ry="{l/2}" fill="{LEAF_DARK}" transform="rotate({ang} {x + side * l/2 * math.sin(math.radians(abs(ang)))} {y - l/2 * math.cos(math.radians(abs(ang)))})"/>')
    return ''.join(parts)


def hibiscus():
    petals = ''.join(
        f'<ellipse cx="0" cy="-15" rx="11" ry="16" fill="{FLOWER}" transform="rotate({i*72})"/>' for i in range(5))
    return (petals + f'<circle r="5" fill="{GOLD}"/>'
            f'<path d="M0,0 L14,-20" stroke="{GOLD}" stroke-width="2" stroke-linecap="round"/>'
            f'<circle cx="14" cy="-20" r="2.6" fill="{GOLD}"/>')


def eye():
    # The resort is always watching.
    return (f'<path d="M-11,0 Q0,-9 11,0 Q0,9 -11,0 Z" fill="{GOLD}"/>'
            f'<circle r="3.6" fill="{INK}"/><circle cx="1.2" cy="-1.2" r="1" fill="#fff"/>')


def leaflet():
    return f'<path d="M0,0 C10,-10 26,-10 34,0 C26,10 10,10 0,0 Z" fill="{LEAF}"/>'


def place(svg, x, y, rot=0, s=1):
    out = []
    for dx in (-T, 0, T):
        for dy in (-T, 0, T):
            out.append(f'<g transform="translate({x+dx} {y+dy}) rotate({rot}) scale({s})">{svg}</g>')
    return ''.join(out)


items = [
    place(monstera(), 62, 70, -18, 0.95),
    place(frond(), 186, 228, 32, 1),
    place(frond(96), 160, 22, 205, 1),
    place(hibiscus(), 188, 120, 10, 1),
    place(hibiscus(), 46, 196, -30, 0.7),
    place(leaflet(), 104, 168, -40, 1),
    place(leaflet(), 112, 172, 30, 0.8),
    place(eye(), 128, 112, -8, 1),
    place(leaflet(), 4, 128, 110, 0.7),
]
wallpaper = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{T}" height="{T}" viewBox="0 0 {T} {T}">'
             + ''.join(items) + '</svg>')

# Palm silhouette (single colour; used as a CSS mask)
p = ['<path d="M118,400 C126,320 132,240 150,150 L160,152 C146,244 140,322 136,400 Z"/>']
for y in range(170, 400, 22):
    p.append(f'<path d="M{150 - (y-150)*0.13},{y} l20,-3 l-1,6 z" />')
for ang, ln in [(-160, 120), (-130, 135), (-100, 110), (-60, 130), (-25, 125), (10, 105), (-200, 95)]:
    a = math.radians(ang)
    ex, ey = 155 + ln * math.cos(a), 150 + ln * math.sin(a) + ln * 0.35
    cx, cy = 155 + ln * 0.55 * math.cos(a), 150 + ln * 0.55 * math.sin(a) - 30
    p.append(f'<path d="M155,150 Q{cx},{cy} {ex},{ey} Q{cx + 4},{cy + 40} 155,162 Z"/>')
    for k in range(1, 9):
        t = k / 9
        bx = (1-t)**2*155 + 2*(1-t)*t*cx + t*t*ex
        by = (1-t)**2*150 + 2*(1-t)*t*cy + t*t*ey
        p.append(f'<path d="M{bx:.1f},{by:.1f} l{12*math.cos(a+1.9):.1f},{22*(1-t)+8:.1f} l5,-3 z"/>')
p.append('<circle cx="148" cy="160" r="7"/><circle cx="160" cy="163" r="6"/>')
palm = ('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400" fill="#000">'
        + ''.join(p) + '</svg>')

os.makedirs(OUT, exist_ok=True)
open(os.path.join(OUT, 'wallpaper.svg'), 'w').write(wallpaper)
open(os.path.join(OUT, 'palm.svg'), 'w').write(palm)
print('wrote', os.listdir(OUT))
