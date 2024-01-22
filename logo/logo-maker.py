from PIL import Image, ImageDraw

blue = "#4285f4"

im = Image.new("RGBA", (256, 256))
draw = ImageDraw.Draw(im)

draw.ellipse((0, 0, 256, 256), blue)

# draw.line((10, 10, 100, 10), "#fff", 10, joint="curve")

# thickness
TH = 10


def yan(x: int, y: int):
    draw.rounded_rectangle((x - 15, y, x + 15, y + TH), TH, "#fff")

    draw.rounded_rectangle((x - 50, y + 20, x + 50, y + 20 + TH), TH, "#fff")

    draw.rounded_rectangle((x - 30, y + 40, x + 30, y + 40 + TH), TH, "#fff")
    draw.rounded_rectangle((x - 30, y + 60, x + 30, y + 60 + TH), TH, "#fff")

    draw.rounded_rectangle(
        (x - 30, y + 80, x + 30, y + 80 + 40), TH, outline="#fff", width=TH
    )


def mai(x: int, y: int):
    draw.rounded_rectangle((x - 20, y, x + 20, y + TH), TH, "#fff")
    draw.rounded_rectangle((x - 5, y - 10, x + 5, y + 10 + TH), TH, "#fff")

    draw.rounded_rectangle(
        (x - 40, y + 10 + TH - 2, x + 40, y + 10 + TH + TH - 2), TH, "#fff"
    )

    draw.line()


yan(60, 70)
mai(200, 70)


im.save("logo.png")
