import { Either, left, right } from './either';

function doSomething(shouldSuccess: boolean): Either<string, string> {
  if (shouldSuccess) {
    return right('success');
  } else {
    return left('error');
  }
}

test('success result', () => {
  const result = doSomething(true);

  expect(result.isRight()).toBeTruthy();
  expect(result.isLeft()).toBeFalsy();
});

test('error result', () => {
  const result = doSomething(false);

  expect(result.isRight()).toBeFalsy();
  expect(result.isLeft()).toBeTruthy();
});
