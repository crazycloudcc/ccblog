/** Local native SVG diagrams rasterized to widely supported PNG share cards. */
import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";
import { createJiti } from "jiti";
const jiti = createJiti(import.meta.url);
const { lessons } = await jiti.import("../lib/visualizations/lessons.ts");
const text = (x, y, value, size = 24, color = "#c5d6e9") => `<text x="${x}" y="${y}" fill="${color}" font-size="${size}" font-family="sans-serif">${value}</text>`;
const cell = (x, y, value, active = true) => `<rect x="${x}" y="${y}" width="92" height="62" rx="10" fill="${active ? "#164f48" : "#172d41"}" stroke="${active ? "#5eead4" : "#48647c"}"/>${text(x + 34, y + 42, value, 30, active ? "#f1f6ff" : "#91a8c5")}`;
for (const [slug, lesson] of Object.entries(lessons)) {
  const binary = slug === "binary-search";
  let diagram = "";
  if (binary) {
    [[0,4],[3,4],[4,4]].forEach(([lo, hi], row) => {
      const y = 205 + row * 106;
      diagram += text(66,y+40,`[${lo}, ${hi}]`,27,"#8cbcff");
      [1,3,5,7,9].forEach((n,i) => { diagram += cell(275+i*112,y,n,i>=lo&&i<=hi); });
      diagram += text(875,y+40,["mid = 2","mid = 3","found: 4"][row],26,"#5eead4");
    });
  } else {
    diagram += text(66,215,"Input: 3, 5, 7, 1, 2, 8",26);
    [[3,5,7],[1,2,7],[1,2,7,8]].forEach((values,row) => {
      const y=247+row*85;
      diagram += text(66,y+40,["append","replace","length = 4"][row],26,"#8cbcff");
      values.forEach((n,i) => { diagram += cell(300+i*112,y,n); });
    });
    diagram += text(810,294,"minimum",25,"#5eead4") + text(810,332,"endings",25,"#5eead4") + text(810,414,"not the actual",23) + text(810,450,"subsequence",23);
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#0c1625"/>${text(66,60,"CRAZYCLOUDCC / VISUAL LAB",19,"#5eead4")}${text(66,125,binary?"Binary Search":"Longest Increasing Subsequence",binary?54:46,"#f1f6ff")}${text(66,167,binary?"Find 9. Exclude mid. Shrink the window.":"LIS / Replace an ending, or extend the length.",24)}${diagram}${text(66,575,binary?"Sorted array / closed interval / O(log n)":"Strictly increasing / lower_bound / O(n log n)",24,"#5eead4")}</svg>`;
  const path = `public${lesson.ogImage}`;
  await mkdir(new URL("../public/images/learn/", import.meta.url), { recursive: true });
  await writeFile(path.replace(/\.png$/, ".svg"), svg);
  await sharp(Buffer.from(svg)).png().toFile(path);
}
