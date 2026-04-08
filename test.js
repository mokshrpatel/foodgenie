fetch('http://localhost:5001/api/restaurants').then(r=>r.text()).then(console.log).catch(console.error)
