import { DomainEvents } from '@/core/events/domain-events';
import { EventHandler } from '@/core/events/event-handler';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { AnswerCreatedEvent } from '@/domain/forum/enterprise/events/answer-created-event';

import { SendNotificationUseCase } from '../use-cases/send-notification';

export class OnAnswerCreated implements EventHandler {
  constructor(
    private questionRepository: QuestionsRepository,
    private sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this),
      AnswerCreatedEvent.name,
    );
  }

  private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent) {
    const question = await this.questionRepository.findById(
      answer.questionId.toString(),
    );

    if (question) {
      await this.sendNotificationUseCase.execute({
        recipientId: question.authorId.toString(),
        title: `New answer in "${question.title
          .substring(0, 40)
          .concat('...')}"`,
        content: answer.excerpt,
      });
    }
  }
}
