# 本地 BT 做种：稀疏文件（全零）组成 Big Buck Bunny 多文件种子，监听 6886，经 adb reverse 给手机
# 打印 magnet 后常驻；用 Ghost-Downloader-3/.venv/bin/python 运行（需要 libtorrent）
import os, time
from pathlib import Path
import libtorrent as lt

ROOT = Path("/tmp/gdbt")
MB = 1_000_000
FILES = [("big_buck_bunny_1080p_h264.mov", 725 * MB), ("big_buck_bunny_720p_h264.mov", 369 * MB),
         ("big_buck_bunny_480p_h264.mov", 176 * MB), ("poster.jpg", 2 * MB)]
UPLOAD_RATE = int(os.environ.get("UPLOAD_RATE", 3_000_000))

folder = ROOT / "Big Buck Bunny"
folder.mkdir(parents=True, exist_ok=True)
for name, size in FILES:
    with open(folder / name, "ab") as f:
        f.truncate(size)

torrentFile = ROOT / "bbb.torrent"
if not torrentFile.exists():
    fs = lt.file_storage()
    lt.add_files(fs, str(folder))
    ct = lt.create_torrent(fs)
    ct.add_tracker("http://127.0.0.1:18766/announce")
    lt.set_piece_hashes(ct, str(ROOT))
    torrentFile.write_bytes(lt.bencode(ct.generate()))

session = lt.session({"listen_interfaces": "127.0.0.1:6886", "enable_dht": False, "enable_lsd": False,
                      "enable_upnp": False, "enable_natpmp": False, "upload_rate_limit": UPLOAD_RATE,
                      "allow_multiple_connections_per_ip": True})
info = lt.torrent_info(str(torrentFile))
handle = session.add_torrent({"ti": info, "save_path": str(ROOT), "flags": lt.torrent_flags.seed_mode})
print(f"magnet:?xt=urn:btih:{info.info_hash()}&dn=Big%20Buck%20Bunny&tr=http%3A%2F%2F127.0.0.1%3A18766%2Fannounce"
      f"&x.pe=127.0.0.1:6886", flush=True)
while True:
    s = handle.status()
    print(f"peers={s.num_peers} up={s.upload_rate / 1e6:.2f}MB/s total={s.total_upload / 1e6:.0f}MB", flush=True)
    time.sleep(10)
