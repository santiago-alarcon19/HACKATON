const fs = require("fs");
const path = require("path");

const productsPath = path.join(__dirname, "../../products-blueprint.js");
const dbPath = path.join(__dirname, "../../database.json");
const outPath = path.join(
  __dirname,
  "../src/main/resources/db/migration/V2__seed_data.sql"
);

const productsRaw = fs.readFileSync(productsPath, "utf8");
const productsJs = productsRaw.replace(/^export default /m, "module.exports = ");
const products = eval(productsJs);
const db = JSON.parse(fs.readFileSync(dbPath, "utf8"));

function esc(s) {
  return (s || "").replace(/'/g, "''");
}

function highlightsSql(arr) {
  if (!arr || !arr.length) return "ARRAY[]::text[]";
  return `ARRAY[${arr.map((h) => `'${esc(h)}'`).join(", ")}]`;
}

let sql = "-- Seed data from tractor-store blueprint\n\n";

sql += "INSERT INTO catalog_store (id, name, street, city, image) VALUES\n";
sql += db.stores
  .map(
    (s) =>
      `  ('${esc(s.id)}', '${esc(s.name)}', '${esc(s.street)}', '${esc(s.city)}', '${esc(s.image)}')`
  )
  .join(",\n");
sql += ";\n\n";

sql += "INSERT INTO catalog_teaser (title, image, url, sort_order) VALUES\n";
sql += db.teaser
  .map(
    (t, i) =>
      `  ('${esc(t.title)}', '${esc(t.image)}', '${esc(t.url)}', ${i})`
  )
  .join(",\n");
sql += ";\n\n";

for (const p of products) {
  const highlights = p.highlights || p.highlightsa || [];
  sql += `INSERT INTO catalog_product (id, name, category, highlights) VALUES ('${esc(p.id)}', '${esc(p.name)}', '${esc(p.category)}', ${highlightsSql(highlights)});\n`;
  for (const v of p.variants) {
    sql += `INSERT INTO catalog_variant (sku, product_id, name, image, color, price) VALUES ('${esc(v.sku)}', '${esc(p.id)}', '${esc(v.name)}', '${esc(v.image)}', '${esc(v.color)}', ${v.price});\n`;
    const stock = v.sku.endsWith("-SI") ? 0 : 25;
    sql += `INSERT INTO inventory_stock (sku, quantity) VALUES ('${esc(v.sku)}', ${stock});\n`;
  }
  sql += "\n";
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, sql);
console.log("Wrote", outPath, "lines:", sql.split("\n").length);
