import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'path';
import { ASSETS_DIR } from 'twenty-shared/application';
import { v4 } from 'uuid';

import { type ExampleOptions } from '@/cli/utilities/init/scaffolding-options';
import { scaffoldIntegrationTest } from '@/cli/utilities/init/test-template';

const SRC_FOLDER = 'src';

export const copyBaseApplicationProject = async ({
  appName,
  appDisplayName,
  appDescription,
  appDirectory,
  sdkVersion,
  exampleOptions,
}: {
  appName: string;
  appDisplayName: string;
  appDescription: string;
  appDirectory: string;
  sdkVersion: string;
  exampleOptions: ExampleOptions;
}) => {
  await writeBaseApplicationFiles(appDirectory);

  await createPackageJson({
    appName,
    appDirectory,
    sdkVersion,
    includeExampleIntegrationTest: exampleOptions.includeExampleIntegrationTest,
  });

  await createYarnLock(appDirectory);

  await createGitignore(appDirectory);

  await createPublicAssetDirectory(appDirectory);

  const sourceFolderPath = join(appDirectory, SRC_FOLDER);

  await mkdir(sourceFolderPath, { recursive: true });

  await createDefaultRoleConfig({
    displayName: appDisplayName,
    appDirectory: sourceFolderPath,
    fileFolder: 'roles',
    fileName: 'default-role.ts',
  });

  if (exampleOptions.includeExampleObject) {
    await createExampleObject({
      appDirectory: sourceFolderPath,
      fileFolder: 'objects',
      fileName: 'example-object.ts',
    });
  }

  if (exampleOptions.includeExampleField) {
    await createExampleField({
      appDirectory: sourceFolderPath,
      fileFolder: 'fields',
      fileName: 'example-field.ts',
    });
  }

  if (exampleOptions.includeExampleLogicFunction) {
    await createDefaultFunction({
      appDirectory: sourceFolderPath,
      fileFolder: 'logic-functions',
      fileName: 'hello-world.ts',
    });
  }

  if (exampleOptions.includeExampleFrontComponent) {
    await createDefaultFrontComponent({
      appDirectory: sourceFolderPath,
      fileFolder: 'front-components',
      fileName: 'hello-world.tsx',
    });
  }

  if (exampleOptions.includeExampleView) {
    await createExampleView({
      appDirectory: sourceFolderPath,
      fileFolder: 'views',
      fileName: 'example-view.ts',
    });
  }

  if (exampleOptions.includeExampleNavigationMenuItem) {
    await createExampleNavigationMenuItem({
      appDirectory: sourceFolderPath,
      fileFolder: 'navigation-menu-items',
      fileName: 'example-navigation-menu-item.ts',
    });
  }

  if (exampleOptions.includeExampleSkill) {
    await createExampleSkill({
      appDirectory: sourceFolderPath,
      fileFolder: 'skills',
      fileName: 'example-skill.ts',
    });
  }

  if (exampleOptions.includeExampleAgent) {
    await createExampleAgent({
      appDirectory: sourceFolderPath,
      fileFolder: 'agents',
      fileName: 'example-agent.ts',
    });
  }

  if (exampleOptions.includeExampleIntegrationTest) {
    await scaffoldIntegrationTest({
      appDirectory,
      sourceFolderPath,
    });
  }

  await createDefaultPreInstallFunction({
    appDirectory: sourceFolderPath,
    fileFolder: 'logic-functions',
    fileName: 'pre-install.ts',
  });

  await createDefaultPostInstallFunction({
    appDirectory: sourceFolderPath,
    fileFolder: 'logic-functions',
    fileName: 'post-install.ts',
  });

  await createApplicationConfig({
    displayName: appDisplayName,
    description: appDescription,
    appDirectory: sourceFolderPath,
    fileName: 'application-config.ts',
  });
};

const writeBaseApplicationFiles = async (appDirectory: string) => {
  await mkdir(appDirectory, { recursive: true });

  await writeFile(join(appDirectory, '.nvmrc'), '24.5.0\n');

  await writeFile(
    join(appDirectory, '.yarnrc.yml'),
    'nodeLinker: node-modules\n',
  );

  await writeFile(
    join(appDirectory, '.oxlintrc.json'),
    JSON.stringify(
      {
        $schema: './node_modules/oxlint/configuration_schema.json',
        plugins: ['typescript'],
        categories: { correctness: 'off' },
        ignorePatterns: ['node_modules', 'dist'],
        rules: {
          'no-unused-vars': 'off',
          'typescript/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
          'typescript/no-explicit-any': 'off',
        },
      },
      null,
      2,
    ) + '\n',
  );

  await writeFile(
    join(appDirectory, 'tsconfig.json'),
    JSON.stringify(
      {
        compileOnSave: false,
        compilerOptions: {
          sourceMap: true,
          declaration: true,
          outDir: './dist',
          rootDir: '.',
          jsx: 'react-jsx',
          moduleResolution: 'node',
          allowSyntheticDefaultImports: true,
          emitDecoratorMetadata: true,
          experimentalDecorators: true,
          importHelpers: true,
          allowUnreachableCode: false,
          strict: true,
          alwaysStrict: true,
          noImplicitAny: true,
          strictBindCallApply: false,
          target: 'es2018',
          module: 'esnext',
          lib: ['es2020', 'dom'],
          skipLibCheck: true,
          skipDefaultLibCheck: true,
          resolveJsonModule: true,
          paths: {
            'src/*': ['./src/*'],
            '~/*': ['./*'],
          },
        },
        exclude: [
          'node_modules',
          'dist',
          '**/*.test.ts',
          '**/*.spec.ts',
          '**/*.integration-test.ts',
        ],
      },
      null,
      2,
    ) + '\n',
  );

  await writeFile(
    join(appDirectory, 'README.md'),
    `This is a [Twenty](https://twenty.com) application bootstrapped with [\`create-twenty-app\`](https://www.npmjs.com/package/create-twenty-app).

## Getting Started

Run \`yarn twenty help\` to list all available commands.

## Learn More

- [Twenty Apps documentation](https://docs.twenty.com/developers/extend/capabilities/apps)
- [twenty-sdk CLI reference](https://www.npmjs.com/package/twenty-sdk)
- [Discord](https://discord.gg/cx5n4Jzs57)
`,
  );

  await writeFile(
    join(appDirectory, 'LLMS.md'),
    `## Base documentation

- Documentation: https://docs.twenty.com/developers/extend/capabilities/apps
- Rich app example: https://github.com/twentyhq/twenty/tree/main/packages/twenty-sdk/src/app-seeds/rich-app

## UUID requirement

- All generated UUIDs must be valid UUID v4.

## Common Pitfalls

- Creating an object without an index view associated. Unless this is a technical object, user will need to visualize it.
- Creating a view without a navigationMenuItem associated. This will make the view available on the left sidebar.
- Creating a front-end component that has a scroll instead of being responsive to its fixed widget height and width, unless it is specifically meant to be used in a canvas tab.
`,
  );
};

const createPublicAssetDirectory = async (appDirectory: string) => {
  await mkdir(join(appDirectory, ASSETS_DIR), { recursive: true });
};

const createGitignore = async (appDirectory: string) => {
  const gitignoreContent = `# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.*
.yarn

# codegen
generated

# testing
/coverage

# dev
/dist/

.twenty

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files (can opt-in for committing if needed)
.env*

# typescript
*.tsbuildinfo
*.d.ts
`;

  await writeFile(join(appDirectory, '.gitignore'), gitignoreContent);
};

const ensureDirAndWrite = async (
  appDirectory: string,
  fileFolder: string | undefined,
  fileName: string,
  content: string,
) => {
  const dirPath = join(appDirectory, fileFolder ?? '');

  await mkdir(dirPath, { recursive: true });
  await writeFile(join(dirPath, fileName), content);
};

const createDefaultRoleConfig = async ({
  displayName,
  appDirectory,
  fileFolder,
  fileName,
}: {
  displayName: string;
  appDirectory: string;
  fileFolder?: string;
  fileName: string;
}) => {
  const universalIdentifier = v4();

  const content = `import { defineRole } from 'twenty-sdk';

export const DEFAULT_ROLE_UNIVERSAL_IDENTIFIER =
  '${universalIdentifier}';

export default defineRole({
  universalIdentifier: DEFAULT_ROLE_UNIVERSAL_IDENTIFIER,
  label: '${displayName} default function role',
  description: '${displayName} default function role',
  canReadAllObjectRecords: true,
  canUpdateAllObjectRecords: true,
  canSoftDeleteAllObjectRecords: true,
  canDestroyAllObjectRecords: false,
});
`;

  await ensureDirAndWrite(appDirectory, fileFolder, fileName, content);
};

const createDefaultFrontComponent = async ({
  appDirectory,
  fileFolder,
  fileName,
}: {
  appDirectory: string;
  fileFolder?: string;
  fileName: string;
}) => {
  const universalIdentifier = v4();

  const content = `import { defineFrontComponent } from 'twenty-sdk';

export const HelloWorld = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Hello, World!</h1>
      <p>This is your first front component.</p>
    </div>
  );
};

export default defineFrontComponent({
  universalIdentifier: '${universalIdentifier}',
  name: 'hello-world-front-component',
  description: 'A sample front component',
  component: HelloWorld,
});
`;

  await ensureDirAndWrite(appDirectory, fileFolder, fileName, content);
};

const createDefaultFunction = async ({
  appDirectory,
  fileFolder,
  fileName,
}: {
  appDirectory: string;
  fileFolder?: string;
  fileName: string;
}) => {
  const universalIdentifier = v4();

  const content = `import { defineLogicFunction } from 'twenty-sdk';

const handler = async (): Promise<{ message: string }> => {
  return { message: 'Hello, World!' };
};

export default defineLogicFunction({
  universalIdentifier: '${universalIdentifier}',
  name: 'hello-world-logic-function',
  description: 'A simple logic function',
  timeoutSeconds: 5,
  handler,
  httpRouteTriggerSettings: {
    path: '/hello-world-logic-function',
    httpMethod: 'GET',
    isAuthRequired: false,
  },
});
`;

  await ensureDirAndWrite(appDirectory, fileFolder, fileName, content);
};

const createDefaultPreInstallFunction = async ({
  appDirectory,
  fileFolder,
  fileName,
}: {
  appDirectory: string;
  fileFolder?: string;
  fileName: string;
}) => {
  const universalIdentifier = v4();

  const content = `import { definePreInstallLogicFunction, type InstallLogicFunctionPayload } from 'twenty-sdk';

const handler = async (payload: InstallLogicFunctionPayload): Promise<void> => {
  console.log('Pre install logic function executed successfully!', payload.previousVersion);
};

export default definePreInstallLogicFunction({
  universalIdentifier: '${universalIdentifier}',
  name: 'pre-install',
  description: 'Runs before installation to prepare the application.',
  timeoutSeconds: 300,
  handler,
});
`;

  await ensureDirAndWrite(appDirectory, fileFolder, fileName, content);
};

const createDefaultPostInstallFunction = async ({
  appDirectory,
  fileFolder,
  fileName,
}: {
  appDirectory: string;
  fileFolder?: string;
  fileName: string;
}) => {
  const universalIdentifier = v4();

  const content = `import { definePostInstallLogicFunction, type InstallLogicFunctionPayload } from 'twenty-sdk';

const handler = async (payload: InstallLogicFunctionPayload): Promise<void> => {
  console.log('Post install logic function executed successfully!', payload.previousVersion);
};

export default definePostInstallLogicFunction({
  universalIdentifier: '${universalIdentifier}',
  name: 'post-install',
  description: 'Runs after installation to set up the application.',
  timeoutSeconds: 300,
  handler,
});
`;

  await ensureDirAndWrite(appDirectory, fileFolder, fileName, content);
};

const createExampleObject = async ({
  appDirectory,
  fileFolder,
  fileName,
}: {
  appDirectory: string;
  fileFolder?: string;
  fileName: string;
}) => {
  const objectUniversalIdentifier = v4();
  const nameFieldUniversalIdentifier = v4();

  const content = `import { defineObject, FieldType } from 'twenty-sdk';

export const EXAMPLE_OBJECT_UNIVERSAL_IDENTIFIER =
  '${objectUniversalIdentifier}';

export const NAME_FIELD_UNIVERSAL_IDENTIFIER =
  '${nameFieldUniversalIdentifier}';

export default defineObject({
  universalIdentifier: EXAMPLE_OBJECT_UNIVERSAL_IDENTIFIER,
  nameSingular: 'exampleItem',
  namePlural: 'exampleItems',
  labelSingular: 'Example item',
  labelPlural: 'Example items',
  description: 'A sample custom object',
  icon: 'IconBox',
  labelIdentifierFieldMetadataUniversalIdentifier: NAME_FIELD_UNIVERSAL_IDENTIFIER,
  fields: [
    {
      universalIdentifier: NAME_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'name',
      label: 'Name',
      description: 'Name of the example item',
      icon: 'IconAbc',
    },
  ],
});
`;

  await ensureDirAndWrite(appDirectory, fileFolder, fileName, content);
};

const createExampleField = async ({
  appDirectory,
  fileFolder,
  fileName,
}: {
  appDirectory: string;
  fileFolder?: string;
  fileName: string;
}) => {
  const universalIdentifier = v4();

  const content = `import { defineField, FieldType } from 'twenty-sdk';
import { EXAMPLE_OBJECT_UNIVERSAL_IDENTIFIER } from 'src/objects/example-object';

export default defineField({
  objectUniversalIdentifier: EXAMPLE_OBJECT_UNIVERSAL_IDENTIFIER,
  universalIdentifier: '${universalIdentifier}',
  type: FieldType.NUMBER,
  name: 'priority',
  label: 'Priority',
  description: 'Priority level for the example item (1-10)',
});
`;

  await ensureDirAndWrite(appDirectory, fileFolder, fileName, content);
};

const createExampleView = async ({
  appDirectory,
  fileFolder,
  fileName,
}: {
  appDirectory: string;
  fileFolder?: string;
  fileName: string;
}) => {
  const universalIdentifier = v4();
  const viewFieldUniversalIdentifier = v4();

  const content = `import { defineView, ViewKey } from 'twenty-sdk';
import { EXAMPLE_OBJECT_UNIVERSAL_IDENTIFIER, NAME_FIELD_UNIVERSAL_IDENTIFIER } from 'src/objects/example-object';

export const EXAMPLE_VIEW_UNIVERSAL_IDENTIFIER = '${universalIdentifier}';

export default defineView({
  universalIdentifier: EXAMPLE_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'All example items',
  objectUniversalIdentifier: EXAMPLE_OBJECT_UNIVERSAL_IDENTIFIER,
  icon: 'IconList',
  key: ViewKey.INDEX,
  position: 0,
  fields: [
    {
      universalIdentifier: '${viewFieldUniversalIdentifier}',
      fieldMetadataUniversalIdentifier: NAME_FIELD_UNIVERSAL_IDENTIFIER,
      position: 0,
      isVisible: true,
      size: 200,
    },
  ],
});
`;

  await ensureDirAndWrite(appDirectory, fileFolder, fileName, content);
};

const createExampleNavigationMenuItem = async ({
  appDirectory,
  fileFolder,
  fileName,
}: {
  appDirectory: string;
  fileFolder?: string;
  fileName: string;
}) => {
  const universalIdentifier = v4();

  const content = `import { defineNavigationMenuItem } from 'twenty-sdk';
import { EXAMPLE_VIEW_UNIVERSAL_IDENTIFIER } from 'src/views/example-view';

export default defineNavigationMenuItem({
  universalIdentifier: '${universalIdentifier}',
  name: 'example-navigation-menu-item',
  icon: 'IconList',
  color: 'blue',
  position: 0,
  type: 'VIEW',
  viewUniversalIdentifier: EXAMPLE_VIEW_UNIVERSAL_IDENTIFIER,
});
`;

  await ensureDirAndWrite(appDirectory, fileFolder, fileName, content);
};

const createExampleSkill = async ({
  appDirectory,
  fileFolder,
  fileName,
}: {
  appDirectory: string;
  fileFolder?: string;
  fileName: string;
}) => {
  const universalIdentifier = v4();

  const content = `import { defineSkill } from 'twenty-sdk';

export const EXAMPLE_SKILL_UNIVERSAL_IDENTIFIER =
  '${universalIdentifier}';

export default defineSkill({
  universalIdentifier: EXAMPLE_SKILL_UNIVERSAL_IDENTIFIER,
  name: 'example-skill',
  label: 'Example Skill',
  description: 'A sample skill for your application',
  icon: 'IconBrain',
  content: 'Add your skill instructions here. Skills provide context and capabilities to AI agents.',
});
`;

  await ensureDirAndWrite(appDirectory, fileFolder, fileName, content);
};

const createExampleAgent = async ({
  appDirectory,
  fileFolder,
  fileName,
}: {
  appDirectory: string;
  fileFolder?: string;
  fileName: string;
}) => {
  const universalIdentifier = v4();

  const content = `import { defineAgent } from 'twenty-sdk';

export const EXAMPLE_AGENT_UNIVERSAL_IDENTIFIER =
  '${universalIdentifier}';

export default defineAgent({
  universalIdentifier: EXAMPLE_AGENT_UNIVERSAL_IDENTIFIER,
  name: 'example-agent',
  label: 'Example Agent',
  description: 'A sample AI agent for your application',
  icon: 'IconRobot',
  prompt: 'You are a helpful assistant. Help users with their questions and tasks.',
});
`;

  await ensureDirAndWrite(appDirectory, fileFolder, fileName, content);
};

const createApplicationConfig = async ({
  displayName,
  description,
  appDirectory,
  fileFolder,
  fileName,
}: {
  displayName: string;
  description?: string;
  appDirectory: string;
  fileFolder?: string;
  fileName: string;
}) => {
  const universalIdentifier = v4();

  const content = `import { defineApplication } from 'twenty-sdk';
import { DEFAULT_ROLE_UNIVERSAL_IDENTIFIER } from 'src/roles/default-role';

export const APPLICATION_UNIVERSAL_IDENTIFIER =
  '${universalIdentifier}';

export default defineApplication({
  universalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
  displayName: '${displayName}',
  description: '${description ?? ''}',
  defaultRoleUniversalIdentifier: DEFAULT_ROLE_UNIVERSAL_IDENTIFIER,
});
`;

  await ensureDirAndWrite(appDirectory, fileFolder, fileName, content);
};

const createYarnLock = async (appDirectory: string) => {
  const yarnLockContent = `# THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
# yarn lockfile v1
`;

  await writeFile(join(appDirectory, 'yarn.lock'), yarnLockContent);
};

const createPackageJson = async ({
  appName,
  appDirectory,
  sdkVersion,
  includeExampleIntegrationTest,
}: {
  appName: string;
  appDirectory: string;
  sdkVersion: string;
  includeExampleIntegrationTest: boolean;
}) => {
  const scripts: Record<string, string> = {
    twenty: 'twenty',
    lint: 'oxlint -c .oxlintrc.json .',
    'lint:fix': 'oxlint --fix -c .oxlintrc.json .',
  };

  const devDependencies: Record<string, string> = {
    typescript: '^5.9.3',
    '@types/node': '^24.7.2',
    '@types/react': '^19.0.0',
    react: '^19.0.0',
    'react-dom': '^19.0.0',
    oxlint: '^0.16.0',
    'twenty-sdk': sdkVersion,
  };

  if (includeExampleIntegrationTest) {
    scripts.test = 'vitest run';
    scripts['test:watch'] = 'vitest';
    devDependencies.vitest = '^3.1.1';
    devDependencies['vite-tsconfig-paths'] = '^4.2.1';
  }

  const packageJson = {
    name: appName,
    version: '0.1.0',
    license: 'MIT',
    engines: {
      node: '^24.5.0',
      npm: 'please-use-yarn',
      yarn: '>=4.0.2',
    },
    packageManager: 'yarn@4.9.2',
    scripts,
    devDependencies,
  };

  await writeFile(
    join(appDirectory, 'package.json'),
    JSON.stringify(packageJson, null, 2),
    'utf8',
  );
};
