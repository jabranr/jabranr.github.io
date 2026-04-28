import { lintStagedCommands } from '@jabraf/dev/lint-staged';

export default {
  '*.{md,js,njk,yaml,yml,json,xml,css}': (files) => [lintStagedCommands.prettier(files)],
};
