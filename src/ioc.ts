import { Container, decorate, injectable } from 'inversify';
import { buildProviderModule } from 'inversify-binding-decorators';
import { Controller } from 'tsoa';
import { IocContainer } from 'tsoa';
import { EmailManager } from './services/email-service/email-manager';

export class InversifyAdapter implements IocContainer {
  private container: Container;

  constructor(container: Container) {
    this.container = container;
  }

  get<T>(controller: { prototype: T }): T {
    const serviceIdentifier = controller as unknown as string;
    return this.container.get<T>(serviceIdentifier);
  }
}

const container = new Container();

decorate(injectable(), Controller);

container.load(buildProviderModule());

console.log(container.isBound(EmailManager));

const iocContainer = new InversifyAdapter(container);

export { iocContainer };
