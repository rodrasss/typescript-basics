import math, sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont
W = 1080
out = sys.argv[1]
font_path = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
img = Image.new("RGB", (W, W))
d = ImageDraw.Draw(img)
# céu: roxo → rosa → laranja (pôr do sol "Vice City")
top, mid, bot = (40, 12, 84), (232, 54, 140), (255, 150, 60)
for y in range(W):
    t = y / (W - 1)
    a, b, u = (top, mid, t / 0.55) if t < 0.55 else (mid, bot, (t - 0.55) / 0.45)
    d.line([(0, y), (W, y)], fill=tuple(int(a[i] + (b[i] - a[i]) * u) for i in range(3)))
# sol retrô com faixas
sun = Image.new("L", (W, W), 0)
sd = ImageDraw.Draw(sun)
cx, cy, r = W // 2, 600, 300
sd.ellipse([cx - r, cy - r, cx + r, cy + r], fill=255)
for k in range(7):
    y0 = cy + 40 + k * 38
    sd.rectangle([0, y0, W, y0 + 6 + k * 3], fill=0)
sun_col = Image.new("RGB", (W, W), (255, 214, 90))
img.paste(sun_col, (0, 0), sun.filter(ImageFilter.GaussianBlur(1)))
# palmeiras (silhueta)
def palm(x, base, h, lean):
    p = ImageDraw.Draw(img)
    pts = []
    for i in range(21):
        t = i / 20
        pts.append((x + lean * t * t, base - h * t))
    for i in range(len(pts) - 1):
        w = 26 - i
        p.line([pts[i], pts[i + 1]], fill=(25, 8, 45), width=max(8, w))
    tx, ty = pts[-1]
    for ang in (-160, -130, -100, -70, -40, -15, 15):
        a = math.radians(ang)
        leaf = [(tx, ty)]
        for j in range(1, 9):
            s = j / 8
            leaf.append((tx + math.cos(a) * 170 * s, ty + math.sin(a) * 170 * s + 70 * s * s))
        p.line(leaf, fill=(25, 8, 45), width=18, joint="curve")
palm(150, 1080, 520, 60)
palm(940, 1080, 470, -70)
# chão escuro
d.rectangle([0, 930, W, W], fill=(25, 8, 45))
# texto
def text_center(txt, y, size, fill, stroke):
    f = ImageFont.truetype(font_path, size)
    bbox = d.textbbox((0, 0), txt, font=f, stroke_width=stroke)
    x = (W - (bbox[2] - bbox[0])) // 2 - bbox[0]
    d.text((x, y), txt, font=f, fill=fill, stroke_width=stroke, stroke_fill=(25, 8, 45))
text_center("CORTES", 250, 190, (255, 255, 255), 14)
text_center("GTA 6  •  RP", 470, 92, (255, 232, 120), 10)
img.save(out, quality=95)
img.resize((200, 200), Image.LANCZOS).save(out.replace(".png", "-200.png"))
print("ok", out)
