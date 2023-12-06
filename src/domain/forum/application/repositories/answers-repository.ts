import { PaginationParams } from '@/core/repositories/pagination-params';

import { Answer } from '../../enterprise/entities/answer';

export interface AnswersRepository {
  findById(answerId: string): Promise<Answer | null>;
  findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<Answer[]>;
  save(answer: Answer): Promise<void>;
  create(answer: Answer): Promise<void>;
  delete(answer: Answer): Promise<void>;
}
