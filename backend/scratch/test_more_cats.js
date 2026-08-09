const http = require('http');

function checkCat(catId, name) {
  http.get(`http://localhost:5000/api/items?category_id=${catId}&limit=5`, (res) => {
    let data = '';
    res.on('data', chunk => { data += chunk; });
    res.on('end', () => {
      const json = JSON.parse(data);
      console.log(`\n=== Category ${catId}: ${name} ===`);
      json.data.forEach(item => {
        console.log(`Rank #${item.rank}: ${item.title} (${item.country}) - Custom:`, item.custom_values);
      });
    });
  });
}

checkCat(4, 'Global Universities');
checkCat(8, 'Football Powerhouses');
