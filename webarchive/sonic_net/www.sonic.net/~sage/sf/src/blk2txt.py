#!/usr/bin/env python3
"""Convert Forth block files (1024-byte blocks, 16 lines x 64 chars, no
line terminators) into readable text files.

Each block becomes a "---- Screen N ----" section of 16 lines with trailing
spaces stripped. Blocks containing non-text bytes are emitted as a hex dump.
Output goes to <dir>/AsText/<BASENAME>.TXT next to each source file, matching
the AsText folders described in readme.txt.

Usage: python3 blk2txt.py            (run from the src directory)
"""
import glob
import os

BLOCK = 1024
LINE = 64


def is_text(block):
    return all(0x20 <= b <= 0x7E or b == 0 for b in block)


def hexdump(block):
    out = []
    for off in range(0, len(block), 16):
        chunk = block[off:off + 16]
        hexpart = ' '.join(f'{b:02X}' for b in chunk)
        asc = ''.join(chr(b) if 0x20 <= b <= 0x7E else '.' for b in chunk)
        out.append(f'{off:04X}  {hexpart:<47}  {asc}')
    return out


def convert_block_file(path):
    data = open(path, 'rb').read()
    # A trailing DOS EOF marker (^Z) is not part of the block data.
    if len(data) % BLOCK == 1 and data[-1] == 0x1A:
        data = data[:-1]
    if len(data) % BLOCK:
        raise ValueError(f'{path}: size {len(data)} is not a multiple of {BLOCK}')

    out = [f'( Converted from {os.path.basename(path)}: '
           f'{len(data) // BLOCK} blocks of 16 x 64 )', '']
    for n in range(len(data) // BLOCK):
        block = data[n * BLOCK:(n + 1) * BLOCK]
        if not block.strip(b' \0'):
            out += [f'---- Screen {n} ---- (blank)', '']
            continue
        if not is_text(block):
            out.append(f'---- Screen {n} ---- (binary data, hex dump)')
            out += hexdump(block)
            out.append('')
            continue
        out.append(f'---- Screen {n} ----')
        # NULs appear as padding in a few blocks; treat them as spaces.
        text = block.replace(b'\0', b' ').decode('ascii')
        out += [text[i:i + LINE].rstrip() for i in range(0, BLOCK, LINE)]
        out.append('')
    return '\n'.join(out)


def convert_cr_text(path):
    # CR-only line endings -> LF, trailing spaces stripped.
    text = open(path, 'rb').read().decode('ascii')
    lines = text.replace('\r\n', '\r').split('\r')
    return '\n'.join(l.rstrip() for l in lines).rstrip('\n') + '\n'


def write(dest, text):
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    with open(dest, 'w', newline='\n') as f:
        f.write(text if text.endswith('\n') else text + '\n')
    print(dest)


def main():
    for path in sorted(glob.glob('Disk-*/*.CMP') + glob.glob('Disk-*/*.BLK')):
        base = os.path.splitext(os.path.basename(path))[0]
        write(os.path.join(os.path.dirname(path), 'AsText', base + '.TXT'),
              convert_block_file(path))
    write(os.path.join('AsText', 'DISYS-Public.TXT'),
          convert_cr_text('DISYS-Public.TXT'))


if __name__ == '__main__':
    main()
