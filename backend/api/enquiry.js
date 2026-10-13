module.exports = (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, date, city, message } = req.body || {};

  if (!name || !phone || !date) {
    return res.status(400).json({ error: 'Name, phone and date are required.' });
  }

  const text = `Hi Rakzs Studio! I'm ${name} (${phone}).\nEvent date: ${date}${city ? '\nVenue / city: ' + city : ''}${message ? '\nDetails: ' + message : ''}\nPlease share availability and collection details.`;
  const waUrl = 'https://wa.me/918522059034?text=' + encodeURIComponent(text);

  return res.status(200).json({
    success: true,
    waUrl,
    message: 'Enquiry processed successfully.'
  });
};
