import { UniqueEntityID } from './unique-entity-id';

export abstract class Entity<T> {
  private _id: UniqueEntityID;
  protected props: T;

  get id() {
    return this._id;
  }

  protected constructor(props: T, id?: UniqueEntityID) {
    this._id = id ?? new UniqueEntityID();
    this.props = props;
  }

  public equals(entity: Entity<any>) {
    if (entity === this) {
      return true;
    }

    if (entity.id === this._id) {
      return true;
    }

    return false;
  }
}
