import math
import random
from pathlib import Path

import bpy
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "models" / "desktop-experience" / "genosys-athlete-face-bust-final.glb"
REFERENCE_DIR = ROOT / "public" / "images" / "desktop-experience" / "face-references"


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()


def make_material(name, color, roughness=0.55, metallic=0.0, alpha=1.0):
    material = bpy.data.materials.new(name)
    material.diffuse_color = color
    material.use_nodes = True
    bsdf = material.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = color
        bsdf.inputs["Roughness"].default_value = roughness
        bsdf.inputs["Metallic"].default_value = metallic
        bsdf.inputs["Alpha"].default_value = alpha
    if alpha < 1:
        material.blend_method = "BLEND"
        material.use_screen_refraction = True
    return material


def shade_smooth(obj, subdivision=0):
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.shade_smooth()
    if subdivision:
        modifier = obj.modifiers.new(name="beauty_smoothing", type="SUBSURF")
        modifier.levels = subdivision
        modifier.render_levels = subdivision
        bpy.ops.object.modifier_apply(modifier=modifier.name)
    obj.select_set(False)


def sphere(name, location, scale, material, segments=96, rings=48, subdivision=0):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments, ring_count=rings, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    obj.data.materials.append(material)
    shade_smooth(obj, subdivision=subdivision)
    return obj


def cylinder(name, location, radius, depth, material, vertices=96, scale=(1, 1, 1), rotation=(0, 0, 0)):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=location, rotation=rotation)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    obj.data.materials.append(material)
    shade_smooth(obj, subdivision=0)
    return obj


def curve(name, points, material, bevel_depth=0.012, resolution=24):
    data = bpy.data.curves.new(name, type="CURVE")
    data.dimensions = "3D"
    data.resolution_u = resolution
    data.bevel_depth = bevel_depth
    data.bevel_resolution = 5
    spline = data.splines.new("BEZIER")
    spline.bezier_points.add(len(points) - 1)
    for point, coords in zip(spline.bezier_points, points):
        point.co = Vector(coords)
        point.handle_left_type = "AUTO"
        point.handle_right_type = "AUTO"
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(material)
    return obj


def parent_to_root(objects, root):
    for obj in objects:
        obj.parent = root


def build_face():
    clear_scene()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    skin = make_material("GENOSYS warm luminous skin", (0.94, 0.67, 0.56, 1), roughness=0.48)
    skin_shadow = make_material("GENOSYS soft contour skin", (0.82, 0.49, 0.39, 1), roughness=0.56)
    skin_highlight = make_material("GENOSYS satin skin highlight", (1.0, 0.86, 0.78, 0.42), roughness=0.3, alpha=0.42)
    hair = make_material("deep brunette hair", (0.12, 0.07, 0.045, 1), roughness=0.72)
    hair_highlight = make_material("soft brunette hair highlight", (0.34, 0.19, 0.11, 1), roughness=0.66)
    eye_white = make_material("clear eye sclera", (1.0, 0.97, 0.94, 1), roughness=0.18)
    iris = make_material("clear blue iris", (0.31, 0.61, 0.86, 1), roughness=0.22)
    pupil = make_material("deep pupil", (0.02, 0.025, 0.04, 1), roughness=0.14)
    lip_top = make_material("natural rose upper lip", (0.77, 0.36, 0.39, 1), roughness=0.38)
    lip_bottom = make_material("natural rose lower lip", (0.9, 0.52, 0.52, 1), roughness=0.34)
    brow = make_material("defined brunette brow", (0.22, 0.13, 0.09, 1), roughness=0.68)
    blush = make_material("subtle cheek vitality", (1.0, 0.52, 0.5, 0.28), roughness=0.4, alpha=0.28)

    root = bpy.data.objects.new("GENOSYS_final_athletic_face_bust", None)
    bpy.context.collection.objects.link(root)
    root["asset_type"] = "finalized_blender_glb"
    root["reference_dataset"] = str(REFERENCE_DIR.relative_to(ROOT))
    root["notes"] = "Smooth Blender-built bust guided by generated front, profile, three-quarter, back, up, and down references."

    objects = []

    # Body and head volumes use large smooth ellipsoids, matching the clean clinical reference set.
    objects.append(sphere("soft_shoulder_bust", (0, 0.02, -1.35), (1.42, 0.38, 0.26), skin, segments=128, rings=48, subdivision=1))
    objects.append(cylinder("long_elegant_neck", (0, 0.0, -0.88), 0.22, 0.74, skin, vertices=128, scale=(0.72, 0.58, 1.0)))
    objects.append(sphere("face_oval_supermodel_shape", (0, -0.02, 0.05), (0.58, 0.43, 0.83), skin, segments=160, rings=80, subdivision=1))
    objects.append(sphere("soft_chin_definition", (0, -0.34, -0.56), (0.34, 0.12, 0.16), skin_shadow, segments=96, rings=36))

    # Hair cap, swept-back hair mass, and bun taken from the back/profile references.
    objects.append(sphere("sleek_pulled_back_hair_cap", (0, 0.13, 0.2), (0.62, 0.42, 0.72), hair, segments=160, rings=64))
    objects.append(sphere("crown_hair_volume", (0, 0.18, 0.62), (0.46, 0.22, 0.2), hair, segments=96, rings=32))
    objects.append(sphere("neat_athletic_bun", (0, 0.52, 0.36), (0.32, 0.2, 0.3), hair, segments=128, rings=48))
    objects.append(sphere("bun_inner_twist", (0.03, 0.36, 0.39), (0.18, 0.07, 0.17), hair_highlight, segments=96, rings=32))

    for index, x in enumerate([-0.42, -0.3, -0.18, -0.06, 0.06, 0.18, 0.3, 0.42]):
        objects.append(
            curve(
                f"swept_hair_strand_{index + 1}",
                [(x, -0.31, 0.64), (x * 0.7, 0.05, 0.78), (x * 0.3, 0.38, 0.56)],
                hair_highlight if index % 2 == 0 else hair,
                bevel_depth=0.009,
            )
        )

    # Ears.
    objects.append(sphere("left_ear_outer", (-0.58, 0.0, 0.04), (0.08, 0.045, 0.18), skin, segments=64, rings=32))
    objects.append(sphere("right_ear_outer", (0.58, 0.0, 0.04), (0.08, 0.045, 0.18), skin, segments=64, rings=32))
    objects.append(sphere("left_ear_inner", (-0.6, -0.04, 0.035), (0.036, 0.018, 0.095), skin_shadow, segments=48, rings=24))
    objects.append(sphere("right_ear_inner", (0.6, -0.04, 0.035), (0.036, 0.018, 0.095), skin_shadow, segments=48, rings=24))

    # Eyes, brows, and lashes.
    for side, x in [("left", -0.22), ("right", 0.22)]:
        objects.append(sphere(f"{side}_almond_eye_white", (x, -0.405, 0.2), (0.145, 0.026, 0.048), eye_white, segments=80, rings=32))
        objects.append(sphere(f"{side}_blue_iris", (x, -0.432, 0.2), (0.047, 0.014, 0.047), iris, segments=64, rings=24))
        objects.append(sphere(f"{side}_pupil", (x, -0.445, 0.2), (0.018, 0.006, 0.018), pupil, segments=32, rings=16))
        brow_curve = [(-0.13 + x, -0.43, 0.32), (x, -0.45, 0.355), (0.15 + x, -0.42, 0.335)]
        objects.append(curve(f"{side}_arched_brow", brow_curve, brow, bevel_depth=0.011))
        lash_curve = [(-0.12 + x, -0.455, 0.25), (x, -0.468, 0.272), (0.12 + x, -0.455, 0.25)]
        objects.append(curve(f"{side}_soft_lash_line", lash_curve, pupil, bevel_depth=0.006))

    # Nose with bridge, tip, wings, and small nostrils.
    objects.append(sphere("straight_soft_nose_bridge", (0, -0.47, 0.0), (0.07, 0.09, 0.28), skin_shadow, segments=80, rings=36))
    objects.append(sphere("refined_nose_tip", (0, -0.53, -0.18), (0.095, 0.055, 0.07), skin, segments=80, rings=32))
    objects.append(sphere("left_nose_wing", (-0.06, -0.515, -0.2), (0.045, 0.032, 0.038), skin_shadow, segments=48, rings=24))
    objects.append(sphere("right_nose_wing", (0.06, -0.515, -0.2), (0.045, 0.032, 0.038), skin_shadow, segments=48, rings=24))
    objects.append(sphere("left_nostril_detail", (-0.045, -0.552, -0.235), (0.018, 0.008, 0.009), pupil, segments=24, rings=12))
    objects.append(sphere("right_nostril_detail", (0.045, -0.552, -0.235), (0.018, 0.008, 0.009), pupil, segments=24, rings=12))

    # Lips are separated into curved volumes instead of a flat block.
    objects.append(sphere("upper_lip_cupid_bow", (0, -0.465, -0.44), (0.19, 0.034, 0.032), lip_top, segments=96, rings=32))
    objects.append(sphere("lower_lip_soft_volume", (0, -0.472, -0.505), (0.225, 0.04, 0.04), lip_bottom, segments=96, rings=32))
    objects.append(curve("subtle_mouth_line", [(-0.18, -0.505, -0.473), (0, -0.515, -0.482), (0.18, -0.505, -0.473)], brow, bevel_depth=0.005))

    # Skin highlights from the glossy clinical photography references.
    objects.append(sphere("left_cheek_luminous_highlight", (-0.32, -0.44, -0.14), (0.13, 0.012, 0.055), skin_highlight, segments=48, rings=20))
    objects.append(sphere("right_cheek_luminous_highlight", (0.32, -0.44, -0.14), (0.13, 0.012, 0.055), skin_highlight, segments=48, rings=20))
    objects.append(sphere("nose_highlight", (0.0, -0.565, -0.06), (0.028, 0.006, 0.16), skin_highlight, segments=32, rings=16))
    objects.append(sphere("left_subtle_blush", (-0.34, -0.43, -0.2), (0.13, 0.009, 0.055), blush, segments=48, rings=20))
    objects.append(sphere("right_subtle_blush", (0.34, -0.43, -0.2), (0.13, 0.009, 0.055), blush, segments=48, rings=20))

    # Add a few fine neck contours and collarbone references without making it medical/uncanny.
    objects.append(curve("left_collarbone_soft_line", [(-0.58, -0.22, -1.16), (-0.28, -0.34, -1.08), (-0.04, -0.22, -1.06)], skin_highlight, bevel_depth=0.012))
    objects.append(curve("right_collarbone_soft_line", [(0.58, -0.22, -1.16), (0.28, -0.34, -1.08), (0.04, -0.22, -1.06)], skin_highlight, bevel_depth=0.012))

    random.seed(7)
    for index in range(16):
        angle = random.uniform(-0.9, 0.9)
        radius = random.uniform(0.16, 0.31)
        x0 = math.sin(angle) * radius
        z0 = 0.38 + math.cos(angle) * radius * 0.45
        objects.append(
            curve(
                f"bun_twist_detail_{index + 1}",
                [(x0, 0.32, z0), (x0 * 0.45, 0.5, z0 + 0.06), (-x0 * 0.28, 0.41, z0 - 0.02)],
                hair_highlight if index % 3 == 0 else hair,
                bevel_depth=0.006,
            )
        )

    parent_to_root(objects, root)

    bpy.ops.object.light_add(type="AREA", location=(0, -3.2, 3.0))
    key = bpy.context.object
    key.name = "soft_studio_key_light"
    key.data.energy = 450
    key.data.size = 4.0
    key.parent = root

    bpy.ops.object.camera_add(location=(0, -5.2, 0.25), rotation=(math.radians(87), 0, 0))
    camera = bpy.context.object
    bpy.context.scene.camera = camera
    camera.name = "preview_camera"

    for ref in sorted(REFERENCE_DIR.glob("*.png")):
        root[f"reference_{ref.stem}"] = str(ref.relative_to(ROOT))

    bpy.ops.object.select_all(action="DESELECT")
    root.select_set(True)
    for obj in objects:
        obj.select_set(True)

    bpy.ops.export_scene.gltf(
        filepath=str(OUTPUT),
        export_format="GLB",
        use_selection=False,
        export_apply=True,
        export_extras=True,
        export_cameras=False,
        export_lights=False,
    )

    print(f"Generated finalized GLB: {OUTPUT}")


if __name__ == "__main__":
    build_face()
