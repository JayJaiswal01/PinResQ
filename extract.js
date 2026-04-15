const PDFParser = require('pdf2json');
const fs = require('fs');
const path = require('path');

const files = [
  { name: 'PRD', path: 'c:\\Users\\Jay Jaiswal\\project\\PinResQ\\Source Folder\\PinResQ - PRD.pdf' },
  { name: 'Design_Doc', path: 'c:\\Users\\Jay Jaiswal\\project\\PinResQ\\Source Folder\\PinResQ - Design Doc.pdf' },
  { name: 'TechStack', path: 'c:\\Users\\Jay Jaiswal\\project\\PinResQ\\Source Folder\\PinResQ - TechStack.pdf' },
  { name: 'IdeaLab', path: 'c:\\Users\\Jay Jaiswal\\project\\PinResQ\\Source Folder\\IdeaLab- WebApp Plan (1).pdf' },
];

function extractFromPDF(filePath) {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null, 1);
    
    pdfParser.on('pdfParser_dataError', errData => reject(errData.parserError));
    pdfParser.on('pdfParser_dataReady', pdfData => {
      const text = pdfParser.getRawTextContent();
      resolve(text);
    });
    
    pdfParser.loadPDF(filePath);
  });
}

async function run() {
  for (const f of files) {
    try {
      console.log('Extracting:', f.name);
      const text = await extractFromPDF(f.path);
      const outFile = `c:\\Users\\Jay Jaiswal\\project\\PinResQ\\${f.name}_text.txt`;
      fs.writeFileSync(outFile, text, 'utf8');
      console.log('Written:', outFile, '| chars:', text.length);
    } catch (e) {
      console.error('Error with', f.name, ':', e);
    }
  }
}

run();
