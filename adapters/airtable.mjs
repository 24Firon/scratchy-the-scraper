import axios from 'axios';

export async function pushToAirtable(records, config) {
  console.log('\n📤 Pushe zu Airtable...');
  
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = config.airtable?.tableName || 'Scraped Data';
  
  if (!apiKey || !baseId) {
    console.log('❌ Airtable-Credentials fehlen in .env');
    console.log('💡 Setze: AIRTABLE_API_KEY und AIRTABLE_BASE_ID');
    return;
  }
  
  const url = 'https://api.airtable.com/v0/' + baseId + '/' + encodeURIComponent(tableName);
  
  const batches = [];
  for (let i = 0; i < records.length; i += 10) {
    batches.push(records.slice(i, i + 10));
  }
  
  let uploaded = 0;
  for (const batch of batches) {
    try {
      const response = await axios.post(url, {
        records: batch.map(record => ({
          fields: {
            'Title': record.title || '',
            'URL': record.url || '',
            'Content': record.content || '',
            'Scraped At': new Date().toISOString(),
            'Project': config.projectName
          }
        }))
      }, {
        headers: {
          'Authorization': 'Bearer ' + apiKey,
          'Content-Type': 'application/json'
        }
      });
      
      uploaded += response.data.records.length;
      console.log('✓ Batch: ' + response.data.records.length + ' Einträge');
      
    } catch (err) {
      console.error('❌ Airtable-Fehler:', err.response?.data || err.message);
    }
  }
  
  console.log('\n✅ Airtable: ' + uploaded + '/' + records.length + ' hochgeladen');
}
