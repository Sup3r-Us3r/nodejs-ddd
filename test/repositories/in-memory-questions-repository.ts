import { DomainEvents } from '@/core/events/domain-events';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { Question } from '@/domain/forum/enterprise/entities/question';

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public questions: Question[] = [];

  constructor(
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async findById(questionId: string): Promise<Question | null> {
    const question = this.questions.find(
      question => question.id.toString() === questionId,
    );

    return question ?? null;
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = this.questions.find(
      question => question.slug.value === slug,
    );

    return question ?? null;
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = this.questions
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return questions;
  }

  async save(question: Question): Promise<void> {
    const questionIndex = this.questions.findIndex(
      item => item.id === question.id,
    );

    this.questions[questionIndex] = question;

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async create(question: Question): Promise<void> {
    this.questions.push(question);

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async delete(question: Question): Promise<void> {
    const questionIndex = this.questions.findIndex(
      item => item.id === question.id,
    );

    this.questions.splice(questionIndex, 1);

    this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString(),
    );
  }
}
