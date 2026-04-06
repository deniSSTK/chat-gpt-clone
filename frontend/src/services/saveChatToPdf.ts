import jsPDF from "jspdf";
import Roboto from "../fonts/Roboto-Regular.js";
import type { iMessage } from "../views/ChatPage.vue";

(jsPDF as any).API.events.push([
    "addFonts",
    function () {
        //@ts-ignore
        this.addFileToVFS("Roboto-Regular.ttf", Roboto);
        //@ts-ignore
        this.addFont("Roboto-Regular.ttf", "Roboto", "normal");
        //@ts-ignore
        this.addFont("Roboto-Regular.ttf", "Roboto", "bold");
    }
]);

const exportChatAsPDF = async (messages: iMessage[]): Promise<void> => {
    const doc = new jsPDF();
    doc.setFont("Roboto");

    let y = 10;

    for (const msg of messages) {
        if (msg.role === "system") continue;


        const role = msg.role === "user" ? "User" : "Assistant";
        const hasText = msg.content && msg.content.trim() !== "";
        const hasImage = Boolean(msg.imageUrl);

        if (!hasText && !hasImage) continue;

        if (hasText || hasImage) {
            doc.setFont("Roboto", "bold");
            doc.text(`${role}:`, 10, y);
            y += 8;
            doc.setFont("Roboto", "normal");
        }

        if (hasText) {
            const split = doc.splitTextToSize(msg.content.trim(), 180);
            doc.text(split, 10, y);
            y += split.length * 10;
        }

        if (hasImage && msg.imageUrl) {
            const img = await loadImage(msg.imageUrl);
            doc.addImage(img, "PNG", 10, y, 50, 50);
            y += 60;
        }

        if (y > 270) {
            doc.addPage();
            doc.setFont("Roboto");
            y = 10;
        }
    }

    doc.save("chat.pdf");
};

const loadImage = (src: string): Promise<string> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            if (ctx) ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL("image/png"));
        };
        img.src = src;
    });
};

export default exportChatAsPDF;
