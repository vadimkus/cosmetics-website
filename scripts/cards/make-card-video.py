#!/usr/bin/env python3
"""Turn a chosen Seedance take into a product-card hover loop and check it against the card photo.

Cuts [start, start+dur), scales to 600x600, encodes H.264 (yuv420p, no audio, faststart), drops every
metadata atom and the encoder tag, then reports:
  - size (target 150-300 KB),
  - forbidden bytes left in the file (c2pa / jumb / CapCut / Lavf / x264),
  - mean abs difference of frame 1 and of the last frame against the photo (the swap is only invisible
    when frame 1 matches; the loop is only seamless when the last frame does too).

usage: make-card-video.py <take.mp4> <photo.jpg> <out.mp4> [--start 0] [--dur 4] [--crf 26]
"""
import argparse
import os
import subprocess
import tempfile

import numpy as np
from PIL import Image

FORBIDDEN = [b'c2pa', b'jumb', b'CapCut', b'Lavf', b'x264', b'Lavc']
SIZE = 600


def run(cmd):
    subprocess.run(cmd, check=True, capture_output=True)


def frame(path, at, d):
    out = f'{d}/f_{at}.png'
    run(['ffmpeg', '-y', '-sseof' if at == 'last' else '-ss', '-0.05' if at == 'last' else '0', '-i', path,
         '-frames:v', '1', out])
    return np.asarray(Image.open(out).convert('RGB').resize((SIZE, SIZE))).astype(np.float32)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('take')
    ap.add_argument('photo')
    ap.add_argument('out')
    ap.add_argument('--start', type=float, default=0)
    ap.add_argument('--dur', type=float, default=4)
    ap.add_argument('--crf', type=int, default=26)
    a = ap.parse_args()

    os.makedirs(os.path.dirname(a.out), exist_ok=True)
    run(['ffmpeg', '-y', '-ss', str(a.start), '-t', str(a.dur), '-i', a.take,
         '-vf', f'scale={SIZE}:{SIZE}:flags=lanczos,format=yuv420p', '-an',
         '-c:v', 'libx264', '-preset', 'veryslow', '-crf', str(a.crf), '-profile:v', 'high',
         '-x264-params', 'no-info=1', '-map_metadata', '-1', '-map_chapters', '-1',
         '-fflags', '+bitexact', '-flags:v', '+bitexact', '-movflags', '+faststart', a.out + '.tmp.mp4'])
    # x264 writes its settings as an SEI unit and the muxer names the compressor: a copy pass drops both.
    run(['ffmpeg', '-y', '-i', a.out + '.tmp.mp4', '-c', 'copy', '-bsf:v', 'filter_units=remove_types=6',
         '-map_metadata', '-1', '-metadata:s:v', 'encoder=', '-metadata:s:v', 'handler_name=',
         '-fflags', '+bitexact', '-flags:v', '+bitexact', '-movflags', '+faststart', a.out])
    os.remove(a.out + '.tmp.mp4')

    data = open(a.out, 'rb').read()
    left = [m.decode() for m in FORBIDDEN if m in data]
    photo = np.asarray(Image.open(a.photo).convert('RGB').resize((SIZE, SIZE), Image.LANCZOS)).astype(np.float32)
    with tempfile.TemporaryDirectory() as d:
        first, last = frame(a.out, '0', d), frame(a.out, 'last', d)
    print(f'{a.out}: {len(data) // 1024} KB, forbidden bytes: {left or "none"}')
    print(f'frame 1 vs photo: {np.abs(first - photo).mean():.2f}   last vs photo: {np.abs(last - photo).mean():.2f}'
          '   (under ~3 reads as the same picture)')


if __name__ == '__main__':
    main()
