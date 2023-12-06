import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { makeAnswer } from '@test/factories/make-answer';
import { makeQuestion } from '@test/factories/make-question';
import { InMemoryAnswerAttachmentsRepository } from '@test/repositories/in-memory-answer-attachments-repository';
import { InMemoryAnswersRepository } from '@test/repositories/in-memory-answers-repository';
import { InMemoryQuestionAttachmentsRepository } from '@test/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionsRepository } from '@test/repositories/in-memory-questions-repository';

import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: ChooseQuestionBestAnswerUseCase;

describe('ChooseQuestionBestAnswerUseCase', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    );

    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryQuestionsRepository,
      inMemoryAnswersRepository,
    );
  });

  it('should be able to choose the question best answer', async () => {
    const question = makeQuestion();
    const answer = makeAnswer({
      questionId: question.id,
    });

    await inMemoryQuestionsRepository.create(question);
    await inMemoryAnswersRepository.create(answer);

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: question.authorId.toString(),
    });

    expect(inMemoryQuestionsRepository.questions[0].id).toEqual(question.id);
    expect(inMemoryQuestionsRepository.questions[0].bestAnswerId).toEqual(
      answer.id,
    );
  });

  it('should not be able to choose another user question best answer', async () => {
    const question = makeQuestion({
      authorId: new UniqueEntityID('author-1'),
    });
    const answer = makeAnswer({
      questionId: question.id,
    });

    await inMemoryQuestionsRepository.create(question);
    await inMemoryAnswersRepository.create(answer);

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: 'author-2',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
