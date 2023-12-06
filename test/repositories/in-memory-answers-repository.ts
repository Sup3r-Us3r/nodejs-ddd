import { DomainEvents } from '@/core/events/domain-events';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository';
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';
import { Answer } from '@/domain/forum/enterprise/entities/answer';

export class InMemoryAnswersRepository implements AnswersRepository {
  public answers: Answer[] = [];

  constructor(
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async findById(answerId: string): Promise<Answer | null> {
    const answer = this.answers.find(
      answer => answer.id.toString() === answerId,
    );

    return answer ?? null;
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<Answer[]> {
    const answers = this.answers
      .filter(item => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return answers;
  }

  async save(answer: Answer): Promise<void> {
    const answerIndex = this.answers.findIndex(item => item.id === answer.id);

    this.answers[answerIndex] = answer;

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async create(answer: Answer): Promise<void> {
    this.answers.push(answer);

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async delete(answer: Answer): Promise<void> {
    const answerIndex = this.answers.findIndex(item => item.id === answer.id);

    this.answers.splice(answerIndex, 1);

    this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString());
  }
}
