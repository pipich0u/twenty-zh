import * as fs from 'fs-extra';

export const cancelInstall = async (root: string) => {
  await fs.remove(root);
};
