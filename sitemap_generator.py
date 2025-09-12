import datetime
import json

# Load URLs from urls.json
with open("urls.json", "r", encoding="utf-8") as f:
    urls = json.load(f)

today = datetime.date.today().isoformat()

xml_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
xml_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\n'

for url in urls:
    xml_content += "  <url>\n"
    xml_content += f"    <loc>{url['loc']}</loc>\n"
    xml_content += f"    <lastmod>{today}</lastmod>\n"
    xml_content += f"    <changefreq>{url['changefreq']}</changefreq>\n"
    xml_content += f"    <priority>{url['priority']}</priority>\n"
    xml_content += "  </url>\n\n"

xml_content += "</urlset>\n"

with open("sitemap.xml", "w", encoding="utf-8") as f:
    f.write(xml_content)

print("✅ sitemap.xml updated with today's date:", today)
