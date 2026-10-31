"""Altiora conceptual product CGI (original geometry).
Blender 4.x/5.x; no third-party addons and no commercial/product claims.

Run from this experiment root:
  blender -b --python blender/generate-concept.py -- \
    --output public/assets/product-render.png --blend out/concept.blend

Replace with verified product photography/approved CAD before publishing an ad.
"""
import argparse
import math
import os
import sys
from pathlib import Path

import bpy
from mathutils import Vector


def material(name, color, metallic=0.0, roughness=0.35, emission=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nodes = m.node_tree.nodes
    bsdf = nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1.0)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    if emission:
        bsdf.inputs["Emission Color"].default_value = (*color, 1.0)
        bsdf.inputs["Emission Strength"].default_value = emission
    m.diffuse_color = (*color, 1.0)
    return m


def rounded_box(name, location, dimensions, radius, mat):
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = dimensions
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    bevel = obj.modifiers.new("Soft manufactured edge", "BEVEL")
    bevel.width = radius
    bevel.segments = 5
    obj.modifiers.new("Weighted normals", "WEIGHTED_NORMAL")
    obj.data.materials.append(mat)
    return obj


def round_button(name, location, radius, mat):
    bpy.ops.mesh.primitive_cylinder_add(vertices=64, radius=radius, depth=0.085, location=location)
    ob = bpy.context.object
    ob.name = name
    ob.data.materials.append(mat)
    bevel = ob.modifiers.new("Rounded button", "BEVEL")
    bevel.width = 0.025
    bevel.segments = 4
    ob.modifiers.new("Normals", "WEIGHTED_NORMAL")
    return ob


def point_camera(camera, target):
    camera.rotation_euler = (Vector(target) - camera.location).to_track_quat("-Z", "Y").to_euler()


def setup_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    scene.cycles.samples = 32
    scene.render.resolution_x = 1080
    scene.render.resolution_y = 1080
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.film_transparent = True
    scene.world.color = (0.05, 0.05, 0.07)
    if scene.world.use_nodes:
        world_bg = scene.world.node_tree.nodes.get("Background")
        if world_bg:
            world_bg.inputs["Color"].default_value = (0.06, 0.065, 0.12, 1)
            world_bg.inputs["Strength"].default_value = 0.55

    charcoal = material("graphite · polymer body", (0.018, 0.024, 0.055), .36, .27)
    trim = material("anodized edge · violet", (0.27, 0.17, 0.65), .6, .25)
    glass = material("unbranded bezel · glass", (0.009, 0.018, 0.04), .25, .14)
    display = material("abstract cyan screen · not a real game", (0.01, 0.52, 0.78), .04, .3, 1.2)
    stick = material("rubber stick", (0.08, 0.09, 0.14), .1, .62)
    violet = material("purple generic face button", (0.42, 0.22, 0.87), .35, .26)
    cyan = material("cyan generic face button", (0.0, 0.71, 0.85), .25, .27)

    rounded_box("Body - generic handheld (NOT product replica)", (0, 0, 0), (5.5, 2.85, .47), .27, charcoal)
    rounded_box("Thin violet body trim", (0, 0, 0.23), (5.14, 2.55, .12), .19, trim)
    rounded_box("Front graphite face", (0, 0, 0.29), (5.11, 2.51, .12), .19, charcoal)

    rounded_box("Display bezel", (0, 0, 0.366), (2.82, 2.06, .055), .15, glass)
    rounded_box("Display - abstract cyan", (0, 0, 0.40), (2.61, 1.87, .022), .10, display)
    rounded_box("Screen abstract horizon", (0, -.48, .422), (2.27, .08, .008), .02, violet)

    rounded_box("D pad horizontal", (-2.10, -.04, .39), (.87, .31, .07), .06, stick)
    rounded_box("D pad vertical", (-2.10, -.04, .42), (.31, .85, .08), .06, stick)
    for label, x, y, mat in [
        ("A", 2.10, -.33, cyan),
        ("B", 2.48, -.05, violet),
        ("X", 1.75, -.05, violet),
        ("Y", 2.10, .36, cyan),
    ]:
        round_button("Action " + label, (x, y, .397), .20, mat)
    round_button("Analog left", (-1.91, -.86, .41), .29, stick)
    round_button("Analog right", (1.90, -.88, .41), .29, stick)

    bpy.ops.object.camera_add(location=(6.6, -9.8, 8))
    camera = bpy.context.object
    camera.name = "Product camera · editorial 3/4"
    point_camera(camera, (0, 0, .1))
    camera.data.type = "ORTHO"
    camera.data.ortho_scale = 8.25
    scene.camera = camera

    def area(name, loc, power, shape, size, color):
        bpy.ops.object.light_add(type="AREA", location=loc)
        l = bpy.context.object
        l.name = name
        l.data.energy = power
        l.data.shape = shape
        l.data.size = size
        l.data.color = color
        point_camera(l, (0, 0, 0))

    area("Cyan key softbox", (-4, -2, 7), 1100, "DISK", 5.0, (0.54, .85, 1.0))
    area("Purple rim", (4.5, 2.5, 5.6), 1450, "DISK", 3.4, (.75, .48, 1.0))
    area("Warm bounce", (0, -6, 4), 350, "DISK", 5.0, (1.0, .82, .70))
    scene.view_settings.view_transform = "AgX"
    return scene


def main():
    extra = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default="public/assets/product-render.png")
    parser.add_argument("--blend", default="out/concept.blend")
    parser.add_argument("--size", type=int, default=1080, help="Square render size in pixels")
    parser.add_argument("--samples", type=int, default=32, help="Cycles samples")
    opts = parser.parse_args(extra)

    if not (128 <= opts.size <= 4096):
        parser.error("--size must be between 128 and 4096")
    if not (1 <= opts.samples <= 1024):
        parser.error("--samples must be between 1 and 1024")
    scene = setup_scene()
    scene.render.resolution_x = opts.size
    scene.render.resolution_y = opts.size
    scene.cycles.samples = opts.samples
    output = Path(opts.output).resolve()
    blend = Path(opts.blend).resolve()
    output.parent.mkdir(parents=True, exist_ok=True)
    blend.parent.mkdir(parents=True, exist_ok=True)
    scene.render.filepath = str(output)
    bpy.ops.wm.save_as_mainfile(filepath=str(blend))
    bpy.ops.render.render(write_still=True)
    print("Altiora concept render:", output)
    print("Blender source:", blend)
    print("Conceptual asset only. Product authenticity and licensing NOT verified.")


if __name__ == "__main__":
    main()
