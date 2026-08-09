const http = require('http');

http.get('http://localhost:5000/api/items?category_id=2&limit=5', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const json = JSON.parse(data);
    console.log('Category 2 (Supercars) Status:', res.statusCode);
    console.log('Total returned:', json.data.length);
    console.log('Sample Cars:');
    json.data.forEach(item => {
      console.log(`Rank #${item.rank}: ${item.title} - Price: ${item.custom_values.price} - Speed: ${item.custom_values.top_speed} - HP: ${item.custom_values.horsepower}`);
    });
  });
});
