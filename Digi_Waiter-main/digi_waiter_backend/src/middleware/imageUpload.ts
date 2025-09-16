import axios from "axios";
import FormData from "form-data";

export async function uploadQrToUploadThing(
  buffer: Buffer,
  filename: string
): Promise<string> {
  const formData = new FormData();
  formData.append("file", buffer, { filename, contentType: "image/png" });

  // Replace this URL with your actual UploadThing upload endpoint
  const UPLOADTHING_UPLOAD_URL =
    "http://localhost:6001/api/uploadthing/uploadRouter/imageUploader";

  const response = await axios.post(UPLOADTHING_UPLOAD_URL, formData, {
    headers: {
      ...formData.getHeaders(),
      // Add auth header here if required, e.g.
      // Authorization: `Bearer YOUR_API_KEY`,
    },
  });

  if (response.status !== 200) {
    throw new Error("Failed to upload QR code image");
  }

  // Return the uploaded file URL
  return response.data[0].fileUrl;
}
