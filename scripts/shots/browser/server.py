# 同名限速假 ISO：浏览器点下载后被扩展接管，桌面端从这里下，不必真拉 6.5 GB。
# 内容全是零，每条连接限速 RATE；大小与 releases.ubuntu.com 上的真文件一致
import asyncio, re

PORT = 14392
NAME = "/ubuntu-26.04-desktop-amd64.iso"
SIZE = 6_518_974_464
RATE = 2_600_000
CHUNK = 262144


async def handle(reader, writer):
    head = (await reader.readuntil(b"\r\n\r\n")).decode("latin1").split("\r\n")
    method, path, _ = head[0].split(" ")
    rng = next((re.search(r"bytes=(\d+)-(\d*)", l) for l in head if l.lower().startswith("range:")), None)
    if path.split("?")[0] != NAME:
        writer.write(b"HTTP/1.1 404 Not Found\r\nContent-Length: 0\r\nConnection: close\r\n\r\n")
        await writer.drain(); writer.close(); return
    start, end = (int(rng.group(1)), int(rng.group(2) or SIZE - 1)) if rng else (0, SIZE - 1)
    h = (f"HTTP/1.1 {'206 Partial Content' if rng else '200 OK'}\r\nAccept-Ranges: bytes\r\n"
         f"Content-Type: application/x-iso9660-image\r\nContent-Length: {end - start + 1}\r\nConnection: close\r\n")
    if rng:
        h += f"Content-Range: bytes {start}-{end}/{SIZE}\r\n"
    writer.write((h + "\r\n").encode())
    if method != "HEAD":
        sent, size, block = 0, end - start + 1, bytes(CHUNK)
        try:
            while sent < size:
                n = min(CHUNK, size - sent)
                writer.write(block[:n]); await writer.drain()
                sent += n
                await asyncio.sleep(n / RATE)
        except (ConnectionError, asyncio.CancelledError):
            pass
    writer.close()


async def main():
    server = await asyncio.start_server(handle, "127.0.0.1", PORT)
    async with server:
        await server.serve_forever()

asyncio.run(main())
