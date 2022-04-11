import fs from 'fs';
import path from 'path';

const prepTestImage = async (): Promise<boolean> => {
  const res = false;

  const testThumbName = 'for_test_jasmine_image_dont_deleted';

  const thumbDir = path.resolve('./images/thumb');
  const fullDire = path.resolve('./images/full');

  if (!fs.existsSync(thumbDir)) {
    fs.mkdirSync(thumbDir);
  }

  if (!fs.existsSync(fullDire)) {
    fs.mkdirSync(fullDire);
  }

  const fileSrc = path.resolve('./tmp/for_test_jasmine_image_dont_deleted.jpg');
  const fileDist = path.resolve(
    './images/full/for_test_jasmine_image_dont_deleted.jpg'
  );

  if (fs.existsSync(fileSrc)) {
    fs.copyFileSync(fileSrc, fileDist);
    if (fs.existsSync(fileDist)) {
      try {
        const thumbFiles = fs.readdirSync(thumbDir);
        for (let i = 0; i < thumbFiles.length; i++) {
          if (thumbFiles[i].includes(testThumbName)) {
            const testThumbFile = path.join(thumbDir, thumbFiles[i]);
            if (fs.existsSync(testThumbFile)) fs.unlinkSync(testThumbFile);
          }
        }
        return true;
      } catch (e) {
        return false;
      }
      return true;
    }
  }

  return res;
};

export default prepTestImage;
