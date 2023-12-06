import { InMemoryNotificationsRepository } from '@test/repositories/in-memory-notifications-repository';

import { SendNotificationUseCase } from './send-notification';

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sut: SendNotificationUseCase;

describe('SendNotificationUseCase', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();

    sut = new SendNotificationUseCase(inMemoryNotificationsRepository);
  });

  it('should be able send a notification', async () => {
    const result = await sut.execute({
      recipientId: '1',
      title: 'New notification',
      content: 'Notification content',
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryNotificationsRepository.notifications[0].id).toEqual(
      result.value?.notification.id,
    );
  });
});
