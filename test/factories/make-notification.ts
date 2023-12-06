import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Notification,
  NotificationProps,
} from '@/domain/notification/enterprise/entities/notification';
import { faker } from '@faker-js/faker';

export function makeNotification(
  override: Partial<NotificationProps> = {},
  id?: UniqueEntityID,
): Notification {
  const notification = Notification.create(
    {
      recipientId: new UniqueEntityID(),
      title: faker.lorem.sentence(5),
      content: faker.lorem.sentence(10),
      ...override,
    },
    id,
  );

  return notification;
}
