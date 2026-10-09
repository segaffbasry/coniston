"""Cuts the homepage films from Coniston's own showreel (Vimeo 1192228555, "Coniston Showreel", 62s, the film the
live homepage plays in its hero and the subject of the 16 September 2026 news post).

Vimeo's player is not reachable from every network, so the source is fetched from the player's HLS manifest
(1920x1080 video + original audio) into _scrape/film/showreel.mp4. Re-fetch with:
  yt-dlp -f "4923+audio-high-Original" --merge-output-format mp4 -o _scrape/film/showreel.mp4 "<hls url from the player config>"
Outputs (public/media):
  hero.mp4 / hero-sm.mp4   the reel up to 54.4s (it ends on a grey card and the logo), muted, for the hero panel
  hero.jpg                 poster frame (the Painted Hall stair), used before the film plays and with reduced motion
  showreel.mp4             the whole reel with sound, played in the dialog behind "Watch the showreel"
Usage: python3 scripts/film.py   (needs ffmpeg)
"""
import os, subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "..", "_scrape", "film", "showreel.mp4")
OUT = os.path.join(HERE, "..", "public", "media")
LOOP_END = 54.4
POSTER_AT = 10.4


def run(*args):
    subprocess.run(["ffmpeg", "-v", "error", "-y", *args], check=True)


def main():
    os.makedirs(OUT, exist_ok=True)
    enc = ["-c:v", "libx264", "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart"]
    run("-i", SRC, "-t", str(LOOP_END), "-an", "-vf", "scale=1280:-2,fps=25", "-crf", "32", *enc, os.path.join(OUT, "hero.mp4"))
    run("-i", SRC, "-t", str(LOOP_END), "-an", "-vf", "scale=720:-2,fps=25", "-crf", "30", *enc, os.path.join(OUT, "hero-sm.mp4"))
    run("-ss", str(POSTER_AT), "-i", SRC, "-frames:v", "1", "-vf", "scale=1280:-2", "-q:v", "4", os.path.join(OUT, "hero.jpg"))
    run("-i", SRC, "-vf", "scale=1280:-2", "-crf", "28", "-maxrate", "1600k", "-bufsize", "3200k", *enc,
        "-c:a", "aac", "-b:a", "96k", os.path.join(OUT, "showreel.mp4"))
    for f in ("hero.mp4", "hero-sm.mp4", "hero.jpg", "showreel.mp4"):
        print(f, os.path.getsize(os.path.join(OUT, f)) // 1024, "KB")


if __name__ == "__main__":
    main()
