#!/usr/bin/env python3
"""Lift only the moving light out of a Seedance take and lay it over the real card photo.

Seedance redraws the pack (colours drift, small print softens, a CapCut "Ai" badge sits top-left), so
the take itself never ships. Each output frame is

    photo + gain * blur(take[n] - take[start])

with the difference blurred to light-band scale, optionally kept only where it brightens (so text the
model greyed out stays printed), the badge corner zeroed, and the last --fade seconds easing back to
the photo so the hover loop has no seam. Frame 1 is the photo itself. Writes a lossless FFV1 .mkv for
make-card-video.py (run that with --start 0 --dur <end-start>).

Needs cv2 (~/.venvs/capcut/bin/python).

usage: light-pass.py <take.mp4> <photo.jpg> <out.mkv> [--start 0.5] [--end 4.5] [--fade 0.4]
                     [--blur 2.5] [--gain 1] [--brighten-only] [--badge 150x115]
"""
import argparse
import json
import subprocess

import cv2
import numpy as np


def probe(path):
    out = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries',
                          'stream=width,height,r_frame_rate', '-of', 'json', path],
                         check=True, capture_output=True, text=True).stdout
    s = json.loads(out)['streams'][0]
    num, den = s['r_frame_rate'].split('/')
    return s['width'], s['height'], float(num) / float(den)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('take')
    ap.add_argument('photo')
    ap.add_argument('out')
    ap.add_argument('--start', type=float, default=0.5)
    ap.add_argument('--end', type=float, default=4.5)
    ap.add_argument('--fade', type=float, default=0.4)
    ap.add_argument('--blur', type=float, default=2.5)
    ap.add_argument('--gain', type=float, default=1.0)
    ap.add_argument('--brighten-only', action='store_true')
    ap.add_argument('--badge', default='150x115', help='top-left corner held at the photo, WxH at take size')
    a = ap.parse_args()

    w, h, fps = probe(a.take)
    bw, bh = (int(v) for v in a.badge.split('x'))
    photo = cv2.cvtColor(cv2.imread(a.photo), cv2.COLOR_BGR2RGB)
    photo = cv2.resize(photo, (w, h), interpolation=cv2.INTER_LANCZOS4).astype(np.float32)

    dec = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', a.take, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
                           stdout=subprocess.PIPE)
    enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24',
                            '-s', f'{w}x{h}', '-r', f'{fps:g}', '-i', '-', '-c:v', 'ffv1', a.out],
                           stdin=subprocess.PIPE)
    first, end = int(round(a.start * fps)), int(round(a.end * fps))
    fade_from = end - int(round(a.fade * fps))
    ref, peak, n = None, 0.0, 0
    while True:
        buf = dec.stdout.read(w * h * 3)
        if len(buf) < w * h * 3:
            break
        if first <= n < end:
            f = np.frombuffer(buf, np.uint8).reshape(h, w, 3).astype(np.float32)
            if ref is None:
                ref = f
            delta = f - ref
            if a.brighten_only:
                delta = np.maximum(delta, 0)
            delta = cv2.GaussianBlur(delta, (0, 0), a.blur) * a.gain
            delta[:bh, :bw] = 0
            if n >= fade_from:
                delta *= 1 - (n - fade_from + 1) / (end - fade_from)
            peak = max(peak, float(np.abs(delta).max()))
            enc.stdin.write(np.clip(photo + delta + 0.5, 0, 255).astype(np.uint8).tobytes())
        n += 1
    enc.stdin.close()
    enc.wait()
    dec.wait()
    print(f'{a.out}: frames {first}..{end - 1} at {fps:g} fps, fade from {fade_from}, peak light {peak:.0f}')


if __name__ == '__main__':
    main()
