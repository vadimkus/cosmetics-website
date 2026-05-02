import math
from pathlib import Path

import bpy
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "models" / "desktop-experience" / "genosys-athlete-face-hero-real.glb"
TEXTURE = ROOT / "public" / "images" / "desktop-experience" / "face-references" / "genosys-athlete-face-ref-front-down.png"
SIDE_TEXTURE = ROOT / "public" / "images" / "desktop-experience" / "genosys-athlete-face-three-quarter.png"


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()


def create_image_material(name, image_path, roughness=0.42):
    material = bpy.data.materials.new(name)
    material.use_nodes = True
    material.diffuse_color = (1, 1, 1, 1)

    nodes = material.node_tree.nodes
    bsdf = nodes.get("Principled BSDF")
    image = bpy.data.images.load(str(image_path))
    texture = nodes.new("ShaderNodeTexImage")
    texture.image = image
    texture.extension = "EXTEND"

    material.node_tree.links.new(texture.outputs["Color"], bsdf.inputs["Base Color"])
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = 0
    return material


def create_material(name, color, roughness=0.55, alpha=1.0):
    material = bpy.data.materials.new(name)
    material.diffuse_color = color
    material.use_nodes = True
    bsdf = material.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = color
        bsdf.inputs["Roughness"].default_value = roughness
        bsdf.inputs["Alpha"].default_value = alpha
    if alpha < 1:
        material.blend_method = "BLEND"
    return material


def create_curved_photo_mesh(name, width, height, material, segments_x=80, segments_y=48, curve_depth=0.10):
    vertices = []
    uvs = []
    faces = []

    for y_index in range(segments_y + 1):
        v = y_index / segments_y
        y = (v - 0.5) * height
        for x_index in range(segments_x + 1):
            u = x_index / segments_x
            x = (u - 0.5) * width
            edge_curve = math.cos((u - 0.5) * math.pi)
            vertical_curve = 0.92 + 0.08 * math.cos((v - 0.5) * math.pi)
            depth = -curve_depth * edge_curve * vertical_curve
            # Blender exports Z-up to glTF Y-up. Keep the portrait vertical on
            # Blender Z so it faces a Three.js camera on the Z axis after export.
            vertices.append((x, depth, y))
            uvs.append((u, v))

    for y_index in range(segments_y):
        for x_index in range(segments_x):
            a = y_index * (segments_x + 1) + x_index
            b = a + 1
            c = a + segments_x + 2
            d = a + segments_x + 1
            faces.append((a, b, c, d))

    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(vertices, [], faces)
    mesh.update()

    uv_layer = mesh.uv_layers.new(name="portrait_uv")
    for polygon in mesh.polygons:
        for loop_index in polygon.loop_indices:
            vertex_index = mesh.loops[loop_index].vertex_index
            uv_layer.data[loop_index].uv = uvs[vertex_index]

    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(material)
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.shade_smooth()
    obj.select_set(False)
    return obj


def create_photo_plane(name, width, height, material):
    vertices = [
        (-width / 2, 0, -height / 2),
        (width / 2, 0, -height / 2),
        (width / 2, 0, height / 2),
        (-width / 2, 0, height / 2),
    ]
    faces = [(0, 1, 2, 3)]
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(vertices, [], faces)
    mesh.update()

    uv_layer = mesh.uv_layers.new(name="portrait_uv")
    uvs = [(0, 0), (1, 0), (1, 1), (0, 1)]
    for polygon in mesh.polygons:
        for loop_index in polygon.loop_indices:
            vertex_index = mesh.loops[loop_index].vertex_index
            uv_layer.data[loop_index].uv = uvs[vertex_index]

    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(material)
    return obj


def create_rounded_frame(width, height, z, material):
    bevel = 0.08
    depth = 0.035
    frame = bpy.data.objects.new("soft_rose_gold_portrait_frame", None)
    bpy.context.collection.objects.link(frame)

    def bar(name, loc, scale):
        bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
        obj = bpy.context.object
        obj.name = name
        obj.scale = scale
        obj.data.materials.append(material)
        obj.parent = frame
        return obj

    bar("frame_top", (0, z, height / 2 + bevel), (width / 2 + bevel, depth, depth))
    bar("frame_bottom", (0, z, -height / 2 - bevel), (width / 2 + bevel, depth, depth))
    bar("frame_left", (-width / 2 - bevel, z, 0), (depth, depth, height / 2 + bevel))
    bar("frame_right", (width / 2 + bevel, z, 0), (depth, depth, height / 2 + bevel))
    return frame


def create_curve(name, points, material, bevel_depth=0.01):
    data = bpy.data.curves.new(name, type="CURVE")
    data.dimensions = "3D"
    data.resolution_u = 32
    data.bevel_depth = bevel_depth
    data.bevel_resolution = 4
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


def build():
    clear_scene()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    portrait_material = create_image_material("actual_generated_lady_face_texture", TEXTURE)
    side_material = create_image_material("three_quarter_reference_texture", SIDE_TEXTURE)
    frame_material = create_material("soft rose gold frame", (1.0, 0.73, 0.71, 1), roughness=0.32)
    molecule_material = create_material("GENOSYS soft red molecule", (0.92, 0.18, 0.16, 1), roughness=0.35)
    pearl_material = create_material("skin science pearl molecule", (0.98, 0.78, 0.83, 1), roughness=0.28)
    ring_material = create_material("transparent skin analysis ring", (1.0, 0.78, 0.83, 0.42), roughness=0.3, alpha=0.42)

    root = bpy.data.objects.new("GENOSYS_real_lady_face_hero", None)
    bpy.context.collection.objects.link(root)
    root["asset_type"] = "textured_glb_hero"
    root["primary_reference"] = str(TEXTURE.relative_to(ROOT))
    root["reason"] = "Uses the actual generated beauty reference, not the mannequin procedural face."

    main = create_photo_plane("real_generated_lady_face_glb_portrait", 4.5, 2.78, portrait_material)
    main.parent = root
    main.location = (0, 0.02, 0)

    # Minimal 3D cosmetic-science atmosphere around the image.
    for index, (x, y, z, radius, mat) in enumerate(
        [
            (-2.05, -0.16, 0.86, 0.085, pearl_material),
            (-1.82, -0.22, 0.62, 0.055, molecule_material),
            (1.92, -0.18, 0.86, 0.07, pearl_material),
            (2.14, -0.25, 0.58, 0.105, molecule_material),
            (-1.96, -0.14, -0.8, 0.052, pearl_material),
        ]
    ):
        bpy.ops.mesh.primitive_uv_sphere_add(segments=48, ring_count=24, radius=radius, location=(x, y, z))
        obj = bpy.context.object
        obj.name = f"floating_skin_science_orb_{index + 1}"
        obj.data.materials.append(mat)
        obj.parent = root
        bpy.ops.object.shade_smooth()

    bpy.ops.export_scene.gltf(
        filepath=str(OUTPUT),
        export_format="GLB",
        use_selection=False,
        export_apply=True,
        export_extras=True,
        export_cameras=False,
        export_lights=False,
    )
    print(f"Generated real lady face GLB: {OUTPUT}")


if __name__ == "__main__":
    build()
