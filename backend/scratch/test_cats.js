const http = require('http');

http.get('http://localhost:5000/api/categories', (res) => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    const json = JSON.parse(data);
    console.log('Categories Count:', json.data.length);
    json.data.forEach(c => console.log(`Category #${c.id}: ${c.name} (${c.slug}) - ${c.item_count} items`));
  });
});
