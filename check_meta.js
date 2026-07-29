fetch('http://localhost:3000/destination/Andaman').then(r=>r.text()).then(t=>{ 
  const hStart = t.indexOf('<head>'); 
  const hEnd = t.indexOf('</head>'); 
  const bStart = t.indexOf('<body'); 
  const metaIdx = t.indexOf('<meta name="description"'); 
  console.log('head:', hStart, hEnd, 'body:', bStart, 'meta:', metaIdx); 
})
