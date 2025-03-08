const fs = require('fs');
const personaDictionary = require('./dictionary')

function analyzeHexFile(filePath) {
  const buffer = fs.readFileSync(filePath);
  
  const results = [];
  
  for (let i = 0; i < buffer.length - 3; i++) {
    if (buffer[i] === 0x01 && buffer[i + 1] === 0x00) {
      const byte1 = buffer[i + 2];
      const byte2 = buffer[i + 3];
      
      let lastNibble = i & 0b1111;

      if (byte1 === 0x00 && byte2 === 0x00) { // blank entry, not in compendium
        continue
      } else if (lastNibble) { // last nibble of address has to be 0
        continue
      } else if (i > 0x4000 && i < 0x5FFF) { // first range of personas
        results.push({
          address: `0x${i.toString(16).padStart(8, '0')}`,
          value: `0x${byte2.toString(16).padStart(2, '0')}${byte1.toString(16).padStart(2, '0')}`,
          name: personaDictionary[(`0x${byte2.toString(16).padStart(2, '0')}${ (byte1.toString(16).padStart(2, '0')).toUpperCase() }`)]
        })
      } else if (i > 0x6000 && i < 0x9FFF) { // second range of personas
        results.push({
          address: `0x${i.toString(16).padStart(8, '0')}`,
          value: `0x${byte2.toString(16).padStart(2, '0')}${byte1.toString(16).padStart(2, '0')}`,
          name: personaDictionary[(`0x${byte2.toString(16).padStart(2, '0')}${ (byte1.toString(16).padStart(2, '0')).toUpperCase() }`)]
        })
      } else {
        continue
      }

    }
  }
  
  saveResults(results);
  
  return results;
}


function saveResults(results) {
  try {
    outputPath = "results.json"
    csvOutputPath = "results.csv"
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`Full results saved to ${outputPath}`);
    
    const csvHeader = 'Address,Value,Name\n';
    const csvRows = results.map(item => 
      `${item.address},${item.value},${item.name}`
    ).join('\n');
    
    fs.writeFileSync(csvOutputPath, csvHeader + csvRows);
    console.log(`CSV results saved to ${csvOutputPath}`);
  } catch (error) {
    console.error(`Error saving results: ${error.message}`);
  }
}


analyzeHexFile('will.dec');