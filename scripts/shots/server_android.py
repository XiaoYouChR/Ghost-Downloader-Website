# Android 截图用的本地服务器（端口 18766，经 adb reverse 给手机）：
# 限速 HTTP Range 文件、滑动窗口的直播 HLS、给 bt_seed.py 指路的 BT tracker
import asyncio, re, sys, time
from pathlib import Path

PORT = 18766
SEEDER_PORT = 6886
LIVE = Path("/tmp/gdlive")  # ffmpeg 切好的 seg000.ts … 循环播放
SEGMENT_SECONDS = 4
WINDOW = 6

FILES = {
    # 每个文件的总速率，由当前连接平分（GD 会自动加连接，按连接限速会被放大到几十 MB/s）
    "/ubuntu-26.04-desktop-amd64.iso": (6_550_000_000, 3_000_000),
    "/blender-5.0.1-macos-arm64.dmg": (318_880_000, 5_000_000),
    "/Ghost-Downloader-v4.4.0-Linux-x86_64.AppImage": (81_631_736, 20_000_000),
    "/python-3.14.4-macos11.pkg": (72_400_000, 20_000_000),
    "/Ghost-Downloader-v4.4.0-Windows-x86_64-Setup.exe": (43_851_384, 20_000_000),
    "/Ghost-Downloader-v4.4.0-macOS-arm64.dmg": (64_208_917, 20_000_000),
}
CHUNK = 65536
START = time.time()
ACTIVE: dict[str, int] = {}
SEGMENTS = sorted(LIVE.glob("seg*.ts"))


def playlist() -> bytes:
    head = int((time.time() - START) / SEGMENT_SECONDS) + WINDOW
    first = head - WINDOW
    lines = ["#EXTM3U", "#EXT-X-VERSION:3", f"#EXT-X-TARGETDURATION:{SEGMENT_SECONDS}",
             f"#EXT-X-MEDIA-SEQUENCE:{first}"]
    for i in range(first, head):
        lines += [f"#EXTINF:{SEGMENT_SECONDS}.000,", f"/live/{i}.ts"]
    return ("\n".join(lines) + "\n").encode()


def bencodePeers() -> bytes:
    peer = bytes([127, 0, 0, 1]) + SEEDER_PORT.to_bytes(2, "big")
    return b"d8:intervali60e5:peers6:" + peer + b"e"


async def respond(writer, status, body, contentType="application/octet-stream"):
    writer.write(f"HTTP/1.1 {status}\r\nContent-Type: {contentType}\r\nContent-Length: {len(body)}\r\n"
                 f"Connection: close\r\n\r\n".encode() + body)
    await writer.drain(); writer.close()


async def handle(reader, writer):
    try:
        head = await reader.readuntil(b"\r\n\r\n")
    except (asyncio.IncompleteReadError, ConnectionError):
        writer.close(); return
    lines = head.decode("latin1").split("\r\n")
    method, target, _ = lines[0].split(" ")
    path = target.split("?")[0]
    print(method, target[:80], flush=True)
    if path == "/announce":
        return await respond(writer, "200 OK", bencodePeers(), "text/plain")
    if path.endswith(".m3u8"):
        return await respond(writer, "200 OK", playlist(), "application/vnd.apple.mpegurl")
    if m := re.fullmatch(r"/live/(\d+)\.ts", path):
        return await respond(writer, "200 OK", SEGMENTS[int(m.group(1)) % len(SEGMENTS)].read_bytes(), "video/mp2t")
    if path not in FILES:
        return await respond(writer, "404 Not Found", b"")
    rng = next((re.search(r"bytes=(\d+)-(\d*)", l) for l in lines if l.lower().startswith("range:")), None)
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
        ACTIVE[path] = ACTIVE.get(path, 0) + 1
        try:
            while sent < size:
                n = min(CHUNK, size - sent)
                writer.write(block[:n]); await writer.drain()
                sent += n
                await asyncio.sleep(n * ACTIVE[path] / rate)
        except (ConnectionError, asyncio.CancelledError):
            pass
        finally:
            ACTIVE[path] -= 1
    writer.close()


async def main():
    srv = await asyncio.start_server(handle, "0.0.0.0", PORT)  # adb reverse 不稳时手机直接走局域网
    async with srv:
        await srv.serve_forever()

asyncio.run(main())
