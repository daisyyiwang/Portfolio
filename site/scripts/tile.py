# Split full-page screenshots into viewable tiles: tile.py <png> [tile_h]
import sys
from PIL import Image
p = sys.argv[1]; th = int(sys.argv[2]) if len(sys.argv) > 2 else 1800
im = Image.open(p); w, h = im.size
for i, y in enumerate(range(0, h, th)):
    t = im.crop((0, y, w, min(h, y + th)))
    if w > 1000: t = t.resize((int(w * 0.6), int(t.height * 0.6)))
    t.save(p.replace('.png', f'.t{i}.png'))
    print(p.replace('.png', f'.t{i}.png'))
