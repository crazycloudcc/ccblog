/** Local native SVG diagrams rasterized to widely supported PNG share cards. */
import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";
import { createJiti } from "jiti";
const jiti = createJiti(import.meta.url);
const { lessons } = await jiti.import("../lib/visualizations/lessons.ts");
const text = (x, y, value, size = 24, color = "#c5d6e9") => `<text x="${x}" y="${y}" fill="${color}" font-size="${size}" font-family="sans-serif">${value}</text>`;
const cell = (x, y, value, active = true) => `<rect x="${x}" y="${y}" width="92" height="62" rx="10" fill="${active ? "#164f48" : "#172d41"}" stroke="${active ? "#5eead4" : "#48647c"}"/>${text(x + 34, y + 42, value, 30, active ? "#f1f6ff" : "#91a8c5")}`;
for (const [slug, lesson] of Object.entries(lessons)) {
  if (process.argv[2] && process.argv[2] !== slug) continue;
  const answer = slug === "binary-search-on-answer";
  const binary = slug === "binary-search";
  let diagram = "";
  if (answer) {
    diagram += `<path d="M100 480H1050 M100 480V215" stroke="#48647c" stroke-width="2" fill="none"/><path d="M100 480H200V438H300V407H400V360H500V324H600V284H700V246H820V216H1050" stroke="#5eead4" stroke-width="5" fill="none"/><path d="M100 284H1050" stroke="#f2b36f" stroke-width="2" stroke-dasharray="8 8"/><circle cx="600" cy="284" r="10" fill="#f2b36f"/>`;
    diagram += text(115,235,"target = 8",25,"#f2b36f") + text(620,276,"first true: 9s",30,"#f2b36f") + text(105,524,"2s / 3s / 7s machines",25) + text(750,524,"4 + 3 + 1 = 8",25,"#5eead4");
  } else if (slug === "pythagorean-theorem") {
    const { pythagoreanModel } = await jiti.import("../lib/visualizations/pythagorean.ts");
    const m = pythagoreanModel(3,4), k=38;
    for (const [x,final] of [[105,false],[700,true]]) {
      const points = p => p.map(([a,b]) => `${x+a*k},${225+b*k}`).join(" ");
      diagram += `<rect x="${x}" y="225" width="266" height="266" fill="#c5d6e9" stroke="#91a8c5"/>`;
      if (!final) diagram += `<polygon points="${points(m.center)}" fill="#164f48"/>`;
      else diagram += `<rect x="${x}" y="225" width="114" height="114" fill="#164f48"/><rect x="${x+114}" y="339" width="152" height="152" fill="#284a77"/>`;
      for(const t of final?m.triangles:m.initial) diagram += `<polygon points="${points(t)}" fill="#45372d" stroke="#f2b36f" stroke-width="2"/>`;
      diagram += final ? text(x+18,292,"a²=9",23,"#f1f6ff")+text(x+132,418,"b²=16",23,"#f1f6ff") : text(x+78,368,"c²=25",25,"#f1f6ff");
    }
    diagram += text(474,372,"25 = 9 + 16",30,"#5eead4");
  } else if (binary) {
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
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#0c1625"/>${text(66,60,"CRAZYCLOUDCC / VISUAL LAB",19,"#5eead4")}${text(66,125,answer ? "Binary Search on Answer" : slug === "pythagorean-theorem" ? "Pythagorean Theorem" : binary?"Binary Search":"Longest Increasing Subsequence",binary?54:46,"#f1f6ff")}${text(66,167,answer ? "Search time. Test feasibility. Find the earliest answer." : slug === "pythagorean-theorem" ? "Same four triangles. Same frame. Equal remaining areas." : binary?"Find 9. Exclude mid. Shrink the window.":"LIS / Replace an ending, or extend the length.",24)}${diagram}${text(66,575,answer ? "Monotone predicate / first true / O(n log U)" : slug === "pythagorean-theorem" ? "Right triangle / a² + b² = c² / area-preserving dissection" : binary?"Sorted array / closed interval / O(log n)":"Strictly increasing / lower_bound / O(n log n)",24,"#5eead4")}</svg>`;
  const path = `public${lesson.ogImage}`;
  await mkdir(new URL("../public/images/learn/", import.meta.url), { recursive: true });
  await writeFile(path.replace(/\.png$/, ".svg"), svg);
  await sharp(Buffer.from(svg)).png().toFile(path);
}
