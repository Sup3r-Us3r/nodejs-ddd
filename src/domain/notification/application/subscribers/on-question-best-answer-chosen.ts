import { DomainEvents } from '@/core/events/domain-events';
import { EventHandler } from '@/core/events/event-handler';
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { AnswerCreatedEvent } from '@/domain/forum/enterprise/events/answer-created-event';
import { QuestionBestAnswerChosenEvent } from '@/domain/forum/enterprise/events/question-best-answer-chosen-event';

import { SendNotificationUseCase } from '../use-cases/send-notification';

export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendQuestionBestAnswerNotification.bind(this),
      QuestionBestAnswerChosenEvent.name,
    );
  }

  private async sendQuestionBestAnswerNotification({
    question,
    bestAnswerId,
  }: QuestionBestAnswerChosenEvent) {
    const answer = await this.answersRepository.findById(
      bestAnswerId.toString(),
    );

    if (answer) {
      await this.sendNotificationUseCase.execute({
        recipientId: answer.authorId.toString(),
        title: 'Your answer was choice!',
        content: `The answer you send in "${question.title
          .substring(0, 20)
          .concat('...')}" was the author's choice!`,
      });
    }
  }
}
