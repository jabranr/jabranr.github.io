import { lintStagedCommands } from '@jabraf/dev/lint-staged';

export default {
  '*.{md,js,yaml,yml,json,xml,css}': (files) => [lintStagedCommands.prettier(files)],
};
