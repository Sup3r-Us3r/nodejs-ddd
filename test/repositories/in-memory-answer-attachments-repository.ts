import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';

export class InMemoryAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  public answerAttachments: AnswerAttachment[] = [];

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const answerAttachments = this.answerAttachments.filter(
      item => item.answerId.toString() === answerId,
    );

    return answerAttachments;
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    const answerAttachments = this.answerAttachments.filter(
      item => item.answerId.toString() !== answerId,
    );

    this.answerAttachments = answerAttachments;
  }
}
