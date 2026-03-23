import { executeInit, type InitOptions } from 'twenty-sdk/cli';

export class CreateAppCommand {
  async execute(options: InitOptions = {}): Promise<void> {
    await executeInit(options);
  }
}
