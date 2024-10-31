import "pdfmake/build/pdfmake";
import axios from "axios";
import { API_BASE_URL } from "../core/config";

pdfMake.fonts = {
    Roboto: {
        normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
        bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
        italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
        bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
    }
}   

export async function imageToBase64(url) {
    try {
        const response = await axios.get(`${API_BASE_URL}/convert-image?url=${url}`);
        return response.data.base64;
    } catch (error) {
        console.error(`Error converting image to base64: ${error}`);
        return ""; // Return an empty string or placeholder if conversion fails
    }
}

export async function generatePDF(tableData, totalPrice) {
    const docDefinition = {
        content: [
            {
                table: {
                    headerRows: 1,
                    widths: [ 90, 30, 'auto', 50,50, 50 ],
                    body: [
                        ["Картинка", "Арт.", "Наименование", "Цена", "Кол-во", "Итого"],
                        ...tableData.map((item) => [
                            { image: item.image, width: 85 },
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
            {
                text: `Итого: ${totalPrice}₽`,
                style: 'totalPrice',
                alignment: 'right',
                margin: [0, 10] // Add some margin to separate from the table
            }
        ],
        styles: {
            totalPrice: {
                fontSize: 14,
                bold: true
            }
        }
    };

    pdfMake.createPdf(docDefinition).download(`Perechen-${new Date().toISOString()}.pdf`);
}