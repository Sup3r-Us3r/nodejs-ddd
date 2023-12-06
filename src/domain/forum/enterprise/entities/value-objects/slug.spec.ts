import { Slug } from './slug';

test('it should be able to create a new slug from text', () => {
  const slug = Slug.createFromText('Slug example!');

  expect(slug.value).toEqual('slug-example');
});
