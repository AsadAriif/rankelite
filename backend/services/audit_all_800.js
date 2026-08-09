const http = require('http');

async function checkCategory(catId, name) {
  return new Promise((resolve) => {
    http.get(`http://localhost:5000/api/items?category_id=${catId}&limit=100`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const items = json.data || [];
          console.log(`\n========================================`);
          console.log(`CATEGORY ${catId}: ${name} (Total Items: ${items.length})`);
          console.log(`========================================`);
          
          // Print item 1, 10, 15, 25, 50, 99
          [0, 9, 14, 24, 49, 99].forEach(idx => {
            if (items[idx]) {
              const item = items[idx];
              console.log(`Rank #${item.rank}: ${item.title} | Country: ${item.country}`);
              console.log(`   Description: ${item.description.substring(0, 90)}...`);
              console.log(`   Custom Values:`, JSON.stringify(item.custom_values));
            }
          });
          resolve();
        } catch (e) {
          console.error(`Error parsing category ${catId}:`, e.message);
          resolve();
        }
      });
    }).on('error', (err) => {
      console.error(`Error fetching category ${catId}:`, err.message);
      resolve();
    });
  });
}

async function run() {
  const cats = [
    [1, 'World Billionaires'],
    [2, 'Supercars & Hypercars'],
    [3, 'Flagship Smartphones'],
    [4, 'Global Universities'],
    [5, 'Premier Airlines'],
    [6, 'Tech Giants'],
    [7, '5-Star Luxury Resorts'],
    [8, '100 Football Powerhouses']
  ];
  
  for (const [id, name] of cats) {
    await checkCategory(id, name);
  }
}

run();
