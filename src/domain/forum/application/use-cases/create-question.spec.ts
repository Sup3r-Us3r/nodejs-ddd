import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryQuestionAttachmentsRepository } from '@test/repositories/in-memory-question-attachments-repository';

import { CreateQuestionUseCase } from './create-question';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: CreateQuestionUseCase;

describe('CreateQuestionUseCase', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );

    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository);
  });

  it('should be able create an question', async () => {
    const result = await sut.execute({
      authorId: '1',
      title: 'Title',
      content: 'Content',
      attachmentsIds: ['1', '2'],
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryQuestionsRepository.questions[0].id).toEqual(
      result.value?.question.id,
    );
    expect(
      inMemoryQuestionsRepository.questions[0].attachments.currentItems,
    ).toHaveLength(2);
    expect(
      inMemoryQuestionsRepository.questions[0].attachments.currentItems,
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
    ]);
  });
});
