import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryAnswerAttachmentsRepository } from '@test/repositories/in-memory-answer-attachments-repository';
import { InMemoryAnswersRepository } from '@test/repositories/in-memory-answers-repository';

import { AnswerQuestionUseCase } from './answer-question';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: AnswerQuestionUseCase;

describe('AnswerQuestionUseCase', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    );

    sut = new AnswerQuestionUseCase(inMemoryAnswersRepository);
  });

  it('should be able create an answer', async () => {
    const result = await sut.execute({
      instructorId: '1',
      questionId: '2',
      content: 'Content',
      attachmentsIds: ['1', '2'],
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryAnswersRepository.answers[0]).toEqual(result.value?.answer);
    expect(
      inMemoryAnswersRepository.answers[0].attachments.currentItems,
    ).toHaveLength(2);
    expect(
      inMemoryAnswersRepository.answers[0].attachments.currentItems,
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
    ]);
  });
});
