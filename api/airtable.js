const TABLES = new Set([
  'tblEWpUn5Z2OFcQrE', 'tblNhMV8EooNZUzWL', 'tblcOo172xvkBPa3Z',
  'tbl38V24tAvsMClX0', 'tblAN0l0I3ZfrsVqc', 'Aroma Sales', 'Consumption',
  'Aroma Prices', 'Diffusers List', 'Comissions', 'tblA178sGje8zN8CM'
]);

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({error: 'Method not allowed'});
  }
  const incoming = new URL(req.url, 'https://dashboard.local');
  const table = incoming.searchParams.get('table');
  if (!TABLES.has(table)) return res.status(400).json({error: 'Unknown table'});
  const token = process.env.AIRTABLE_TOKEN;
  if (!token) return res.status(503).json({error: 'Airtable connection is not configured'});
  const upstream = new URL(`https://api.airtable.com/v0/appPzeuPqekWJV5wR/${encodeURIComponent(table)}`);
  for (const [key, value] of incoming.searchParams) {
    if (key === 'fields[]' || key === 'offset') upstream.searchParams.append(key, value);
  }
  try {
    const response = await fetch(upstream, {headers: {Authorization: `Bearer ${token}`}});
    if (!response.ok) return res.status(502).json({error: 'Unable to retrieve dashboard data'});
    const data = await response.json();
    return res.status(200).json({records: data.records, ...(data.offset ? {offset: data.offset} : {})});
  } catch {
    return res.status(502).json({error: 'Unable to retrieve dashboard data'});
  }
};
