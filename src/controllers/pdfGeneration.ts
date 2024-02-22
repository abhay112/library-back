import { Request, Response } from 'express';
import puppeteer from 'puppeteer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { TryCatch } from '../middlewares/error';
import { NewPdfReuestBody } from '../types/types';

const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Receipt</title>
</head>
<body>
    <div>
        <h1 style="font-size: 80px;">{{name}}</h1>
    </div>
</body>
</html>
`;

const compiledTemplate = handlebars.compile(htmlTemplate);

export const pdfGeneration = TryCatch(async (req: Request<{},{},NewPdfReuestBody>, res: Response, next: any) => {
    // const htmlContent = compiledTemplate({ name: 'John Doe' }); 
    // const browser = await puppeteer.launch();
    // const page = await browser.newPage();
    // await page.setContent(htmlContent);
    // const pdfBuffer = await page.pdf({ format: 'A4' });
    // await browser.close();
    // const pdfFileName = 'receipt.pdf'; // Specify the name of the PDF file
    // const pdfFilePath = path.join(__dirname, '..', 'receipts', pdfFileName); // Construct the file path
    // fs.writeFileSync(pdfFilePath, pdfBuffer);
    // const downloadLink = `${req.protocol}://${req.get('host')}/api/v1/admin/download/${pdfFileName}`;
    // res.json({ success: true, downloadLink });
    const { name } = req.body;
    const htmlContent = compiledTemplate({ name:name }); 
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();
    const pdfFileName = 'receipt.pdf'; // Specify the name of the PDF file
    const pdfFilePath = path.join(__dirname, '..', 'receipts', pdfFileName); // Construct the file path
    fs.writeFileSync(pdfFilePath, pdfBuffer);
    
    // Set headers to trigger automatic download
    res.setHeader('Content-Disposition', `attachment; filename="${pdfFileName}"`);
    res.setHeader('Content-Type', 'application/pdf');
    res.sendFile(pdfFilePath);
    
});

export const pdfDownload = TryCatch(async (req: Request, res: Response, next: any) => {
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, '..', 'receipts', fileName);
    if (fs.existsSync(filePath)) {
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Content-Type', 'application/pdf');
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    }
})