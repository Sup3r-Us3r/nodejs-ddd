import { makeQuestion } from '@test/factories/make-question';
import { InMemoryQuestionAttachmentsRepository } from '@test/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionsRepository } from '@test/repositories/in-memory-questions-repository';

import { FetchRecentQuestionsUseCase } from './fetch-recent-questions';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: FetchRecentQuestionsUseCase;

describe('FetchRecentQuestionsUseCase', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository);
  });

  it('should be able fetch recent questions', async () => {
    await inMemoryQuestionsRepository.create(
      makeQuestion({
        createdAt: new Date(2023, 0, 1),
      }),
    );
    await inMemoryQuestionsRepository.create(
      makeQuestion({
        createdAt: new Date(2023, 0, 3),
      }),
    );
    await inMemoryQuestionsRepository.create(
      makeQuestion({
        createdAt: new Date(2023, 0, 2),
      }),
    );

    const result = await sut.execute({
      page: 1,
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2023, 0, 3) }),
      expect.objectContaining({ createdAt: new Date(2023, 0, 2) }),
      expect.objectContaining({ createdAt: new Date(2023, 0, 1) }),
    ]);
  });

  it('should be able fetch paginated recent questions', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionsRepository.create(makeQuestion());
    }

    const result = await sut.execute({
      page: 2,
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value?.questions).toHaveLength(2);
  });
});
