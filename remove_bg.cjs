const Jimp = require('jimp');
const path = 'd:/Ankita/public/assets/logo.png';

Jimp.read(path)
  .then(image => {
    // Make dark pixels transparent
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];
      
      // If color is very dark (close to black), make it transparent
      if (red < 50 && green < 50 && blue < 50) {
        this.bitmap.data[idx + 3] = 0; // Alpha channel to 0
      }
    });
    return image.writeAsync(path);
  })
  .then(() => {
    console.log('Background removed successfully.');
  })
  .catch(err => {
    console.error('Error:', err);
  });
