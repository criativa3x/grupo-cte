
/**
 * Comprime uma imagem no lado do cliente antes do upload.
 */
export async function compressImage(file: File, maxWidth = 1200, quality = 0.7, type = 'image/jpeg'): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Redimensionar proporcionalmente
        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Falha ao obter contexto do canvas'));
          return;
        }

        // Se for JPEG, preencher com fundo branco (evita fundo preto em imagens transparentes)
        if (type === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
        }

        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Falha ao gerar Blob da imagem'));
            }
          },
          type,
          type === 'image/jpeg' ? quality : undefined
        );
      };
      img.onerror = () => reject(new Error('Falha ao carregar imagem'));
    };
    reader.onerror = () => reject(new Error('Falha ao ler arquivo'));
  });
}
