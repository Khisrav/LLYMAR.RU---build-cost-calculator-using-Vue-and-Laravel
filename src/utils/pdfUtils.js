// src/utils/pdfUtils.js
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import axios from "axios";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export async function imageToBase64(url) {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/convert-image?url=${url}`);
        return response.data.base64;
    } catch (error) {
        console.error(`Error converting image to base64: ${error}`);
        return ""; // Return an empty string or placeholder if conversion fails
    }
}

export async function generatePDF(tableData) {
    const docDefinition = {
        content: [
            {
                table: {
                    headerRows: 1,
                    widths: [ 60, '*', 'auto', 60,60, 60 ],
                    body: [
                        ["Картинка", "Арт.", "Наименование", "Цена", "Кол-во", "Итого"],
                        ...tableData.map((item) => [
                            { image: item.image, width: 55, height: 50 },
                            item.vendor_code.toString(),
                            item.name.toString(),
                            item.price.toString() + '₽',
                            item.amount.toString() + ' ' + item.unit.toString(),
                            item.total.toString() + '₽'
                        ]),
                    ],
                },
                layout: "lightHorizontalLines",
                width: "100%", // Full page width
            },
        ],
    };

    pdfMake.createPdf(docDefinition).download(`Perechen-${new Date().toISOString()}.pdf`);
    
}