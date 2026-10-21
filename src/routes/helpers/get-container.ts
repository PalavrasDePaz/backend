import { Container } from 'inversify';
import { buildProviderModule } from 'inversify-binding-decorators';

let containerInstance: Container | null = null;

export const getContainer = (): Container => {
  if (!containerInstance) {
    containerInstance = new Container();
    containerInstance.load(buildProviderModule());
  }
  return containerInstance;
};
