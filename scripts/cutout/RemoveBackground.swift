// Cuts the studio sweep off a packshot and writes a PNG with a real alpha channel.
//
// WHY A SWIFT SCRIPT IN A NEXT.JS REPO. The catalogue is photographed on flat
// sweeps whose tone drifts from shot to shot, so any panel we paint behind them
// shows a seam. A cut-out has no background to clash with, which is what the
// large beauty retailers ship. Vision's foreground-instance mask is the same
// engine as Preview's Remove Background: it runs offline, needs no model
// download and no Python, and handles the hard part of a packshot, which is the
// soft edge where a glass bottle meets the sweep.
//
// Build once, then run over a list of files:
//   swiftc -O scripts/cutout/RemoveBackground.swift -o /tmp/cutout
//   /tmp/cutout in.jpeg out.png

import Foundation
import Vision
import CoreImage
import AppKit

func fail(_ message: String) -> Never {
    FileHandle.standardError.write((message + "\n").data(using: .utf8)!)
    exit(1)
}

let args = CommandLine.arguments
guard args.count == 3 else { fail("usage: cutout <input> <output.png>") }

let inputURL = URL(fileURLWithPath: args[1])
let outputURL = URL(fileURLWithPath: args[2])

guard let source = CIImage(contentsOf: inputURL) else { fail("cannot read \(args[1])") }

let handler = VNImageRequestHandler(ciImage: source, options: [:])
let request = VNGenerateForegroundInstanceMaskRequest()

do {
    try handler.perform([request])
} catch {
    fail("vision failed on \(args[1]): \(error.localizedDescription)")
}

guard let result = request.results?.first, !result.allInstances.isEmpty else {
    fail("no foreground found in \(args[1])")
}

// allInstances, not the first instance: a kit shot is several bottles and a box,
// and keeping only one of them would silently delete half of what is being sold.
let masked: CVPixelBuffer
do {
    masked = try result.generateMaskedImage(
        ofInstances: result.allInstances,
        from: handler,
        croppedToInstancesExtent: false
    )
} catch {
    fail("masking failed on \(args[1]): \(error.localizedDescription)")
}

let context = CIContext()
let output = CIImage(cvPixelBuffer: masked)

guard let colorSpace = CGColorSpace(name: CGColorSpace.sRGB) else { fail("no sRGB space") }

do {
    try context.writePNGRepresentation(
        of: output,
        to: outputURL,
        format: .RGBA8,
        colorSpace: colorSpace
    )
} catch {
    fail("write failed for \(args[2]): \(error.localizedDescription)")
}

print("ok \(args[2])")
