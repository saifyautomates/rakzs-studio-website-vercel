const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'frontend', 'assets', 'videos');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const clips = [
  {
    name: 'film-01.mp4',
    img: 'frontend/assets/images/film-wedding-vandhana.jpg',
    title: 'Wedding Highlights · Vandhana + Srinivas',
    zoom: "min(zoom+0.0012,1.22)",
    x: "iw/2-(iw/zoom/2)",
    y: "ih/2-(ih/zoom/2)"
  },
  {
    name: 'film-02.mp4',
    img: 'frontend/assets/images/hero-wedding.jpg',
    title: 'Final Teaser · Vandhana + Srinivas',
    zoom: "min(zoom+0.0014,1.25)",
    x: "iw/2-(iw/zoom/2)",
    y: "ih/2-(ih/zoom/2)"
  },
  {
    name: 'film-03.mp4',
    img: 'frontend/assets/images/portrait-window-light.webp',
    title: 'Keep It Alive · Studio Film',
    zoom: "min(zoom+0.0011,1.20)",
    x: "iw/2-(iw/zoom/2)",
    y: "ih/3-(ih/zoom/3)"
  },
  {
    name: 'film-04.mp4',
    img: 'frontend/assets/images/wedding-portrait-two.webp',
    title: 'Wedding Details · Rakzs Studio',
    zoom: "min(zoom+0.0013,1.22)",
    x: "iw/2-(iw/zoom/2)",
    y: "ih/2-(ih/zoom/2)"
  }
];

clips.forEach((clip, idx) => {
  const target = path.join(outDir, clip.name);
  console.log(`[${idx + 1}/4] Rendering ${clip.name} from ${clip.img}...`);
  
  // 6 seconds, 25fps, 720x1280 (9:16 vertical video reel format)
  const vf = `scale=1280:1280:force_original_aspect_ratio=increase,crop=1280:1280,zoompan=z='${clip.zoom}':d=150:x='${clip.x}':y='${clip.y}':s=720x1280:fps=25,fade=t=in:st=0:d=0.5,fade=t=out:st=5.5:d=0.5`;
  
  const cmd = `ffmpeg -y -loop 1 -i "${clip.img}" -vf "${vf}" -c:v libx264 -t 6 -pix_fmt yuv420p -profile:v high -preset medium -crf 22 -movflags +faststart "${target}"`;
  
  try {
    execSync(cmd, { stdio: 'pipe' });
    const stat = fs.statSync(target);
    console.log(`✓ Created ${clip.name} (${(stat.size / 1024).toFixed(1)} KB)`);
  } catch (err) {
    console.error(`✗ Error generating ${clip.name}:`, err.message);
  }
});

console.log('All videos generated successfully!');
