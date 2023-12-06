import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public questionComments: QuestionComment[] = [];

  async findById(questionCommentId: string): Promise<QuestionComment | null> {
    const questionComment = this.questionComments.find(
      questionComment => questionComment.id.toString() === questionCommentId,
    );

    return questionComment ?? null;
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<QuestionComment[]> {
    const questionComments = this.questionComments
      .filter(item => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return questionComments;
  }

  async create(questionComment: QuestionComment): Promise<void> {
    this.questionComments.push(questionComment);
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    const questionIndex = this.questionComments.findIndex(
      item => item.id === questionComment.id,
    );

    this.questionComments.splice(questionIndex, 1);
  }
}
