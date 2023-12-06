import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { makeAnswer } from '@test/factories/make-answer';
import { makeAnswerAttachment } from '@test/factories/make-answer-attachment';
import { InMemoryAnswerAttachmentsRepository } from '@test/repositories/in-memory-answer-attachments-repository';
import { InMemoryAnswersRepository } from '@test/repositories/in-memory-answers-repository';

import { DeleteAnswerUseCase } from './delete-answer';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: DeleteAnswerUseCase;

describe('DeleteAnswerUseCase', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    );

    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository);
  });

  it('should be able to delete a answer by id', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1'),
    );

    await inMemoryAnswersRepository.create(newAnswer);

    inMemoryAnswerAttachmentsRepository.answerAttachments.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    );

    await sut.execute({
      authorId: 'author-1',
      answerId: 'answer-1',
    });

    expect(inMemoryAnswersRepository.answers).toHaveLength(0);
    expect(inMemoryAnswerAttachmentsRepository.answerAttachments).toHaveLength(
      0,
    );
  });

  it('should not be able to delete a answer by id from another user', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1'),
    );

    await inMemoryAnswersRepository.create(newAnswer);

    const result = await sut.execute({
      authorId: '1234567',
      answerId: 'answer-1',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
