import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';

export class InMemoryQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  public questionAttachments: QuestionAttachment[] = [];

  async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]> {
    const questionAttachments = this.questionAttachments.filter(
      item => item.questionId.toString() === questionId,
    );

    return questionAttachments;
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    const questionAttachments = this.questionAttachments.filter(
      item => item.questionId.toString() !== questionId,
    );

    this.questionAttachments = questionAttachments;
  }
}
