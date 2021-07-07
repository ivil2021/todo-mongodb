const COMPLETED = "COMPLETED";
const ALL = "ALL";
const ACTIVE = "ACTIVE";

class Todo {
  constructor(name, id, isDone = false) {
    this.name = name;
    this._isDone = isDone;
    this._id = id;
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get isDone() {
    return this._isDone;
  }

  set isDone(value) {
    this._isDone = value;
  }

  toggle(isDone) {
    this.isDone = isDone;
  }
}

class TodoList {
  constructor(items = []) {
    this.list = items;
  }

  getTodos() {
    return this.list;
  }

  getElementById(id) {
    return this.list.find((element) => {
      return element.id === id;
    });
  }

  clear() {
    this.list = [];
  }

  addElement(element) {
    this.list.push(element);
    return this.list;
  }

  removeElement(id) {
    let temp = [];
    this.list.forEach((element) => {
      if (id != element.id) {
        temp.push(element);
      }
    });
    this.list = temp;
    return this.list;
  }

  filterByStatus(status) {
    let filteredArray = [];

    switch (status) {
      case ALL:
        return this.list;
      case COMPLETED:
        filteredArray = this.list.filter((element) => {
          return element.isDone === true;
        });
        return filteredArray;
      case ACTIVE:
        filteredArray = this.list.filter((element) => {
          return element.isDone === false;
        });
        return filteredArray;
      default:
        return this.list;
    }
  }

  removeByStatus(status) {
    let filteredArray = [];

    switch (status) {
      case ALL:
        this.list = [];
        return this.list;
      case COMPLETED:
        filteredArray = this.list.filter((element) => {
          return element.isDone !== true;
        });
        this.list = filteredArray;
        return this.list;
      case ACTIVE:
        filteredArray = this.list.filter((element) => {
          return element.isDone !== false;
        });
        this.list = filteredArray;
        return this.list;
      default:
        return this.list;
    }
  }
}
