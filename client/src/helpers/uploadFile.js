const url = `https://api.cloudinary.com/v1_1/${
  import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME
}/auto/upload`;

const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "chat-app-files");

  const res = await fetch(url, {
    method: "post",
    body: formData,
  });
  const data = await res.json();
  return data;
};

export default uploadFile;
