import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { DomainEvent } from '@/core/events/domain-event';

import { Answer } from '../entities/answer';

export class AnswerCreatedEvent implements DomainEvent {
  public ocurredAt: Date;
  public answer: Answer;

  constructor(answer: Answer) {
    this.ocurredAt = new Date();
    this.answer = answer;
  }

  public getAggregateId(): UniqueEntityID {
    return this.answer.id;
  }
}
