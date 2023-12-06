import { makeQuestion } from '@test/factories/make-question';
import { InMemoryQuestionAttachmentsRepository } from '@test/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionCommentsRepository } from '@test/repositories/in-memory-question-comments-repository';
import { InMemoryQuestionsRepository } from '@test/repositories/in-memory-questions-repository';

import { CommentOnQuestionUseCase } from './comment-on-question';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: CommentOnQuestionUseCase;

describe('CommentOnQuestionUseCase', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();

    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionCommentsRepository,
    );
  });

  it('should be able to comment on question', async () => {
    const question = makeQuestion();

    await inMemoryQuestionsRepository.create(question);

    await sut.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
      content: 'Comment test',
    });

    expect(
      inMemoryQuestionCommentsRepository.questionComments[0].content,
    ).toEqual('Comment test');
  });
});
