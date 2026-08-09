const http = require('http');

async function auditAllCategories() {
  const cats = [1, 2, 3, 4, 5, 6, 7, 8];
  for (const c of cats) {
    await new Promise(resolve => {
      http.get(`http://localhost:5000/api/items?category_id=${c}&limit=100`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            const total = json.data.length;
            const sample1 = json.data[0];
            const sample50 = json.data[49];
            const sample100 = json.data[99];
            console.log(`\n=============================`);
            console.log(`Category #${c} -> Total items: ${total}`);
            console.log(`  Rank 1:   ${sample1.title} | ${sample1.custom_values ? Object.values(sample1.custom_values).slice(0, 2).join(' - ') : 'No specs'}`);
            console.log(`  Rank 50:  ${sample50.title} | ${sample50.custom_values ? Object.values(sample50.custom_values).slice(0, 2).join(' - ') : 'No specs'}`);
            console.log(`  Rank 100: ${sample100.title} | ${sample100.custom_values ? Object.values(sample100.custom_values).slice(0, 2).join(' - ') : 'No specs'}`);
          } catch (e) {
            console.error(`Cat ${c} parse error:`, e.message);
          }
          resolve();
        });
      }).on('error', err => {
        console.error(`Cat ${c} request error:`, err.message);
        resolve();
      });
    });
  }
}

auditAllCategories();
