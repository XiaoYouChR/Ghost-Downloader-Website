import asyncio, re, subprocess, time
from pathlib import Path

# 直播源：一段真实 H.264/AAC 的 TS 分片，按时钟滑动窗口发布（无 #EXT-X-ENDLIST），
# N_m3u8DL-RE 会把它当真直播录制。分片用 Homebrew ffmpeg 生成一次（应用自带的 ffmpeg 没有编码器）
LIVE = Path("/tmp/gd-live")
SEGMENT_SECONDS, SEGMENT_COUNT, WINDOW = 2, 180, 6
LIVE_RATE = 3_200_000
if not (LIVE / f"seg_{SEGMENT_COUNT - 1:03d}.ts").exists():
    LIVE.mkdir(exist_ok=True)
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
                    "-f", "lavfi", "-i", "testsrc2=size=1920x1080:rate=30",
                    "-f", "lavfi", "-i", "sine=frequency=330:sample_rate=48000",
                    "-t", str(SEGMENT_SECONDS * SEGMENT_COUNT), "-c:v", "libx264", "-preset", "ultrafast",
                    "-b:v", "12M", "-maxrate", "12M", "-bufsize", "6M", "-g", "60", "-sc_threshold", "0",
                    "-c:a", "aac", "-b:a", "128k", "-f", "hls", "-hls_time", str(SEGMENT_SECONDS),
                    "-hls_list_size", "0", "-hls_segment_filename", str(LIVE / "seg_%03d.ts"),
                    str(LIVE / "all.m3u8")], check=True)
START = time.time()


def livePlaylist() -> bytes:
    head = int((time.time() - START) / SEGMENT_SECONDS) + WINDOW
    first = max(0, head - WINDOW)
    lines = ["#EXTM3U", "#EXT-X-VERSION:3", f"#EXT-X-TARGETDURATION:{SEGMENT_SECONDS}",
             f"#EXT-X-MEDIA-SEQUENCE:{first}"]
    for i in range(first, head):
        lines += [f"#EXTINF:{SEGMENT_SECONDS}.000,", f"seg_{i % SEGMENT_COUNT:03d}.ts"]
    return ("\n".join(lines) + "\n").encode()

FILES = {
    # 每条连接的速率；8 个 Subworker 合起来约 170 MB/s（下载中会加开连接） 和 8.4 MB/s
    "/ubuntu-26.04-desktop-amd64.iso": (6_550_000_000, 6_000_000),
    "/blender-5.0.1-macos-arm64.dmg": (318_880_000, 1_050_000),
}
CHUNK = 262144


async def handle(reader, writer):
    head = await reader.readuntil(b"\r\n\r\n")
    lines = head.decode("latin1").split("\r\n")
    method, path, _ = lines[0].split(" ")
    rng = next((re.search(r"bytes=(\d+)-(\d*)", l) for l in lines if l.lower().startswith("range:")), None)
    if path.startswith("/live/"):
        await serveLive(path, method, writer); return
    if path not in FILES:
        writer.write(b"HTTP/1.1 404 Not Found\r\nContent-Length: 0\r\nConnection: close\r\n\r\n")
        await writer.drain(); writer.close(); return
    total, rate = FILES[path]
    start, end = (int(rng.group(1)), int(rng.group(2) or total - 1)) if rng else (0, total - 1)
    status = "206 Partial Content" if rng else "200 OK"
    h = f"HTTP/1.1 {status}\r\nAccept-Ranges: bytes\r\nContent-Length: {end - start + 1}\r\nConnection: close\r\n"
    if rng:
        h += f"Content-Range: bytes {start}-{end}/{total}\r\n"
    writer.write((h + "\r\n").encode())
    if method != "HEAD":
        sent, size = 0, end - start + 1
        block = bytes(CHUNK)
        try:
            while sent < size:
                n = min(CHUNK, size - sent)
                writer.write(block[:n]); await writer.drain()
                sent += n
                await asyncio.sleep(n / rate)
        except (ConnectionError, asyncio.CancelledError):
            pass
    writer.close()


async def serveLive(path, method, writer):
    name = path.split("?")[0][len("/live/"):]
    if name == "index.m3u8":
        body, ctype = livePlaylist(), "application/vnd.apple.mpegurl"
    elif re.fullmatch(r"seg_\d{3}\.ts", name) and (LIVE / name).exists():
        body, ctype = (LIVE / name).read_bytes(), "video/mp2t"
    else:
        writer.write(b"HTTP/1.1 404 Not Found\r\nContent-Length: 0\r\nConnection: close\r\n\r\n")
        await writer.drain(); writer.close(); return
    writer.write(f"HTTP/1.1 200 OK\r\nContent-Type: {ctype}\r\nContent-Length: {len(body)}\r\n"
                 f"Cache-Control: no-cache\r\nConnection: close\r\n\r\n".encode())
    if method != "HEAD":
        try:
            for i in range(0, len(body), CHUNK):
                writer.write(body[i:i + CHUNK]); await writer.drain()
                if ctype == "video/mp2t":
                    await asyncio.sleep(CHUNK / LIVE_RATE)
        except ConnectionError:
            pass
    writer.close()


async def main():
    srv = await asyncio.start_server(handle, "127.0.0.1", 18765)
    async with srv:
        await srv.serve_forever()

asyncio.run(main())
