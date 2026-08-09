const http = require('http');

http.get('http://localhost:5000/api/items?category_id=3&limit=5', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const json = JSON.parse(data);
    console.log('Category 3 (Smartphones) Status:', res.statusCode);
    console.log('Sample Smartphones:');
    json.data.forEach(item => {
      console.log(`Rank #${item.rank}: ${item.title} - Price: ${item.custom_values.price} - Processor: ${item.custom_values.processor} - Camera: ${item.custom_values.camera}`);
    });
  });
});
