const fs = require('fs').promises;

async function extract() {
    const map = await fs.readFile('src/map.txt');
    console.log(map.toString());
}

extract();