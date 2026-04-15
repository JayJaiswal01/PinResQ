import { getDocument } from 'pdfjs-dist/build/pdf.mjs';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';

const files = [
  { name: 'PRD', path: 'c:\\Users\\Jay Jaiswal\\project\\PinResQ\\Source Folder\\PinResQ - PRD.pdf' },
  { name: 'Design_Doc', path: 'c:\\Users\\Jay Jaiswal\\project\\PinResQ\\Source Folder\\PinResQ - Design Doc.pdf' },
  { name: 'TechStack', path: 'c:\\Users\\Jay Jaiswal\\project\\PinResQ\\Source Folder\\PinResQ - TechStack.pdf' },
  { name: 'IdeaLab', path: 'c:\\Users\\Jay Jaiswal\\project\\PinResQ\\Source Folder\\IdeaLab- WebApp Plan (1).pdf' },
];

async function extractText(filePath) {
  const data = new Uint8Array(readFileSync(filePath));
  const loadingTask = getDocument({ 
    data, 
    useWorkerFetch: false, 
    isEvalSupported: false, 
    useSystemFonts: true 
  });
  const pdfDocument = await loadingTask.promise;
  
  let fullText = '';
  for (let i = 1; i <= pdfDocument.numPages; i++) {
    const page = await pdfDocument.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str || '').join(' ');
    fullText += `\n--- PAGE ${i} ---\n${pageText}`;
  }
  return fullText;
}

async function run() {
  for (const f of files) {
    try {
      console.log('Extracting:', f.name, '...');
      const text = await extractText(f.path);
      const outFile = `c:\\Users\\Jay Jaiswal\\project\\PinResQ\\${f.name}_text.txt`;
      writeFileSync(outFile, text, 'utf8');
      console.log('Written:', outFile, '| chars:', text.length);
    } catch (e) {
      console.error('Error with', f.name, ':', e.message, e.stack);
    }
  }
}
run();
