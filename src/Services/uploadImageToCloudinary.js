export const uploadImageToCloudinary = async (file, folder = 'generales') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'TeoFotos'); // Tu upload preset
  formData.append('folder', folder); // Carpeta de destino en Cloudinary

  try {
    const res = await fetch('https://api.cloudinary.com/v1_1/dkrgtoask/image/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    return data.secure_url;
  } catch (err) {
    console.error('Error al subir la imagen:', err);
    return null;
  }
};
