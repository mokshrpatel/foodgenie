fetch('http://192.168.31.212:5001/api/restaurants').then(r=>r.text()).then(console.log).catch(console.error)
